import torch
from diffusers import (
    FluxPipeline, BitsAndBytesConfig,
    SD3Transformer2DModel, StableDiffusion3Pipeline, DiffusionPipeline
)
from transformers import T5EncoderModel
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import base64
import io
import threading
import gc

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",
    "https://www.wildmindai.com",
    "https://api.wildmindai.com",
    "https://*.vercel.app"
])

models = {}
model_loading = {}
model_lock = threading.Lock()
current_active_model = None  # 🆕 track which model is active in GPU

# ─── UTIL ────────────────────────────────────────────────

def image_to_base64(image):
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return f"data:image/png;base64,{base64.b64encode(buffer.getvalue()).decode()}"

def convert_images_to_urls(images):
    return [image_to_base64(img) for img in images]

def extract_params(data):
    if not data: data = {}
    return {
        'prompt': data.get('prompt', 'A beautiful landscape'),
        'width': data.get('width', 768),
        'height': data.get('height', 768),
        'num_inference_steps': data.get('num_inference_steps', 40),
        'guidance_scale': data.get('guidance_scale', 4.5),
        'num_images': data.get('num_images', 1),
        'max_sequence_length': data.get('max_sequence_length', 512),
        'denoising_end': data.get('denoising_end', 0.8),
        'denoising_start': data.get('denoising_start', 0.8),
    }

# ─── MODEL LOADERS ───────────────────────────────────────

def load_flux_dev():
    print("🔄 Loading FluxDev...")
    pipe = FluxPipeline.from_pretrained("black-forest-labs/FLUX.1-dev", torch_dtype=torch.float16)
    pipe.to("cuda")
    with model_lock:
        models["flux-dev"] = pipe
        model_loading["flux-dev"] = False
    print("✅ FluxDev loaded")

def load_flux_schnell():
    print("🔄 Loading FluxSchnell...")
    pipe = FluxPipeline.from_pretrained("black-forest-labs/FLUX.1-schnell", torch_dtype=torch.float16)
    pipe.to("cuda")
    with model_lock:
        models["flux-schnell"] = pipe
        model_loading["flux-schnell"] = False
    print("✅ FluxSchnell loaded")

def load_stable_sd3(model_key, model_id):
    print(f"🔄 Loading {model_key}...")
    nf4 = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4", bnb_4bit_compute_dtype=torch.float16)
    transformer = SD3Transformer2DModel.from_pretrained(model_id, subfolder="transformer", quantization_config=nf4, torch_dtype=torch.float16)
    encoder = T5EncoderModel.from_pretrained("diffusers/t5-nf4", torch_dtype=torch.float16).to("cuda")
    pipe = StableDiffusion3Pipeline.from_pretrained(model_id, transformer=transformer, text_encoder_3=encoder, torch_dtype=torch.float16)
    pipe.to("cuda")
    with model_lock:
        models[model_key] = pipe
        model_loading[model_key] = False
    print(f"✅ {model_key} loaded")

def load_stable_medium():
    print("🔄 Loading StableMedium...")
    model_id = "stabilityai/stable-diffusion-3.5-medium"
    nf4 = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4", bnb_4bit_compute_dtype=torch.float16)
    transformer = SD3Transformer2DModel.from_pretrained(model_id, subfolder="transformer", quantization_config=nf4, torch_dtype=torch.float16)
    pipe = StableDiffusion3Pipeline.from_pretrained(model_id, transformer=transformer, torch_dtype=torch.float16)
    pipe.to("cuda")
    with model_lock:
        models["stable-medium"] = pipe
        model_loading["stable-medium"] = False
    print("✅ StableMedium loaded")

def load_stable_xl():
    print("🔄 Loading StableXL...")
    base = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, variant="fp16", use_safetensors=True).to("cuda")
    refiner = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-xl-refiner-1.0", text_encoder_2=base.text_encoder_2, vae=base.vae, torch_dtype=torch.float16, use_safetensors=True, variant="fp16").to("cuda")
    with model_lock:
        models["stable-xl"] = {"base": base, "refiner": refiner}
        model_loading["stable-xl"] = False
    print("✅ StableXL loaded")

def ensure_model_loaded(name):
    with model_lock:
        if name in models:
            return True
        if model_loading.get(name):
            return False
        model_loading[name] = True

    try:
        if name == "flux-dev": load_flux_dev()
        elif name == "flux-schnell": load_flux_schnell()
        elif name == "stable-medium": load_stable_medium()
        elif name == "stable-large": load_stable_sd3(name, "stabilityai/stable-diffusion-3.5-large")
        elif name == "stable-turbo": load_stable_sd3(name, "stabilityai/stable-diffusion-3.5-large-turbo")
        elif name == "stable-xl": load_stable_xl()
        else: return False
        return True
    except Exception as e:
        print(f"❌ Failed to load {name}: {e}")
        with model_lock:
            model_loading[name] = False
        return False

def unload_model(name):
    with model_lock:
        if name in models:
            try:
                model = models[name]
                if isinstance(model, dict):
                    for k, v in model.items():
                        del v
                del models[name]
                gc.collect()
                torch.cuda.empty_cache()
                model_loading[name] = False
                print(f"🗑️ Unloaded {name} and ran gc.collect() + torch.cuda.empty_cache()")
                return True
            except Exception as e:
                print(f"❌ Failed to unload {name}: {e}")
                return False
        return False

# ─── ROUTES ────────────────────────────────────────────────

@app.route("/")
def home():
    return jsonify({ "message": "Unified AI Model Server is running!" })

@app.route("/<model_name>/generate", methods=["POST"])
def generate(model_name):
    global current_active_model

    # Unload previous model if different
    if current_active_model and current_active_model != model_name:
        print(f"🔁 Switching model from {current_active_model} to {model_name}")
        unload_model(current_active_model)

    # Load the requested model
    if not ensure_model_loaded(model_name):
        return jsonify({ "error": "Model loading or failed", "model": model_name }), 503

    current_active_model = model_name
    params = extract_params(request.json)
    model = models[model_name]

    if model_name == "stable-xl":
        results = []
        for _ in range(params["num_images"]):
            latent = model["base"](
                prompt=params["prompt"],
                width=params["width"],
                height=params["height"],
                num_inference_steps=params["num_inference_steps"],
                guidance_scale=params["guidance_scale"],
                denoising_end=params["denoising_end"],
                output_type="latent"
            ).images[0]
            image = model["refiner"](
                prompt=params["prompt"],
                image=latent,
                num_inference_steps=params["num_inference_steps"],
                guidance_scale=params["guidance_scale"],
                denoising_start=params["denoising_start"]
            ).images[0]
            results.append(image)
        return jsonify({ "image_urls": convert_images_to_urls(results), "model": model_name, "success": True })

    # All other models
    images = model(
        prompt=params["prompt"],
        width=params["width"],
        height=params["height"],
        num_inference_steps=params["num_inference_steps"],
        guidance_scale=params["guidance_scale"],
        num_images_per_prompt=params["num_images"]
    ).images

    return jsonify({ "image_urls": convert_images_to_urls(images), "model": model_name, "success": True })

@app.route("/<model_name>/unload", methods=["POST"])
def unload(model_name):
    if unload_model(model_name):
        return jsonify({"message": f"Unloaded {model_name}", "success": True})
    else:
        return jsonify({"error": f"Failed to unload {model_name}", "success": False}), 500

@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "models_loaded": list(models.keys()),
        "total_models": len(models)
    })

# ─── MAIN ─────────────────────────────────────────────────

if __name__ == "__main__":
    print("🚀 Server ready. Models load on demand.")
    app.run(host="0.0.0.0", port=8000, debug=False)
