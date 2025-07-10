'use client';

import React from 'react'
import DropDownSelection from './Generationpage/ui/DropDownSelection'

const TestingUi = () => {
  const handleStyleSelect = (selected: string) => {
    // handle the selected style here
    console.log(selected);
  };
  return (
    <div>
        <DropDownSelection
      options={[
        "3d Render",
        "Bokeh",
        "Cinematic",
        "Creative",
        "Graphic Design Pop Art",
        "Graphic Design Vector",
        "Illustration",
        "Minimalist",
        "Portrait",
        "Pro B&W Photography",
      ]}
      onSelect={handleStyleSelect}
    />
    </div>
  )
}

export default TestingUi