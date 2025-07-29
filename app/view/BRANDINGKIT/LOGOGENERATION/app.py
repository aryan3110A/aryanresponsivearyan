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

# Global variable for the pipeline
pipe = None

def load_model():
    global pipe
    try:
        print("🔄 Loading FluxKontextPipeline...")
        pipe = FluxKontextPipeline.from_pretrained(
            "black-forest-labs/FLUX.1-Kontext-dev",
            torch_dtype=torch.bfloat16,
        ).to("cuda")
        print("✅ Model loaded successfully")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        raise e

# Load model on startup
try:
    load_model()
except Exception as e:
    print(f"❌ Model loading failed: {e}")

output_dir = os.path.abspath("logos_generated")
os.makedirs(output_dir, exist_ok=True)

# ─── Minimal Prompt Enhancer ────────────────────────────────
def enhance_prompt(user_prompt):
    # Only use 3 high-value modifiers
    short_enhancer = "professional logo, bold lines, clean design"
    return f"{user_prompt}, {short_enhancer}"

# ─── Generate Logo ───────────────────────────────────────────
def generate_logo(prompt, seed=42):
    if pipe is None:
        raise Exception("Model not loaded")
    
    try:
        generator = torch.manual_seed(seed)
        image = pipe(
            prompt=prompt,
            guidance_scale=6.5,
            num_inference_steps=40,
            generator=generator
        ).images[0]
        return image
    except Exception as e:
        print(f"❌ Generation failed: {e}")
        raise e

@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data received"}), 400
            
        prompt = data.get("prompt", "").strip()
        num_images = int(data.get("num_images", 1))
        
        print(f"📝 Received request: prompt='{prompt}', num_images={num_images}")
        
        if not prompt:
            return jsonify({"error": "Prompt required"}), 400

        if pipe is None:
            return jsonify({"error": "Model not loaded"}), 503

        urls = []
        for i in range(num_images):
            try:
                image = generate_logo(prompt, seed=42 + i)
                ts = datetime.now().strftime("%Y%m%d_%H%M%S")
                base_name = f"logo_{prompt.replace(' ', '_')[:30]}_{ts}_{i}"
                logo_path = os.path.join(output_dir, base_name + ".png")
                image.save(logo_path)
                urls.append(f"/download/{base_name}.png")
                print(f"✅ Generated logo {i+1}/{num_images}: {base_name}.png")
            except Exception as e:
                print(f"❌ Failed to generate logo {i+1}: {e}")
                return jsonify({"error": f"Failed to generate logo {i+1}: {str(e)}"}), 500
                
        return jsonify({"image_urls": urls})
        
    except Exception as e:
        print(f"❌ Generate endpoint error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/download/<filename>")
def download_file(filename):
    try:
        return send_from_directory(output_dir, filename)
    except Exception as e:
        print(f"❌ Download error for {filename}: {e}")
        return jsonify({"error": "File not found"}), 404

@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": pipe is not None,
        "output_dir": output_dir
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7862)
