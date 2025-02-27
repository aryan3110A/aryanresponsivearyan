import React from 'react';

const Input = () => {
  return (
    <div className='text-white flex items-center relative justify-center'>
      <div className='relative w-[60vw]'>
        <input 
          type="text" 
          className='w-full pr-[4rem] pl-4 py-2 rounded-full bg-gray-800 text-white outline-none h-16' 
          placeholder='Enter text...'
        />
        <button 
         
          className='absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center px-4 lg:px-6 h-[2.5rem] lg:h-[3rem] rounded-full font-medium text-white transition-colors bg-gradient-to-b from-[#5AD7FF] to-[#656BF5]   '>
          <img src="/ImageGeneate/Group.svg" alt="Generate" className='mr-2' /> Generate
        </button>
      </div>
    </div>
  );
};

export default Input;
