import React, { useState, useEffect, useContext } from "react";
import BoardCard from "./BoardCard";
import CreateBoardModal from "../CreateBoardModal";
import JoinPrivateBoardModal from "../JoinPrivateBoardModal";
import { Plus, Globe, Lock, LogIn } from "lucide-react";
import { userContext } from "../../context/UserProvider";
import axios from "axios";

const BoardsMain = ({ boards }) => {
  const { user, getUser } = useContext(userContext);

  const [activeTab, setActiveTab] = useState("public");

  const [privateBoards, setPrivateBoards] = useState([]);
  const [loadingPrivate, setLoadingPrivate] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    if (!user || !user.privateBoards || user.privateBoards.length === 0) {
      setPrivateBoards([]);
      return;
    }

    const fetchPrivateBoards = async () => {
      try {
        setLoadingPrivate(true);

        const requests = user.privateBoards.map(id =>
          axios.get(import.meta.env.VITE_API_URL+`/api/boards/info/private/${id}`, {headers:{"x-client-token":localStorage.getItem('clientToken')}})
        );

        const responses = await Promise.all(requests);
        const result = responses.map(r => r.data.board);

        setPrivateBoards(result);
      } catch (err) {
        console.log("Error fetching private boards:", err);
      } finally {
        setLoadingPrivate(false);
      }
    };

    fetchPrivateBoards();
  }, [user]);
  
  const handleBoardCreated = () => {
    getUser();
  };

  const handleBoardJoined = () => {
    getUser();
  };

  const publicBoards = boards.filter(b => !b.boardKey);

  return (
    <>
      <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <header className="w-full flex flex-col gap-4 mb-6 lg:mb-8">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium">
                Boards
              </h1>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="flex text-base sm:text-lg items-center gap-2 text-white bg-white/10 border-2 border-white/30 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors font-medium"
                >
                  <LogIn size={18} /> Join Private
                </button>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex text-base sm:text-lg items-center gap-2 text-black bg-white px-4 py-2 rounded-lg hover:bg-white/90 transition-colors font-medium"
                >
                  <Plus size={18} /> Create
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b-2 border-white/10">
              <button
                onClick={() => setActiveTab("public")}
                className={`flex items-center gap-2 px-4 py-3 font-medium ${
                  activeTab === "public"
                    ? "text-white border-b-2 border-white -mb-[2px]"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                <Globe size={18} /> Public Boards
              </button>

              <button
                onClick={() => setActiveTab("private")}
                className={`flex items-center gap-2 px-4 py-3 font-medium ${
                  activeTab === "private"
                    ? "text-white border-b-2 border-white -mb-[2px]"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                <Lock size={18} /> Private Boards
              </button>
            </div>
          </header>

          {/* Content */}
          {activeTab === "public" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {publicBoards.map(board => (
                <BoardCard key={board._id} board={board} boardType="public" />
              ))}

              {publicBoards.length === 0 && (
                <p className="text-white/40 mt-10 text-center">No public boards found.</p>
              )}
            </div>
          )}

          {activeTab === "private" && (
            <>
              {loadingPrivate ? (
                <div className="mt-12 text-center text-white/60 text-lg animate-pulse">
                  Loading your private boards...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {privateBoards.map(board => (
                    <BoardCard key={board._id} board={board} boardType="private" />
                  ))}

                  {privateBoards.length === 0 && (
                    <p className="text-white/40 mt-10 text-center">
                      You haven't joined any private boards yet.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleBoardCreated}
      />

      <JoinPrivateBoardModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={handleBoardJoined}
      />
    </>
  );
};

export default BoardsMain;
