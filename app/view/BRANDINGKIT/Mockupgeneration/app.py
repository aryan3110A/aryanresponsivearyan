import torch
from diffusers import FluxKontextPipeline
from diffusers.utils import load_image
from PIL import Image
import datetime
import os

# ─── Step 1: User Inputs ──────────────────────────────────────────────
print("\n🏢 FULL OFFICE BRANDING VISUAL GENERATOR")
print("────────────────────────────────────────────")
logo_path = input("📂 Enter path to your LOGO image file: ").strip()
if not os.path.exists(logo_path):
    raise FileNotFoundError(f"❌ Logo file not found at: {logo_path}")

business_name = input("🏢 Enter your BUSINESS name: ").strip()
tagline = input("💬 Enter your TAGLINE: ").strip()
# employee_name = input("🧑 Enter EMPLOYEE NAME for I-Card: ").strip()
# photo_path = input("🧑‍💼 Upload EMPLOYEE PHOTO for I-Card: ").strip()
# if not os.path.exists(photo_path):
#     raise FileNotFoundError(f"❌ Photo file not found at: {photo_path}")

# ─── Step 2: Load Model ───────────────────────────────────────────────
print("\n🚀 Loading FLUX.1-Kontext model...")
pipe = FluxKontextPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-Kontext-dev",
    torch_dtype=torch.bfloat16
).to("cuda")
print("✅ Model loaded!")

# ─── Step 3: Load Images ──────────────────────────────────────────────
logo_image = load_image(logo_path).convert("RGB")
# photo_image = load_image(photo_path).convert("RGB")

# ─── Step 4: Output Directory ─────────────────────────────────────────
timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
output_dir = f"full_office_branding_output_{timestamp}"
os.makedirs(output_dir, exist_ok=True)

# ─── Step 5: Combined Prompts (77-token safe) ─────────────────────────
prompts = {
    # "I-Card": (
    #     f"Professional ID card for {business_name} with photo of employee {employee_name}. "
    #     f"Include logo at top, white background, corporate design, minimal badge layout."
    # ),
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
    # "Eraser": (
    #     f"Office eraser with {business_name} logo and tagline '{tagline}'. "
    #     f"Simple, metallic eraser with professional vibe."
    # ),
    # "Scissors": (
    #     f"Office scissors with {business_name} logo and tagline '{tagline}'. "
    #     f"Simple, metallic scissors with professional vibe."
    # ),

}

# ─── Step 6: Generate All Visuals ──────────────────────────────────────
print("\n🎨 Generating 12 branding visuals...\n")
for item, prompt in prompts.items():
    print(f"🎯 Generating: {item}")
    
    input_image = photo_image if item == "I-Card" else logo_image

    result = pipe(
        image=input_image,
        prompt=prompt,
        guidance_scale=4.5,
        num_inference_steps=35
    ).images[0]

    file_name = f"{item.lower().replace(' ', '_')}.png"
    save_path = os.path.join(output_dir, file_name)
    result.save(save_path)
    print(f"✅ Saved to: {save_path}")

print("\n✅ ALL 12 DESIGNS GENERATED IN FOLDER:", output_dir)
