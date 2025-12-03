import React, { useState, useContext, useEffect } from "react";
import { Users, Calendar, UserPlus, Check, Lock, Link } from "lucide-react";
import axios from "axios";
import { userContext } from "../../context/UserProvider";
import { useNavigate } from "react-router-dom";

const BoardCard = ({ board, boardType = 'public' }) => {
  const { user } = useContext(userContext);
  
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [memberCount, setMemberCount] = useState(board.members?.length || 0);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && Array.isArray(user.publicBoards) && Array.isArray(user.privateBoards)) {
      const inPublic = user.publicBoards.includes(board._id);
      const inPrivate = user.privateBoards.includes(board._id);
      setIsJoined(inPublic || inPrivate);
    }
  }, [user, board._id]);

  const handleJoin = async (e) => {
    e.stopPropagation();
    
    if (loading || isJoined) return;
    
    // Only allow joining public boards from the card
    if (boardType === 'private') return;
    
    setLoading(true);
    try {
      await axios.post('/api/boards/join/public', {
        boardId: board._id
      });

      setIsJoined(true);
      setMemberCount(prev => prev + 1);
    } catch (err) {
      console.error('Failed to join board:', err);
      alert(err.response?.data?.error || 'Failed to join board');
    } finally {
      setLoading(false);
    }
  };

  const isPrivate = boardType === 'private' || board.boardKey !== undefined;

  return (
    <div
      className="
        p-5 rounded-lg border-2 border-white/30 
        bg-black/40 backdrop-blur-md
        hover:bg-black/60 hover:border-white/40 hover:-translate-y-1 hover:shadow-xl 
        transition-all duration-300 cursor-pointer
        group h-full flex flex-col
      "

      onClick={()=>{
        if (isPrivate){
          navigate(`/board/private/${board._id}`);
        }else{
          navigate(`/board/public/${board._id}`);
        }
      }}
    >
      <div className="flex flex-col gap-3 grow">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-grow min-w-0">
            {isPrivate && (
              <Lock size={18} className="flex-shrink-0 text-white/60" />
            )}
            <h2 className="text-xl font-medium tracking-wide group-hover:text-white/90 transition-colors line-clamp-2">
              {board.name}
            </h2>
          </div>
          
          {/* Only show join button for public boards */}
          {!isPrivate && (
            <button
              onClick={handleJoin}
              disabled={loading || isJoined}
              className={`
                flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium
                transition-all flex-shrink-0
                ${isJoined
                  ? 'bg-white/10 text-white/60 cursor-default'
                  : 'bg-white text-black hover:bg-white/90 hover:scale-105'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isJoined ? (
                <>
                  <Check size={14} />
                  <span>Joined</span>
                </>
              ) : (
                <>
                  <UserPlus size={14} />
                  <span>Join</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm mt-auto">
          <div className="flex items-center gap-2 text-white/60 group-hover:text-white/70 transition-colors">
            <Users size={16} className="flex-shrink-0" />
            <span>{memberCount} {memberCount === 1 ? 'Member' : 'Members'}</span>
          </div>

          {
            isPrivate?(
              <div className="flex items-center gap-2 text-white/60">
                <Link size={16} /> {board._id}
              </div>
            )
            :
            ''
          }

          <div className="flex items-center gap-2 text-white/40 group-hover:text-white/50 transition-colors">
            <Calendar size={16} className="flex-shrink-0" />
            <span>{new Date(board.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;