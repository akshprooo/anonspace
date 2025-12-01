import React, { useState } from 'react';
import { X, Lock, AlertCircle } from 'lucide-react';
import axios from 'axios';

const JoinPrivateBoardModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    boardId: '',
    boardKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (!formData.boardId.trim()) {
      setError('Board ID is required');
      return;
    }

    if (!formData.boardKey.trim()) {
      setError('Board key is required');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(import.meta.env.VITE_API_URL+'/api/boards/join/private', {
        boardId: formData.boardId,
        boardKey: formData.boardKey
      }, {
        headers:{
            "x-client-token":localStorage.getItem('clientToken'),
        }
      });

      // Reset form
      setFormData({ boardId: '', boardKey: '' });
      
      // Call success callback
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to join board');
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
          <div className='flex items-center gap-2'>
            <Lock size={24} />
            <h2 className='text-2xl font-medium'>Join Private Board</h2>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-white/10 rounded-lg transition-colors'
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className='p-5 space-y-5'>
          {/* Board ID */}
          <div className='space-y-2'>
            <label htmlFor='boardId' className='text-sm text-white/60'>
              Board ID
            </label>
            <input
              type='text'
              id='boardId'
              name='boardId'
              value={formData.boardId}
              onChange={handleChange}
              placeholder='Enter board ID'
              className='w-full p-3 bg-white/5 border-2 border-white/20 rounded-lg focus:border-white/40 focus:outline-none transition-colors'
              disabled={loading}
            />
            <p className='text-xs text-white/40'>
              Get this from the board creator
            </p>
          </div>

          {/* Board Key */}
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
              The secret key to access this board
            </p>
          </div>

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
            {loading ? 'Joining...' : 'Join Board'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinPrivateBoardModal;