import React, { useState } from 'react'
import { GroupIcon, Home, HomeIcon, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'
import { useContext } from 'react';
import { userContext } from '../../context/UserProvider';
import { useEffect } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true)
  const {user} = useContext(userContext);

  const links = [
    { name: "Home", link: "/", icon: HomeIcon },
    { name: "Public Boards", link: "/boards", icon: GroupIcon },
  ]

  const location = useLocation();

  useEffect(()=>{
    if (user.reputation==undefined){
      setLoading(true);
    }else{
      setLoading(false)
    }
  })

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className='lg:hidden fixed top-4 right-4 z-50 p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/30'
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div 
          className='lg:hidden fixed inset-0 bg-black/50 z-30'
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed lg:relative
        w-3/4 sm:w-2/3 lg:w-1/4
        h-screen
        p-3 pr-1
        transition-transform duration-300 ease-in-out
        z-40 
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className='w-full h-full border-2 border-white/30 rounded-lg flex flex-col bg-black/80 backdrop-blur-md'>

          <section className='w-full flex p-4 items-center gap-3 border-b-2 border-white/20'>
            <img src="/images/anonspace-white.png" className='w-1/5' alt="" />
            <h2 className='text-xl sm:text-2xl lg:text-3xl font-sans font-medium'>AnonSpace</h2>
          </section>

          <section className='w-full h-full p-2'>
            <div className='w-full h-full border rounded-md border-white/10 p-3 flex flex-col'>
              {links.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={index}
                    to={item.link} 
                    className={`flex gap-2 text-lg sm:text-xl items-center ${item.link==location.pathname?'bg-white/90 text-black':'hover:bg-white/10'} p-2 rounded-md transition-colors`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} /> {item.name}
                  </Link>
                )
              })}
            </div>
          </section>

          <section className='w-full h-auto lg:h-1/4 border-t-2 border-white/20 p-2 flex gap-2'>
            <div className='w-16 h-16 sm:w-20 sm:h-20 lg:w-1/4 lg:h-full bg-white/50 rounded-lg profile-image flex-shrink-0'></div>

            <div className='text-sm sm:text-base'>
              {loading?
              <><h1>Reputation: {0}</h1>
              <h1>Public Boards: {0}</h1>
              <h1>Private Boards: {0}</h1></>
              :
              <><h1>Reputation: {user.reputation || 0}</h1>
              <h1>Public Boards: {user.publicBoards.length || 0}</h1>
              <h1>Private Boards: {user.privateBoards.length || 0}</h1></>
              }
            </div>
          </section>

        </div>
      </div>
    </>
  )
}

export default Sidebar