import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Heart } from 'lucide-react';

const Page = ({ id }) => {
  const location = useLocation();
  const mode = location.pathname.includes("/board/public/") ? "public" : "private";

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([]);
  const [postModal, setPostModal] = useState(false);

  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    setLikedPosts(saved);
  }, []);

  // fetch board info
  useEffect(() => {
    setLoading(true);

    const fetchBoard = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/boards/info/${mode}/${id}`,
          { headers: { "x-client-token": localStorage.getItem("clientToken") } }
        );
        setBoard(res.data || null);
        console.log(res.data);
      } catch (err) {
        console.log("Fetch board error:", err);
        setBoard(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [id, mode]);

  // Fetch posts
  const getPosts = async () => {
    try {
      const endpoint = `${import.meta.env.VITE_API_URL}/api/posts/${mode}/${id}`;
      const res = await axios.get(endpoint, {
        headers: { "x-client-token": localStorage.getItem('clientToken') }
      });
      setPosts(res.data || []);
    } catch (err) {
      console.log("Get posts error:", err);
    }
  };

  useEffect(() => {
    getPosts();
  }, [mode, id]);


  // like post
  const likePost = async (postId) => {
    if (likedPosts.includes(postId)) return;

    const updated = [...likedPosts, postId];
    setLikedPosts(updated);
    localStorage.setItem("likedPosts", JSON.stringify(updated));

    const heart = document.getElementById(`heart-${postId}`);
    if (heart) {
      heart.classList.add('animate-heart-burst');
      setTimeout(() => heart.classList.remove('animate-heart-burst'), 800);
    }
    
    const endpoint = `${import.meta.env.VITE_API_URL}/api/posts/like`
    const res = await axios.post(endpoint, {postId}, {header:{"x-client-token":localStorage.getItem('clientToken')}});
    getPosts();
  };

  // Create post
  const createPost = async (heading, text) => {
    try {
      const endpoint = `${import.meta.env.VITE_API_URL}/api/posts/create/${mode}`;
      await axios.post(endpoint,
        { boardId: id, heading, text },
        { headers: { "x-client-token": localStorage.getItem('clientToken') } }
      );
      getPosts();
      setPostModal(false);
    } catch (err) {
      console.log("Create post error:", err);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen p-6 flex items-center justify-center">
        <p className="text-white/60 text-lg">Loading board...</p>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="w-full min-h-screen p-6 flex flex-col items-center justify-center">
        <h2 className="text-white text-2xl font-medium mb-2">Board not found</h2>
        <p className="text-white/40">The board you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
            {board.name}
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl">
            Members: {board.members?.length}
          </p>

          <button
            onClick={() => setPostModal(true)}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md"
          >
            Create Post
          </button>
        </header>

        <div className="space-y-4">
          {posts.length === 0 && (
            <p className="text-white/40 text-center py-10">No posts yet.</p>
          )}

          {posts.map(post => (
            <div
              key={post._id}
              className="border border-white/10 bg-white/5 backdrop-blur-sm p-4 rounded-lg relative overflow-hidden"
            >
              {post.content.map((block, idx) => (
                <div key={idx} className="mb-3">
                  <h2 className="text-xl font-semibold mb-1">{block.heading}</h2>
                  <p className="text-white/70">{block.text}</p>
                </div>
              ))}

              <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-3">
                <p className="text-xs text-white/40">
                  {new Date(post.createdAt).toLocaleString()}
                </p>

                <div className="flex gap-3">

                  <button
                    onClick={() => likePost(post._id)}
                    disabled={likedPosts.includes(post._id)}
                    className={`px-3 py-1 rounded-md text-sm flex items-center gap-1
                      ${likedPosts.includes(post._id)
                        ? "bg-white/5 opacity-40 cursor-not-allowed"
                        : "bg-white/10 hover:bg-white/20"}
                    `}
                  >
                    <Heart
                      id={`heart-${post._id}`}
                      className={`w-4 h-4 ${likedPosts.includes(post._id) ? "text-red-400 animate-heart-burst" : ""}`}
                    />
                    {post.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CREATE POST MODAL */}
        {postModal && (
          <CreatePostModal close={() => setPostModal(false)} submit={createPost} />
        )}

      </div>
    </div>
  );
};

export default Page;

// ================================= CREATE POST MODAL =================================
const CreatePostModal = ({ close, submit }) => {
  const [heading, setHeading] = useState("");
  const [text, setText] = useState("");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999]">
      <div className="bg-black/90 border border-white/10 rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Create Post</h2>

        <input
          type="text"
          placeholder="Heading"
          value={heading}
          onChange={e => setHeading(e.target.value)}
          className="w-full px-3 py-2 mb-3 bg-white/5 border border-white/10 rounded-md text-white"
        />

        <textarea
          placeholder="Write your text..."
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full px-3 py-2 mb-4 bg-white/5 border border-white/10 rounded-md text-white h-32"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={close}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={() => submit(heading, text)}
            className="px-4 py-2 bg-white text-black rounded-md"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};
