'use client'

import React, { useState } from 'react'
import NavigationFeatuesall from './NavigationFeatuesall'
import FeaturesCompo from './FeatuesCompo'

const FeatuesAll = () => {
  const [activeCategory, setActiveCategory] = useState('All')

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  return ( 
    <div className='text-white'>
        <div className='flex justify-center items-center'>
            <NavigationFeatuesall onCategoryChange={handleCategoryChange} />
        </div>
        <div className='flex justify-center items-center'>
          <FeaturesCompo activeCategory={activeCategory} />
        </div>
    </div>
  )
}

export default FeatuesAll