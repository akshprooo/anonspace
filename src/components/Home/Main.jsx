import React, { useState } from 'react';
import BoardCard from '../AllBoards/BoardCard';
import CreateBoardModal from '../CreateBoardModal';
import { Plus } from 'lucide-react';

const HomeMain = ({ boards }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localBoards, setLocalBoards] = useState(boards);

  const handleBoardCreated = (newBoard) => {
    setLocalBoards([newBoard, ...localBoards]);
  };

  return (
    <>
      <div className='w-full min-h-screen p-4 sm:p-6 lg:p-8'>
        
      </div>
    </>
  );
};

export default HomeMain;