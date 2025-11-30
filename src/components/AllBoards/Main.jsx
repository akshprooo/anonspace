import React, { useContext, useState } from 'react';
import BoardCard from './BoardCard';
import CreateBoardModal from '../CreateBoardModal';
import { Plus } from 'lucide-react';
import { userContext } from '../../context/UserProvider';

const BoardsMain = ({ boards }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localBoards, setLocalBoards] = useState(boards);

  const handleBoardCreated = (newBoard) => {
    setLocalBoards([newBoard, ...localBoards]);
  };

  const {user} = useContext(userContext);

  return (
    <>
      <div className='w-full min-h-screen p-4 sm:p-6 lg:p-8'>
        <div className='max-w-7xl mx-auto'>
          <header className='w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8'>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-medium'>
              Public Boards
            </h1>

            <button 
              onClick={() => setIsModalOpen(true)}
              className='flex text-base sm:text-lg lg:text-xl items-center gap-2 text-black bg-white px-4 py-2 sm:px-5 sm:py-3 rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap'
            >
              <span className='hidden sm:inline'>Create a Board</span>
              <span className='sm:hidden'>Create</span>
              <Plus size={20} />
            </button>
          </header>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6'>
            {localBoards.map((board) => (
              <BoardCard key={board._id} board={board} currentUserId={user._id} />
            ))}
          </div>

          {localBoards.length === 0 && (
            <div className='text-center text-white/40 mt-12'>
              No public boards available
            </div>
          )}
        </div>
      </div>

      <CreateBoardModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleBoardCreated}
      />
    </>
  );
};

export default BoardsMain;