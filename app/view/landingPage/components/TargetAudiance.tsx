import React from 'react'
import Navigationcompo from './NavigationuseCase'
// import AutoResizeFeature from './FrameCompo'
import FrameCompo from './FrameCompo'

const TargetAudiance = () => {
    return (
        <div className='text-white'>
            <div className='text-2xl font-bold flex justify-center items-center'>Creative Audiance</div>
            <div className='flex justify-center items-center'>
                <Navigationcompo />
            </div>

            <div className='flex justify-center items-center'>
                <FrameCompo image="/Landingpage/Image.png" title="Auto-resize for each platform" description="Make your Design fir every socail format fast." />
             </div>

        </div>
    )
}

export default TargetAudiance