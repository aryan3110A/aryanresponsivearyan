import os
import io
import torch
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from diffusers import DiffusionPipeline, StableDiffusionImg2ImgPipeline
from PIL import Image
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",
    "https://www.wildmindai.com",
    "https://api.wildmindai.com",
    "https://*.vercel.app",
    "https://*.ngrok-free.app"
], supports_credentials=True)

# Load pipeline once on server start
model_id = "black-forest-labs/FLUX.1-Kontext-dev"
pipe = DiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.bfloat16).to("cuda")

# Ensure outputs directory exists
output_dir = "outputs"
os.makedirs(output_dir, exist_ok=True)

def resize_and_pad(image, size=(512, 512), bg_color=(0, 0, 0)):
    image.thumbnail(size, Image.LANCZOS)
    result = Image.new("RGB", size, bg_color)
    offset = ((size[0] - image.width) // 2, (size[1] - image.height) // 2)
    result.paste(image, offset)
    return result

def create_logo_mockup(logo_img, business_name, business_tagline, target_size=1024):
    """Create a mockup reference image with the logo and business info"""
    try:
        # Create a clean background
        background = Image.new("RGB", (target_size, target_size), (255, 255, 255))
        
        # Resize logo to fit nicely in the center
        logo_size = min(target_size // 3, 300)  # Logo takes up about 1/3 of the image
        logo_resized = resize_and_pad(logo_img, (logo_size, logo_size))
        
        # Calculate position to center the logo
        logo_x = (target_size - logo_size) // 2
        logo_y = (target_size - logo_size) // 2 - 50  # Slightly above center
        
        # Paste the logo
        background.paste(logo_resized, (logo_x, logo_y))
        
        return background
    except Exception as e:
        print(f"Error creating logo mockup: {e}")
        # Fallback to logo-only image
        return resize_and_pad(logo_img, (target_size, target_size))

def create_optimized_prompt(user_prompt, business_name="", business_tagline=""):
    """Create a prompt under 77 tokens for CLIP compatibility"""
    # Clean and optimize the user's prompt
    words = user_prompt.strip().split()

    # Create base instruction for logo mockup
    base_instruction = "professional logo mockup"
    mockup_hint = "clean design, business presentation, high quality"

    # Combine business info if available
    business_info = ""
    if business_name:
        business_info = f"for {business_name}"
    if business_tagline:
        business_info += f" - {business_tagline}"

    # If user prompt is short enough, combine with base instruction
    if len(words) <= 20:
        combined_prompt = f"{base_instruction} {business_info}, {user_prompt}, {mockup_hint}"
        if len(combined_prompt.split()) <= 30:
            return combined_prompt

    # If too long, extract key elements and create shorter version
    key_words = []
    important_terms = ['logo', 'brand', 'business', 'professional', 'clean', 'modern', 'design']

    # First, add important terms
    for word in words:
        if word.lower() in important_terms and len(key_words) < 5:
            key_words.append(word)

    # Then add other descriptive words up to limit
    for word in words:
        if word.lower() not in important_terms and len(key_words) < 7:
            key_words.append(word)

    optimized_prompt = ' '.join(key_words)
    return f"{base_instruction} {business_info}, {optimized_prompt}, {mockup_hint}"

def create_integrated_reference(model_img, product_img, target_width=1024):
    """Create a reference that suggests integration with properly sized product"""
    try:
        # Use square format for better FLUX compatibility
        target_height = target_width

        # Try a different approach: create a more balanced composition
        # Model takes 75% width, product gets 40% width (with overlap for integration)
        model_width = int(target_width * 0.75)
        model_resized = resize_and_pad(model_img, (model_width, target_height))

        # Product gets significant size for proper interaction
        product_size = int(target_width * 0.4)  # 40% of width - much more prominent
        product_resized = resize_and_pad(product_img, (product_size, product_size))

        # Create composition with model on left, product overlapping on right
        combined = Image.new("RGB", (target_width, target_height), (240, 240, 240))

        # Place model on the left
        combined.paste(model_resized, (0, 0))

        # Place product on the right with some overlap to suggest interaction
        product_x = target_width - product_size + 50  # Slight overlap
        product_y = (target_height - product_size) // 2  # Center vertically
        combined.paste(product_resized, (product_x, product_y))

        return combined
    except Exception as e:
        print(f"Error creating integrated reference: {e}")
        # Fallback to model-only reference
        return resize_and_pad(model_img, (target_width, target_width))

@app.route('/generate', methods=['POST'])
def generate_image():
    # Add CORS headers
    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
    
    try:
        # Check if we have the required files
        if 'logo_file' not in request.files:
            return jsonify({"error": "Logo file is required"}), 400, response_headers
            
        logo_file = request.files['logo_file']
        business_name = request.form.get('business_name', '')
        business_tagline = request.form.get('business_tagline', '')
        
        # Get user's custom prompt
        user_prompt = request.form.get('scene_desc', request.form.get('prompt', 'professional logo mockup'))
        print(f"User prompt: {user_prompt}")
        print(f"Business name: {business_name}")
        print(f"Business tagline: {business_tagline}")
        
        # Get number of images to generate (default to 1 if not provided)
        num_images = int(request.form.get('numberOfImages', 1))
        # Get target resolution (default to 768x768 if not provided)
        target_width = int(request.form.get('width', 768))
        target_height = int(request.form.get('height', 768))

        # Ensure dimensions are within reasonable bounds and divisible by 16
        target_width = max(256, min(2048, target_width))
        target_height = max(256, min(2048, target_height))
        target_width = target_width - (target_width % 16)
        target_height = target_height - (target_height % 16)

        print(f"Generating {num_images} images with resolution: {target_width}x{target_height}")

        logo_img = Image.open(logo_file).convert("RGB")

        # Create a mockup reference image using the logo
        print(f"Creating mockup reference image for target: {target_width}x{target_height}")

        # Create a simple mockup background with the logo
        reference_image = create_logo_mockup(logo_img, business_name, business_tagline, 1024)
        print(f"Reference image created: {reference_image.size}")

        # Create CLIP-compatible prompt (under 77 tokens)
        prompt = create_optimized_prompt(user_prompt, business_name, business_tagline)
        print(f"Original user prompt: {user_prompt}")
        print(f"Optimized prompt: {prompt}")
        print(f"Token count: ~{len(prompt.split())}")

        image_urls = []

        # Generate multiple images
        for i in range(num_images):
            # Use different seeds for variety
            seed = 42 + i
            generator = torch.manual_seed(seed)
            # Use FLUX-compatible parameters with negative prompt to avoid side-by-side
            try:
                # Try with negative prompt if supported
                negative_prompt = "side by side, split screen, comparison, two separate images, divided layout, tiny product, miniature item, very small object"
                result = pipe(
                    image=reference_image,
                    prompt=prompt,
                    negative_prompt=negative_prompt,
                    guidance_scale=3.5,  # Lower guidance to follow reference more closely
                    num_inference_steps=30,
                    generator=generator,
                    width=target_width,
                    height=target_height
                ).images[0]
            except Exception as e:
                print(f"Error with negative prompt: {e}")
                try:
                    # Try without negative prompt
                    result = pipe(
                        image=reference_image,
                        prompt=prompt,
                        guidance_scale=3.5,
                        num_inference_steps=30,
                        generator=generator,
                        width=target_width,
                        height=target_height
                    ).images[0]
                except Exception as e2:
                    print(f"Error with dimensions: {e2}")
                    try:
                        # Try without explicit dimensions
                        result = pipe(
                            image=reference_image,
                            prompt=prompt,
                            guidance_scale=3.5,
                            num_inference_steps=30,
                            generator=generator
                        ).images[0]
                    except Exception as e3:
                        print(f"Error with basic parameters: {e3}")
                        # Final fallback with minimal parameters
                        result = pipe(
                            image=reference_image,
                            prompt=prompt,
                            generator=generator
                        ).images[0]

            # Create unique filename for each image
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"generated_{timestamp}_{i+1}.png"
            path = os.path.join(output_dir, filename)
            result.save(path)

            image_urls.append(f"/download/{filename}")

        # Return single image URL for backward compatibility if only 1 image
        if num_images == 1:
            return jsonify({ "image_url": image_urls[0] }), 200, response_headers
        else:
            return jsonify({ "image_urls": image_urls }), 200, response_headers

    except Exception as e:
        print(f"Error generating image: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({ "error": f"Image generation failed: {str(e)}" }), 500, response_headers

@app.route('/generate', methods=['OPTIONS'])
def handle_options():
    """Handle preflight OPTIONS requests"""
    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
    }
    return '', 200, response_headers

@app.route('/download/<filename>')
def download_file(filename):
    path = os.path.join("outputs", filename)
    return send_file(path, mimetype='image/png')

if __name__ == '__main__':
    app.run(port=7861, host="0.0.0.0")
