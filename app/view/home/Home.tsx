import React from 'react'
import Heading from './components/Heading'
import Featuredapp from './components/Featuredapp'
import Models from './components/Models'
import Galary from './components/Galary'

const Home = () => {
  return (
    <div className='bg-black w-[100vw] h-auto text-white'>
    
      <Heading />
      <Featuredapp />
      <Models />
      <Galary />
    
    
    
    </div>
  )
}

export default Home