import React, { useState, useContext, useEffect } from 'react';
import { Users, Home, Menu, X, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { userContext } from '../../context/UserProvider';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(userContext);

  const links = [
    { name: "Home", link: "/", icon: Home },
    { name: "All Boards", link: "/boards", icon: Users },
  ];

  const location = useLocation();

  useEffect(() => {
    if (user.reputation == undefined) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [user.reputation]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className='lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-black/60 backdrop-blur-md rounded-xl border-2 border-white/30 hover:bg-black/80 transition-all shadow-lg'
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className='lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-30'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative
        w-full sm:w-80 lg:w-1/4
        h-screen
        transition-transform duration-300 ease-in-out
        z-40
        p-2
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className='w-full h-full border-2 border-white/30 rounded-lg flex flex-col bg-black/90 backdrop-blur-xl shadow-2xl'>

          {/* Header Section */}
          <section className='w-full flex p-5 lg:p-4 items-center justify-between lg:justify-start gap-3 border-b-2 border-white/20'>
            <div className='flex items-center gap-3'>
              <img src="/images/anonspace-white.png" className=' h-12 w-12' alt="AnonSpace" />
              <h2 className='text-2xl lg:text-3xl font-sans font-medium'>AnonSpace</h2>
            </div>
            
            {/* Mobile Close Button in Header */}
            {/* <button 
              onClick={() => setIsOpen(false)}
              className='lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors'
            >
              <X size={24} />
            </button> */}
          </section>

          {/* Navigation Links */}
          <section className='w-full grow p-4 lg:p-2 overflow-y-auto'>
            <div className='w-full h-full border rounded-lg border-white/10 p-4 lg:p-3 flex flex-col gap-2'>
              {links.map((item, index) => {
                const Icon = item.icon;
                const isActive = item.link === location.pathname;
                return (
                  <Link 
                    key={index}
                    to={item.link} 
                    className={`
                      flex gap-3 text-lg lg:text-xl items-center 
                      p-4 lg:p-2 rounded-lg transition-all
                      ${isActive 
                        ? 'bg-white text-black shadow-lg scale-[1.02]' 
                        : 'hover:bg-white/10 hover:translate-x-1'
                      }
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={22} className="shrink-0" /> 
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* User Profile Section */}
          <section className='w-full border-t-2 border-white/20 p-4 lg:p-2'>
            <div className='w-full bg-white/5 rounded-lg border border-white/10 p-4 flex gap-4'>
              {/* Profile Image */}
              <div className='w-16 h-16 lg:w-20 lg:h-20 bg-linear-to-br from-white/60 to-white/30 rounded-xl flex items-center justify-center shrink-0 shadow-lg'>
                <User size={32} className="text-black/70" />
              </div>

              {/* User Stats */}
              <div className='flex flex-col justify-center gap-1 text-sm lg:text-base'>
                {loading ? (
                  <>
                    <div className='flex items-center gap-2'>
                      <span className='text-white/50'>Reputation:</span>
                      <span className='font-semibold'>0</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-white/50'>Public:</span>
                      <span className='font-semibold'>0</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-white/50'>Private:</span>
                      <span className='font-semibold'>0</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='flex items-center gap-2'>
                      <span className='text-white/50'>Reputation:</span>
                      <span className='font-semibold text-white'>{user.reputation || 0}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-white/50'>Public:</span>
                      <span className='font-semibold text-white'>{user.publicBoards?.length || 0}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-white/50'>Private:</span>
                      <span className='font-semibold text-white'>{user.privateBoards?.length || 0}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default Sidebar;