'use client';

import React, { useState } from 'react';
import { Heart, Share2 } from 'lucide-react';

interface PoemProps {
  poem: {
    _id: string;
    title: string;
    content: string;
    date: string;
    category: string;
    likes: number;
  }
}

const PoemDisplay: React.FC<PoemProps> = ({ poem }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(poem.likes);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikesCount(prev => prev + 1);
    } else {
        setLiked(false);
        setLikesCount(prev => prev - 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${poem.title}\n\n${poem.content}`);
    alert('Poem copied to clipboard!');
  };

  return (
    <div className="border p-6 rounded-lg shadow-sm bg-white mb-6 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">{poem.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{new Date(poem.date).toLocaleDateString()} | <span className="uppercase tracking-wider text-xs font-semibold text-blue-500">{poem.category}</span></p>
        </div>
      </div>
      
      <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed mb-6 text-gray-700">
        {poem.content}
      </div>

      <div className="flex gap-6 border-t pt-4">
        <button 
            onClick={handleLike} 
            className={`flex items-center gap-2 ${liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-600 transition`}
        >
            <Heart className={liked ? 'fill-current' : ''} size={20} />
            <span className="font-medium">{likesCount}</span>
        </button>
        <button 
            onClick={handleShare}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition"
        >
            <Share2 size={20} />
            <span className="font-medium">Share</span>
        </button>
      </div>
    </div>
  );
};

export default PoemDisplay;
