import os
import torch
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from diffusers import DiffusionPipeline
from PIL import Image
from datetime import datetime

app = Flask(__name__)
# Allow only Vercel frontend for CORS
CORS(app, origins=[
    "http://localhost:3000",
    "https://www.wildmindai.com",
    "https://api.wildmindai.com",
    "https://*.vercel.app"
])
# ─── Model Setup ────────────────────────────────────────────────
model_id = "black-forest-labs/FLUX.1-Kontext-dev"
pipe = DiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.bfloat16).to("cuda")

output_dir = "outputs"
os.makedirs(output_dir, exist_ok=True)

# ─── Image Utilities ────────────────────────────────────────────
def resize_and_pad(image, size=(512, 512), bg_color=(255, 255, 255)):
    image.thumbnail(size, Image.LANCZOS)
    result = Image.new("RGB", size, bg_color)
    offset = ((size[0] - image.width) // 2, (size[1] - image.height) // 2)
    result.paste(image, offset)
    return result

def create_reference_image(model_img, product_img, width=1024, height=1024):
    model_resized = resize_and_pad(model_img, (int(width * 0.6), height))
    product_resized = resize_and_pad(product_img, (int(width * 0.4), int(width * 0.4)))

    reference = Image.new("RGB", (width, height), (255, 255, 255))
    reference.paste(model_resized, (0, 0))

    product_x = width - product_resized.width - 40
    product_y = (height - product_resized.height) // 2

    # Only apply mask if RGBA
    if product_resized.mode == "RGBA":
        reference.paste(product_resized, (product_x, product_y), mask=product_resized.split()[3])
    else:
        reference.paste(product_resized, (product_x, product_y))

    return reference

# ─── Short Universal Prompt (Under 77 Tokens) ──────────────────
def optimize_prompt(user_prompt):
    universal = "Same model uses the product naturally in the scene."
    user_part = user_prompt.strip().capitalize()
    full_prompt = f"{universal} {user_part}"
    return full_prompt[:300]  # 77 tokens ≈ 300 characters

# ─── Main Route ─────────────────────────────────────────────────
@app.route("/generate", methods=["POST"])
def generate():
    try:
        model_file = request.files["model_image"]
        product_file = request.files["product_image"]
        user_prompt = request.form.get("scene_desc", "studio setting")
        width = int(request.form.get("width", 768))
        height = int(request.form.get("height", 768))

        width = max(512, min(width, 2048)) - (max(512, min(width, 2048)) % 16)
        height = max(512, min(height, 2048)) - (max(512, min(height, 2048)) % 16)

        model_img = Image.open(model_file).convert("RGB")
        product_img = Image.open(product_file).convert("RGB")

        reference = create_reference_image(model_img, product_img, width=width, height=height)
        prompt = optimize_prompt(user_prompt)

        result = pipe(
            image=reference,
            prompt=prompt,
            guidance_scale=4.0,
            num_inference_steps=35,
            generator=torch.manual_seed(42),
            width=width,
            height=height,
            negative_prompt="collage, side by side, split frame, duplicate product, unrealistic"
        ).images[0]

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"generated_{timestamp}.png"
        output_path = os.path.join(output_dir, filename)
        result.save(output_path)

        return jsonify({ "image_url": f"/download/{filename}" })

    except Exception as e:
        print("❌ Error generating image:", e)
        return jsonify({ "error": str(e) }), 500

# ─── Download Endpoint ──────────────────────────────────────────
@app.route("/download/<filename>")
def download_file(filename):
    return send_file(os.path.join(output_dir, filename), mimetype="image/png")

# ─── Entry Point ────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7861)
