import React, { useContext, useState } from 'react';
import { X, Globe, Lock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { userContext } from '../context/UserProvider';
import { PublicBoardsContext } from '../context/PublicBoardsProvider';

const CreateBoardModal = ({ isOpen, onClose, onSuccess }) => {
  const [boardType, setBoardType] = useState('public');
  const [formData, setFormData] = useState({
    name: '',
    boardKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {getUser} = useContext(userContext);
  const {getPublicBoards} = useContext(PublicBoardsContext);

  const handleSubmit = async () => {
    setError('');

    if (!formData.name.trim()) {
      setError('Board name is required');
      return;
    }

    if (boardType === 'private' && !formData.boardKey.trim()) {
      setError('Board key is required for private boards');
      return;
    }

    setLoading(true);

    try {
      const api_url = import.meta.env.VITE_API_URL;
      const endpoint = boardType === 'public' 
        ? '/api/boards/create/public' 
        : '/api/boards/create/private';

      const body = boardType === 'public'
        ? { name: formData.name }
        : { name: formData.name, boardKey: formData.boardKey };

      const response = await axios.post(api_url+endpoint, body, {
        headers:{
            "x-client-token":localStorage.getItem('clientToken')
        }
      });

      // Reset form
      setFormData({ name: '', boardKey: '' });
      setBoardType('public');
      
      // Call success callback
      if (onSuccess) {
        onSuccess(response.data.board);
      }
      
      onClose();
      getUser();
      getPublicBoards();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div 
        className='absolute inset-0 bg-black/70 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='relative w-full max-w-md bg-black/90 backdrop-blur-xl border-2 border-white/30 rounded-xl shadow-2xl'>
        {/* Header */}
        <div className='flex items-center justify-between p-5 border-b-2 border-white/20'>
          <h2 className='text-2xl font-medium'>Create a Board</h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-white/10 rounded-lg transition-colors'
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className='p-5 space-y-5'>
          {/* Board Type Toggle */}
          <div className='space-y-2'>
            <label className='text-sm text-white/60'>Board Type</label>
            <div className='grid grid-cols-2 gap-3'>
              <button
                type='button'
                onClick={() => setBoardType('public')}
                className={`
                  flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all
                  ${boardType === 'public'
                    ? 'bg-white text-black border-white'
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }
                `}
              >
                <Globe size={20} />
                <span className='font-medium'>Public</span>
              </button>
              <button
                type='button'
                onClick={() => setBoardType('private')}
                className={`
                  flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all
                  ${boardType === 'private'
                    ? 'bg-white text-black border-white'
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }
                `}
              >
                <Lock size={20} />
                <span className='font-medium'>Private</span>
              </button>
            </div>
          </div>

          {/* Board Name */}
          <div className='space-y-2'>
            <label htmlFor='name' className='text-sm text-white/60'>
              Board Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter board name'
              className='w-full p-3 bg-white/5 border-2 border-white/20 rounded-lg focus:border-white/40 focus:outline-none transition-colors'
              disabled={loading}
            />
          </div>

          {/* Board Key (only for private) */}
          {boardType === 'private' && (
            <div className='space-y-2'>
              <label htmlFor='boardKey' className='text-sm text-white/60'>
                Board Key (Password)
              </label>
              <input
                type='password'
                id='boardKey'
                name='boardKey'
                value={formData.boardKey}
                onChange={handleChange}
                placeholder='Enter board key'
                className='w-full p-3 bg-white/5 border-2 border-white/20 rounded-lg focus:border-white/40 focus:outline-none transition-colors'
                disabled={loading}
              />
              <p className='text-xs text-white/40'>
                Members will need this key to join the board
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className='flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400'>
              <AlertCircle size={18} />
              <span className='text-sm'>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className='w-full p-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {loading ? 'Creating...' : 'Create Board'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBoardModal;