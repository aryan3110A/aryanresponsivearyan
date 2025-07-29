import os
import torch
from datetime import datetime
from PIL import Image
import numpy as np
import cv2
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from diffusers import FluxKontextPipeline

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",
    "https://www.wildmindai.com",
    "https://api.wildmindai.com",
    "https://*.vercel.app"
])
pipe = FluxKontextPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-Kontext-dev",
    torch_dtype=torch.bfloat16,
).to("cuda")

output_dir = os.path.abspath("logos_generated")
os.makedirs(output_dir, exist_ok=True)

def generate_logo(prompt, seed=42):
    generator = torch.manual_seed(seed)
    image = pipe(
        prompt=prompt,
        guidance_scale=6.5,
        num_inference_steps=40,
        generator=generator
    ).images[0]
    return image

def make_transparent(image):
    image = image.convert("RGBA")
    np_image = np.array(image)
    gray = cv2.cvtColor(np_image[:, :, :3], cv2.COLOR_RGB2GRAY)
    edges = cv2.Canny(gray, threshold1=30, threshold2=120)
    edges = cv2.dilate(edges, None, iterations=2)
    mask = cv2.GaussianBlur(edges, (5, 5), 0)
    _, alpha = cv2.threshold(mask, 10, 255, cv2.THRESH_BINARY)
    np_image[:, :, 3] = alpha
    return Image.fromarray(np_image)

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    prompt = data.get("prompt", "").strip()
    num_images = int(data.get("num_images", 1))
    if not prompt:
        return jsonify({"error": "Prompt required"}), 400

    urls = []
    for i in range(num_images):
        image = generate_logo(prompt, seed=42 + i)
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        base_name = f"logo_{prompt.replace(' ', '_')[:30]}_{ts}_{i}"
        transparent = make_transparent(image)
        transparent_path = os.path.join(output_dir, base_name + "_transparent.png")
        transparent.save(transparent_path)
        urls.append(f"/download/{base_name}_transparent.png")
    return jsonify({"image_urls": urls})

@app.route("/download/<filename>")
def download_file(filename):
    return send_from_directory(output_dir, filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7862)
