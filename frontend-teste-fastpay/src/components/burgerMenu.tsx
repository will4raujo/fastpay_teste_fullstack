'use client'
import { ReactNode, useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function BurguerMenu({ children }: { children: ReactNode }) {

  const [isOpen, setIsOpen] = useState(false);

  const handleMenu = () => {
    setIsOpen(!isOpen);
  }
  

  return (
    <div className='md:hidden'>
      <div className='cursor-pointer flex gap-2 items-center' onClick={handleMenu}>
        <Menu size={22} />
        <span className='text-white text-lg'>Menu</span>
      </div>
    { isOpen && (
        <div className='fixed left-0 top-0 h-screen w-60 bg-black/90 flex flex-col justify-start gap-4 py-2 px-4' onClick={handleMenu}>
          <div className='close-icon relative cursor-pointer flex flex-col justify-between w-8 h-8 mt-1'> 
            <X size={20} />
          </div>
          {children}
        </div>
      )}
    </div>
  )
}