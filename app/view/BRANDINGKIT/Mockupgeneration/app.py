from flask import Flask, request, jsonify, send_from_directory, stream_with_context, Response
import os, datetime, torch
from diffusers import FluxKontextPipeline
from diffusers.utils import load_image
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 👈 This enables CORS for all routes
pipe = FluxKontextPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-Kontext-dev", torch_dtype=torch.bfloat16
).to("cuda")

@app.route('/generate_step', methods=['POST'])
def generate_step():
    try:
        logo_file = request.files.get('logo_file')
        business_name = request.form.get('business_name')
        tagline = request.form.get('business_tagline')

        if not logo_file or not business_name or not tagline:
            return jsonify({"error": "Missing logo, business name, or tagline."}), 400

        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        logo_path = f"uploads/logo_{timestamp}.png"
        os.makedirs("uploads", exist_ok=True)
        logo_file.save(logo_path)

        logo_image = load_image(logo_path).convert("RGB")

        output_dir = f"outputs/mockup_{timestamp}"
        os.makedirs(output_dir, exist_ok=True)

        prompts = {
            "Cap": (
        f"White cap with {business_name} logo on front. Tagline '{tagline}' below. Clean lighting, realistic stitch details."
    ),
    "T-Shirt": (
        f"Office T-shirt with {business_name} logo on right chest. Tagline '{tagline}' below. Realistic fabric folds, soft lighting."
    ),
    "Mug": (
        f"White mug with {business_name} logo on front. Tagline '{tagline}' below. Office background, clean shadows, realistic gloss."
    ),
    "Road_Hoarding": (
    f"A wide roadside hoarding across an Indian city road with vehicles and trees. "
    f"Top-left shows {business_name} logo, center has bold {business_name} name, and below is tagline '{tagline}'. "
    f"Daylight, flyover-mounted billboard, urban buildings, cars, motorbikes, clear realistic lighting, vibrant branding style."
),

    # 
    
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
    # "Folder": (
    #     f"Company presentation folder with large {business_name} logo and tagline '{tagline}'. Modern, matte paper look, studio lighting."
    # ),
    "Banner": (
        f"Large vertical office banner on stand with {business_name} logo at top, name bold in center, tagline '{tagline}' below. Event setup."
    ),
    # "Envelope": (
    #     f"Office envelope with {business_name} logo and tagline '{tagline}' on front. Taller height, narrow width, orange inner flap."
    # ),
    # "Business_Card": (
    #     f"Horizontal business card with {business_name} logo top-left, name centered, tagline '{tagline}' below. Double-sided, modern."
    # ),
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
    # "USB_Drive": (
    #     f"Office USB drive with {business_name} logo and tagline '{tagline}'. "
    #     f"Simple, metallic USB drive with professional vibe."
    # ),
    "Calendar": (
        f"Office calendar with {business_name} logo and tagline '{tagline}'. "
        f"Simple, metallic calendar with professional vibe."
    ),
    "Notebook": (
        f"Office notebook with {business_name} logo and tagline '{tagline}'. "
        f"Simple, metallic notebook with professional vibe."
    ),
    # "Pen_Set": (
    #     f"Office pen set with {business_name} logo and tagline '{tagline}'. "
    #     f"Simple, metallic pen set with professional vibe."
    # ),
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

        def generate_stream():
            for item, prompt in prompts.items():
                result = pipe(
                    image=logo_image,
                    prompt=prompt,
                    guidance_scale=4.5,
                    num_inference_steps=10
                ).images[0]

                file_name = f"{item.lower().replace(' ', '_')}.png"
                save_path = os.path.join(output_dir, file_name)
                result.save(save_path)
                yield f'data: {{"image_url": "/outputs/mockup_{timestamp}/{file_name}", "item": "{item}"}}\n\n'

        return Response(stream_with_context(generate_stream()), mimetype='text/event-stream')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve images from outputs
@app.route('/outputs/<path:subdir>/<filename>')
def serve_output(subdir, filename):
    return send_from_directory(f"outputs/{subdir}", filename)

if __name__ == '__main__':
    app.run(port=7862, debug=True)
