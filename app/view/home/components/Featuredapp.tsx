import React from 'react'
import CardFeatures from './CardFeatures'

const Featuredapp = () => {
  return (
    <div className='p-12 font-poppins'>
        
        <div>
            <div className='flex justify-between mb-6'>
                <div>
                <a className='font-medium text-2xl'>Featured Apps</a> <br />
                <a className='text-[12px] font-light'>Create and explore image,Videos and audio powered tools</a>
                </div>

                <div className='text-[12px]'>
                    View all
                </div>
            </div>

            
          {/* featues cards   */}
        <div className='flex gap-10'>
        <CardFeatures
        imageSrc="./home/featurescard/Rectangle 2.png"
        showOverlay={false} 
        overlayText="Coming Soon"
        overlayOpacity={0.3}
        textColor="white"
        textSize="text-sl"
        title="Image Generation"
        buttonText="Run"
        buttonColor="#2196F3"
        buttonTextColor="white"
        buttonIconSrc="./home/featurescard/play.svg"
        buttonHoverIconSrc="./home/featurescard/play.svg"
        // onButtonClick={() => alert("AI Image Generation Launched!")}
      />
        <CardFeatures
        imageSrc="./home/featurescard/Rectangle 3.png"
        showOverlay={true} 
        overlayText="Coming Soon"
        overlayOpacity={0.1}
        textColor="white"
        textSize="text-sl"
        title="Video Creation"
        buttonText="Run"
        buttonColor="#282828"
        buttonTextColor="white"
        buttonIconSrc="./home/featurescard/play.svg"
        buttonHoverIconSrc="./home/featurescard/play.svg"
        // onButtonClick={() => alert("AI Image Generation Launched!")}
      />
        <CardFeatures
        imageSrc="./home/featurescard/Rectangle 4.png"
        showOverlay={true} 
        overlayText="Coming Soon"
        overlayOpacity={0.1}
        textColor="white"
        textSize="text-sl"
        title="SKetch to image"
        buttonText="Run"
        buttonColor="#282828"
        buttonTextColor="white"
        buttonIconSrc="./home/featurescard/play.svg"
        buttonHoverIconSrc="./home/featurescard/play.svg"
        // onButtonClick={() => alert("AI Image Generation Launched!")}
      />
        <CardFeatures
        imageSrc="./home/featurescard/Rectangle 5.png"
        showOverlay={true} 
        overlayText="Coming Soon"
        overlayOpacity={0.1}
        textColor="white"
        textSize="text-sl"
        title="Real time Generation"
        buttonText="Run"
        buttonColor="#282828"
        buttonTextColor="white"
        buttonIconSrc="./home/featurescard/play.svg"
        buttonHoverIconSrc="./home/featurescard/play.svg"
        // onButtonClick={() => alert("AI Image Generation Launched!")}
      />
        <CardFeatures
        imageSrc="./home/featurescard/Rectangle 6.png"
        showOverlay={true} 
        overlayText="Coming Soon"
        overlayOpacity={0.1}
        textColor="white"
        textSize="text-sl"
        title="Upscale"
        buttonText="Run"
        buttonColor="#282828"
        buttonTextColor="white"
        buttonIconSrc="./home/featurescard/play.svg"
        buttonHoverIconSrc="./home/featurescard/play.svg"
        // onButtonClick={() => alert("AI Image Generation Launched!")}
      />
        </div>







           







        </div>
    </div>
  )
}

export default Featuredapp