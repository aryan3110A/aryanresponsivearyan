import os
import torch
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from PIL import Image
from datetime import datetime
from diffusers import FluxKontextPipeline

app = Flask(__name__)

# Disable Flask-CORS and handle CORS manually for more control
# CORS(app, origins=[
#     "http://localhost:3000",    
#     "https://www.wildmindai.com",
#     "https://api.wildmindai.com",
#     "https://84a198721ebc.ngrok-free.app",
#     "https://9fbe9881d16c.ngrok-free.app"
# ], supports_credentials=True, allow_headers=["Content-Type", "Authorization"], methods=["GET", "POST", "OPTIONS"])

# Manual CORS handling
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in ["http://localhost:3000", "https://www.wildmindai.com", "https://api.wildmindai.com", "https://84a198721ebc.ngrok-free.app", "https://9fbe9881d16c.ngrok-free.app"]:
        response.headers['Access-Control-Allow-Origin'] = origin
    else:
        response.headers['Access-Control-Allow-Origin'] = 'https://www.wildmindai.com'
    
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# ─── Load Shared FluxKontext Pipeline ─────────────────────────
print("🔄 Loading FLUX.1-Kontext pipeline...")
flux_pipe = FluxKontextPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-Kontext-dev",
    torch_dtype=torch.bfloat16
).to("cuda")
print("✅ FLUX pipeline loaded.")

# ─── Output Directory ─────────────────────────────────────────
output_dir = "outputs"
os.makedirs(output_dir, exist_ok=True)

# ─── Prompt Enhancers ─────────────────────────────────────────
def enhance_logo_prompt(user_prompt: str):
    return f"{user_prompt}, professional logo, minimal design, clean lines"

def optimize_mockup_prompt(user_prompt):
    universal = "Same model uses the product naturally in the scene."
    user_part = user_prompt.strip().capitalize()
    return f"{universal} {user_part}"[:300]

# ─── Utilities ────────────────────────────────────────────────
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

    if product_resized.mode == "RGBA":
        reference.paste(product_resized, (product_x, product_y), mask=product_resized.split()[3])
    else:
        reference.paste(product_resized, (product_x, product_y))

    return reference

# ─── Single Smart Generate Endpoint ───────────────────────────
@app.route("/generate", methods=["POST"])
def generate():
    
    try:
        if request.content_type.startswith("application/json"):
            # ─── Logo Generation ───
            data = request.get_json()
            prompt = enhance_logo_prompt(data.get("prompt", "").strip())
            num_images = int(data.get("num_images", 1))
            urls = []

            for i in range(num_images):
                generator = torch.manual_seed(42 + i)
                image = flux_pipe(
                    prompt=prompt,
                    guidance_scale=4.5,
                    num_inference_steps=45,
                    generator=generator
                ).images[0]
                ts = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"logo_{ts}_{i}.png"
                path = os.path.join(output_dir, filename)
                image.save(path)
                urls.append(f"/download/{filename}")
                print(f"✅ Logo generated: {filename}")

            return jsonify({ "image_urls": urls })

        elif request.content_type.startswith("multipart/form-data"):
            # ─── Product With Model Pose ───
            model_file = request.files["model_image"]
            product_file = request.files["product_image"]
            user_prompt = request.form.get("scene_desc", "studio setting")
            width = int(request.form.get("width", 768))
            height = int(request.form.get("height", 768))

            width = max(512, min(width, 2048)) - (max(512, min(width, 2048)) % 16)
            height = max(512, min(height, 2048)) - (max(512, min(height, 2048)) % 16)

            model_img = Image.open(model_file).convert("RGB")
            product_img = Image.open(product_file).convert("RGB")
            reference = create_reference_image(model_img, product_img, width, height)
            prompt = optimize_mockup_prompt(user_prompt)

            result = flux_pipe(
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
            filename = f"mockup_{timestamp}.png"
            output_path = os.path.join(output_dir, filename)
            result.save(output_path)
            print(f"✅ Mockup generated: {filename}")

            return jsonify({ "image_url": f"/download/{filename}" })

        else:
            return jsonify({ "error": "Unsupported content type" }), 400

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({ "error": str(e) }), 500

# ─── OPTIONS Route for CORS Preflight ─────────────────────────
@app.route("/generate", methods=["OPTIONS"])
def handle_options():
    """Handle preflight OPTIONS requests"""
    return '', 200

# ─── Download Route ───────────────────────────────────────────
@app.route("/download/<filename>")
def download_file(filename):
    return send_from_directory(output_dir, filename)

@app.route("/health")
def health():
    origin = request.headers.get('Origin', 'No Origin')
    return jsonify({ 
        "status": "healthy", 
        "model": "FluxKontext", 
        "output_dir": output_dir,
        "origin": origin,
        "cors_enabled": True
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7861, debug=True)
