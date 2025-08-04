import React from 'react'
import Image from 'next/image'


interface FrameCompoProps {
    image: string;
    title: string;
    description: string;
}

const FrameCompo: React.FC<FrameCompoProps> = ({ image, title, description }) => {
  return (
    <div className='flex flex-col items-center justify-center border h-80 border-white/20 rounded-3xl p-4 bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300'>
        <div className=' rounded-lg -mt-5'>
            <Image src={image} alt="frame" width={300} height={400} />
        </div>

        <div className='flex flex-col justify-center pt-5 '>
            <h1 className='text-lg font-bold text-white'>{title}</h1>
            <p className='text-sm text-gray-300'>
                {description}
            </p>
        </div>

    </div>
  )
}

export default FrameCompo