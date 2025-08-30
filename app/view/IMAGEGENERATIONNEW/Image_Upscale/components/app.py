import os, math, torch
from flask import Flask, request, jsonify, send_from_directory, stream_with_context, Response
from PIL import Image
from datetime import datetime
from diffusers import FluxPipeline, FluxKontextPipeline, StableDiffusionXLPipeline
from diffusers.utils import load_image

# ─── Flask App Setup ─────────────────────────────
app = Flask(__name__)
output_dir = "outputs"
upload_dir = "uploads"
os.makedirs(output_dir, exist_ok=True)
os.makedirs(upload_dir, exist_ok=True)

# ─── Device / dtype ──────────────────────────────
HAS_CUDA = torch.cuda.is_available()
DEVICE = "cuda" if HAS_CUDA else "cpu"
def best_dtype(default=torch.bfloat16):
    # On CPU, use float32 to avoid unsupported ops with bfloat16
    return default if HAS_CUDA else torch.float32

# ─── Load Models ─────────────────────────────────
print("🔄 Loading FluxKrea pipeline...")
flux_krea = FluxPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-Krea-dev",
    torch_dtype=best_dtype(torch.bfloat16)
)
if hasattr(flux_krea, "enable_model_cpu_offload"):
    flux_krea.enable_model_cpu_offload()
print("✅ FluxKrea model loaded.")

print("🔄 Loading FluxKontext pipeline...")
flux_kontext = FluxKontextPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-Kontext-dev",
    torch_dtype=best_dtype(torch.bfloat16)
)
if hasattr(flux_kontext, "enable_model_cpu_offload"):
    flux_kontext.enable_model_cpu_offload()
print("✅ FluxKontext model loaded.")

print("🔄 Loading Playground v2.5 (SDXL)...")
playground_dtype = best_dtype(torch.bfloat16)
playground_pipe = StableDiffusionXLPipeline.from_pretrained(
    "playgroundai/playground-v2.5-1024px-aesthetic",
    torch_dtype=playground_dtype,
    variant="fp16" if playground_dtype is torch.bfloat16 else None
).to(DEVICE)
if hasattr(playground_pipe, "enable_vae_slicing"):
    playground_pipe.enable_vae_slicing()
if hasattr(playground_pipe, "enable_vae_tiling"):
    playground_pipe.enable_vae_tiling()
if hasattr(playground_pipe, "set_progress_bar_config"):
    playground_pipe.set_progress_bar_config(disable=False)
if hasattr(playground_pipe, "enable_model_cpu_offload"):
    try:
        playground_pipe.enable_model_cpu_offload()
    except Exception:
        pass
print("✅ Playground SDXL loaded.")

# ─── Prompt Enhancers ────────────────────────────
def enhance_logo_prompt(user_prompt: str):
    return f"{user_prompt}, professional logo, minimal design, clean lines, vector style"

def enhance_sticker_prompt(user_prompt: str):
    return f"{user_prompt}, cute sticker, vector illustration, flat colors, bold outlines, white border, simple background"

def enhance_product_prompt(user_prompt: str):
    return f"{user_prompt}, high-quality product photo, realistic lighting, studio background, sharp details, e-commerce ready, photorealistic"

def optimize_mockup_prompt(user_prompt: str):
    return f"Same model uses the product naturally in the scene. {user_prompt.strip().capitalize()}"[:300]

# ─── Helpers ─────────────────────────────────────
def _stamp_name(prefix: str, index: int = 0, ext: str = "png"):
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{prefix}_{ts}_{index}.{ext}"

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
    px, py = width - product_resized.width - 40, (height - product_resized.height) // 2
    # If product has alpha, use as mask
    mask = product_resized if product_resized.mode == "RGBA" else None
    reference.paste(product_resized, (px, py), mask=mask)
    return reference

# ─── Upscale Helpers ─────────────────────────────
PROMPT_UPSCALE = "high-quality super-resolution, preserve identity and layout, crisp edges, natural textures, remove compression artifacts"
UPSCALE_FACTOR = 4.0
MAX_OUTPUT_AREA = 4096 * 4096
MIN_MULT = 16

def round_to_mult(x, m=16):
    return max(m, int(x) // m * m)

def plan_target_size(w, h, target_long_side=None, factor=UPSCALE_FACTOR):
    scale = (target_long_side / max(w, h)) if target_long_side else factor
    tw, th = int(w * scale), int(h * scale)
    # area guard
    if tw * th > MAX_OUTPUT_AREA:
        shrink = math.sqrt(MAX_OUTPUT_AREA / (tw * th))
        tw, th = int(tw * shrink), int(th * shrink)
    return round_to_mult(tw, MIN_MULT), round_to_mult(th, MIN_MULT)

def run_upscale(img, w, h, steps=50, guidance=3.5, negative_prompt=None):
    # Enhanced prompt to prevent duplication artifacts
    enhanced_prompt = f"{PROMPT_UPSCALE}, single person, no duplication, preserve original composition"
    
    # Strong negative prompt to prevent cloning/duplication
    default_negative = "duplicate, cloned, twin, copy, repetition, artifact, blur, low quality, distorted, deformed, extra limbs, missing limbs, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, mutated hands and fingers, out of frame, double, two heads, blurred, ugly, disgusting, poorly drawn, deformed, extra limbs, extra fingers, mutated hands, bad anatomy, bad proportions, blind, extra eyes, dark face, skull, crossbones, extra legs, extra arms, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, mutated hands and fingers, one hand with more than 5 fingers, one hand with less than 5 fingers, one hand with more than 5 digit, one hand with less than 5 digit, extra digit, fewer digits, fused hand, missing hand, missing finger, extra finger, extra joint, missing joint, fused joint, extra knee, extra elbow, extra shoulder, extra hip, extra wrist, extra ankle, extra knee joint, extra elbow joint, extra shoulder joint, extra hip joint, extra wrist joint, extra ankle joint, malformed, gross, ugly, disgusting, amputation"
    
    # Use provided negative prompt or default
    final_negative = negative_prompt if negative_prompt else default_negative
    
    kwargs = dict(
        image=img,
        prompt=enhanced_prompt,
        negative_prompt=final_negative,
        width=w,
        height=h,
        num_inference_steps=steps,
        guidance_scale=guidance
    )
    try:
        kwargs["max_area"] = max(w * h, 1024 * 1024)
        return flux_kontext(**kwargs).images[0]
    except TypeError:
        kwargs.pop("max_area", None)
        return flux_kontext(**kwargs).images[0]

# ─── General Text2Img with FluxKrea ──────────────
def generate_krea_image(
    prompt,
    num_images,
    prefix,
    height=1024,
    width=1024,
    steps=60,
    guidance_scale=5.5,
    seed=None
):
    urls = []
    for i in range(num_images):
        gen = torch.manual_seed((seed or 42) + i)
        image = flux_krea(
            prompt=prompt,
            guidance_scale=guidance_scale,
            height=height,
            width=width,
            num_inference_steps=steps,
            generator=gen
        ).images[0]
        filename = _stamp_name(prefix, i)
        path = os.path.join(output_dir, filename)
        image.save(path, "PNG")
        urls.append(f"/download/{filename}")
        print(f"✅ {prefix} generated: {filename}")
    return urls

# ─── Playground Text2Img ─────────────────────────
def generate_playground_image(
    prompt,
    num_images=1,
    prefix="playground",
    height=1024,
    width=1024,
    steps=100,
    guidance_scale=5.0,
    seed=None
):
    urls = []
    for i in range(num_images):
        gen = torch.manual_seed((seed or 12345) + i)
        image = playground_pipe(
            prompt=prompt,
            num_inference_steps=steps,
            guidance_scale=guidance_scale,
            height=height,
            width=width,
            generator=gen
        ).images[0]
        filename = _stamp_name(prefix, i)
        path = os.path.join(output_dir, filename)
        image.save(path, "PNG")
        urls.append(f"/download/{filename}")
        print(f"✅ Playground generated: {filename}")
    return urls

# ─── CORS ────────────────────────────────────────
@app.after_request
def after_request(response):
    origin = request.headers.get("Origin", "")
    allowed = ["http://localhost:3000", "https://www.wildmindai.com", "https://api.wildmindai.com"]
    response.headers["Access-Control-Allow-Origin"] = origin if origin in allowed else "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

# ─── Routes: Logos / Stickers / Products (Flux Krea) ─────────
@app.route("/generate", methods=["POST"])
def generate_logo():
    try:
        data = request.get_json(force=True)
        prompt = enhance_logo_prompt(data.get("prompt", ""))
        num_images = int(data.get("num_images", 1))
        steps = int(data.get("steps", 60))
        guidance = float(data.get("guidance_scale", 4.5))
        seed = data.get("seed")
        urls = generate_krea_image(prompt, num_images, "logo", steps=steps, guidance_scale=guidance, seed=seed)
        return jsonify({"image_urls": urls})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/generate-sticker", methods=["POST"])
def generate_sticker():
    try:
        data = request.get_json(force=True)
        prompt = enhance_sticker_prompt(data.get("prompt", ""))
        num_images = int(data.get("num_images", 1))
        steps = int(data.get("steps", 60))
        guidance = float(data.get("guidance_scale", 4.5))
        seed = data.get("seed")
        urls = generate_krea_image(prompt, num_images, "sticker", steps=steps, guidance_scale=guidance, seed=seed)
        return jsonify({"image_urls": urls})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/generate-product", methods=["POST"])
def generate_product():
    try:
        data = request.get_json(force=True)
        prompt = enhance_product_prompt(data.get("prompt", ""))
        num_images = int(data.get("num_images", 1))
        steps = int(data.get("steps", 60))
        guidance = float(data.get("guidance_scale", 4.5))
        seed = data.get("seed")
        urls = generate_krea_image(prompt, num_images, "product", steps=steps, guidance_scale=guidance, seed=seed)
        return jsonify({"image_urls": urls})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ─── General Text2Img with FluxKrea ──────────────
@app.route("/generate/kreaimage", methods=["POST"])
def generate_krea_text2img():
    try:
        data = request.get_json(force=True)
        prompt = data.get("prompt", "")
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
        num_images = int(data.get("num_images", 1))
        height = int(data.get("height", 1024))
        width = int(data.get("width", 1024))
        steps = int(data.get("steps", 60))
        guidance = float(data.get("guidance_scale", 4.5))
        seed = data.get("seed")
        urls = generate_krea_image(prompt, num_images, "kreaimg",
                                   height=height, width=width, steps=steps,
                                   guidance_scale=guidance, seed=seed)
        return jsonify({"image_urls": urls})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ─── NEW: Playground Text2Img ────────────────────
# JSON: { "prompt": "...", "num_images": 1, "height": 1024, "width": 1024, "steps": 100, "guidance_scale": 4.0, "seed": 123 }
@app.route("/generate/playground", methods=["POST"])
def generate_playground_route():
    try:
        data = request.get_json(force=True)
        prompt = (data.get("prompt") or "").strip()
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
        num_images = int(data.get("num_images", 1))
        height = int(data.get("height", 1024))
        width = int(data.get("width", 1024))
        steps = int(data.get("steps", 100))
        guidance = float(data.get("guidance_scale", 4.0))
        seed = data.get("seed")
        urls = generate_playground_image(prompt, num_images,
                                         prefix="playground",
                                         height=height, width=width,
                                         steps=steps, guidance_scale=guidance, seed=seed)
        return jsonify({"image_urls": urls})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ─── Upscale Route (Kontext) ─────────────────────
# multipart/form-data: image=<file>; optional: target_long_side, steps, guidance_scale
@app.route("/generate/upscale", methods=["POST"])
def upscale_image():
    try:
        file = request.files["image"]
        img = Image.open(file).convert("RGB")
        target_long_side = request.form.get("target_long_side")
        target_long_side = int(target_long_side) if target_long_side else None
        steps = int(request.form.get("steps", 50))
        guidance = float(request.form.get("guidance_scale", 3.5))
        negative_prompt = request.form.get("negative_prompt")  # Get negative prompt from frontend

        tw, th = plan_target_size(*img.size, target_long_side=target_long_side)
        result = run_upscale(img, tw, th, steps=steps, guidance=guidance, negative_prompt=negative_prompt)

        filename = _stamp_name("upscaled", 0)
        path = os.path.join(output_dir, filename)
        result.save(path, "PNG")
        return jsonify({"image_url": f"/download/{filename}", "size": [tw, th]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ─── Mockup Generation (Kontext, streaming) ──────
@app.route("/generate-mockup", methods=["POST"])
def generate_mockup():
    try:
        logo_file = request.files["logo_file"]
        business_name = request.form.get("business_name", "").strip()
        tagline = request.form.get("business_tagline", "").strip()

        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        logo_path = os.path.join(upload_dir, f"logo_{ts}.png")
        logo_file.save(logo_path)
        logo_image = load_image(logo_path).convert("RGB")

        output_dir_mockup = os.path.join(output_dir, f"mockup_{ts}")
        os.makedirs(output_dir_mockup, exist_ok=True)
        prompts = get_mockup_prompts(business_name, tagline)

        def generate_stream():
            for item, prompt in prompts.items():
                result = flux_kontext(
                    image=logo_image,
                    prompt=prompt,
                    guidance_scale=4.5,
                    num_inference_steps=50
                ).images[0]

                file_name = f"{item.lower().replace(' ', '_')}.png"
                save_path = os.path.join(output_dir_mockup, file_name)
                result.save(save_path)
                yield f'data: {{"image_url": "/download/mockup_{ts}/{file_name}", "item": "{item}"}}\n\n'

        return Response(stream_with_context(generate_stream()), mimetype='text/event-stream')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ─── Product With Model Pose (Kontext) ───────────
@app.route("/generate-product-pose", methods=["POST"])
def generate_product_pose():
    try:
        model_file = request.files["model_image"]
        product_file = request.files["product_image"]
        user_prompt = request.form.get("scene_desc", "studio setting")
        width = int(request.form.get("width", 768))
        height = int(request.form.get("height", 768))

        model_img = Image.open(model_file).convert("RGB")
        product_img = Image.open(product_file).convert("RGB")
        reference = create_reference_image(model_img, product_img, width, height)
        prompt = optimize_mockup_prompt(user_prompt)

        image = flux_kontext(
            image=reference,
            prompt=prompt,
            guidance_scale=4.5,
            num_inference_steps=50,
            generator=torch.manual_seed(42),
            width=width,
            height=height,
            negative_prompt="collage, side by side, split frame, duplicate product, unrealistic"
        ).images[0]

        filename = _stamp_name("pose", 0)
        path = os.path.join(output_dir, filename)
        image.save(path, "PNG")
        return jsonify({"image_url": f"/download/{filename}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ─── File Serving ────────────────────────────────
@app.route("/download/<filename>")
def download_file(filename):
    return send_from_directory(output_dir, filename)

@app.route("/download/<subdir>/<filename>")
def download_mockup_file(subdir, filename):
    return send_from_directory(output_dir, f"{subdir}/{filename}")

# ─── Health ─────────────────────────────────────
@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "device": DEVICE,
        "models": ["FluxKrea", "FluxKontext", "PlaygroundSDXL"],
        "output_dir": output_dir,
        "cors_enabled": True
    })

# ─── FULL Mockup Prompts (as requested) ──────────
def get_mockup_prompts(business_name: str, tagline: str):
    return {
        "Cap": (
            f"White cap with {business_name} logo on front. Tagline '{tagline}' below. Clean lighting, realistic stitch details."
        ),
        "T-Shirt": (
            f"Office T-shirt with {business_name} logo on right chest. Realistic fabric folds, soft lighting."
        ),
        "Mug": (
            f"White mug with {business_name} logo on front. Tagline '{tagline}' below. Office background, clean shadows, realistic gloss."
        ),
        "Road_Hoarding": (
            f"A wide roadside hoarding across an Indian city road with vehicles and trees. "
            f"Top-left shows logo, center has bold {business_name} name, and below is tagline '{tagline}'. "
            f"Daylight, flyover-mounted billboard, urban buildings, cars, motorbikes, clear realistic lighting, vibrant branding style."
        ),
        "Building_Signage": (
            f"{business_name} logo at top of a modern glass building. Below it, tagline '{tagline}'. Cityscape, daylight, corporate look."
        ),
        "Office_Wall_Branding": (
            f"{business_name} logo on interior office wall with 3D effect. Tagline '{tagline}' beneath, modern clean design, bright lighting."
        ),
        "Pen": (
            f"Office pen with printed logo of {business_name}. Tagline '{tagline}' in small font. Simple, metallic pen with professional vibe."
        ),
        "Notepad": (
            f"White office notepad cover showing {business_name} logo and tagline '{tagline}'. Top spiral binding, clean design."
        ),
        "Banner": (
            f"Large vertical office banner on stand with {business_name} logo at top, name bold in center, tagline '{tagline}' below. Event setup."
        ),
        "Sticker": (
            f"Glossy sticker with {business_name} logo and tagline '{tagline}'. Rounded or circular shape, high clarity, subtle light reflections."
        ),
        "Diary": (
            f"Photorealistic diary on wooden desk. "
            f"Small {business_name} logo top-right, name below. "
            f"Tagline '{tagline}' at bottom. Soft daylight, pro design, premium cover texture."
        ),
        "Digital_Screen": (
            f"A tall interactive digital kiosk in a shopping mall. "
            f"{business_name} logo glowing at top, tagline '{tagline}' on a bright screen. "
            f"Clean glass frame, ambient reflections, people walking in background."
        ),
        "Keychain": (
            f"Office keychain with {business_name} logo and tagline '{tagline}'. "
            f"Simple, metallic keychain with professional vibe."
        ),
        "Mousepad": (
            f"Office mousepad with {business_name} logo and tagline '{tagline}'. "
            f"Simple, textured mousepad with professional vibe."
        ),
        "Calendar": (
            f"Office calendar with {business_name} logo and tagline '{tagline}'. "
            f"Simple, metallic calendar with professional vibe."
        ),
        "Notebook": (
            f"Office notebook with {business_name} logo and tagline '{tagline}'. "
            f"Simple, metallic notebook with professional vibe."
        ),
        "Lanyard": (
            f"Office lanyard with {business_name} logo and tagline '{tagline}'. "
            f"Simple, metallic lanyard with professional vibe."
        ),
        "Backpack": (
            f"Office backpack with {business_name} logo and tagline '{tagline}'. "
            f"Simple, metallic backpack with professional vibe."
        ),
        "Water_Bottle": (
            f"Office water bottle with {business_name} logo and tagline '{tagline}'. "
            f"Simple, metallic water bottle with professional vibe."
        ),
        "Desk_Set": (
            f"Office desk set with {business_name} logo and tagline '{tagline}'. "
            f"Simple, metallic desk set with professional vibe."
        ),
        "Clock": (
            f"Office clock with {business_name} logo and tagline '{tagline}'. "
            f"Simple, metallic clock with professional vibe."
        ),
    }

# ─── Main ────────────────────────────────────────
if __name__ == "__main__":
    # You can change the port below if needed
    app.run(host="0.0.0.0", port=7861, debug=True)
