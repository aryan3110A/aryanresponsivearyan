import React from 'react'
import CardModels from './CardModels'

const Models = () => {
  return (
    <div className='p-12 font-poppins'>
        <div className='flex justify-between mb-6'>
                <div>
                <a className='font-medium text-2xl'>Start from a model</a> <br />
                <a className='text-[12px] font-light'>Select Model</a>
                </div>

                <div className='text-[12px]'>
                    View all
                </div>
            </div>


        <div className='flex gap-8'>
        <CardModels
        imageSrc="./home/model/Rectangle 1.png"
        title="Flux.1 Schnell"
        details="Flux.1 Schnell is an efficient open-source AI image generation model by Black Forest Labs, designed to quickly produce high-quality images in just 1 to 4 steps. It's optimized for speed while maintaining impressive output quality."
        buttonText="Run"
        // onButtonClick={() => alert("Flux.1 Schnell Started!")}
      />
        <CardModels
        imageSrc="./home/model/Rectangle 1.png"
        title="Flux.1 dev"
        details="Flux.1 Dev, a powerful 12B parameter flow transformer model from the FLUX series. This model delivers high-quality image generation with exceptional detail and efficiency."
        buttonText="Run"
        // onButtonClick={() => alert("Flux.1 Schnell Started!")}
      />
        <CardModels
        imageSrc="./home/model/Rectangle 1.png"
        title="Google Imagen"
        details="Google’s Imagen - generating images with even better detail, richer lightingand fewer distracting artifacts than our previous models."
        buttonText="Run"
        // onButtonClick={() => alert("Flux.1 Schnell Started!")}
      />
        <CardModels
        imageSrc="./home/model/Rectangle 1.png"
        title="Stable Diffusion 3.5 medium"
        details="At 2.5 billion parameters, with improved MMDiT-X architecture and training methods, this model is designed to run “out of the box” on consumer hardware, striking a balance between quality and ease of customization. It is capable of generating images ranging between 0.25 and 2 megapixel resolution."
        buttonText="Run"
        // onButtonClick={() => alert("Flux.1 Schnell Started!")}
      />
        <CardModels
        imageSrc="./home/model/Rectangle 1.png"
        title="Midjourney+fluxdev+Lora"
        details="MidJourney + Flux Dev + LoRA –  A powerful fusion of MidJourney’s artistic capabilities, Flux-Dev’s efficiency, and LoRA fine-tuning, enabling highly customized, stylistic, and efficient AI-generated imagery."
        buttonText="Run"
        // onButtonClick={() => alert("Flux.1 Schnell Started!")}
      />
        
        </div>



    </div>
  )
}

export default Models