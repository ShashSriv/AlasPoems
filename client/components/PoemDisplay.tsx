'use client';

import React, { useState, useEffect } from 'react';
import { PawPrint, Share2, Edit, Trash } from 'lucide-react';
import Link from 'next/link';

interface PoemProps {
  poem: {
    _id: string;
    title: string;
    content: string;
    date: string;
    category: string;
    likes: number;
  };
  isAdmin?: boolean;
  onDeleteRequest?: (id: string) => void;
  imageUrl?: string;
}

const PoemDisplay: React.FC<PoemProps> = ({ poem, isAdmin, onDeleteRequest, imageUrl }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(poem.likes);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Check localStorage on mount
    const likedPoems = JSON.parse(localStorage.getItem('likedPoems') || '[]');
    if (likedPoems.includes(poem._id)) {
      setLiked(true);
    }
  }, [poem._id]);

  const handleLike = async () => {
    const likedPoems = JSON.parse(localStorage.getItem('likedPoems') || '[]');
    const isLiked = likedPoems.includes(poem._id);
    const action = isLiked ? 'dec' : 'inc';

    // Optimistic Update
    setLiked(!isLiked);
    setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));

    // Update Local Storage
    let updatedLikedPoems;
    if (isLiked) {
        updatedLikedPoems = likedPoems.filter((id: string) => id !== poem._id);
    } else {
        updatedLikedPoems = [...likedPoems, poem._id];
    }
    localStorage.setItem('likedPoems', JSON.stringify(updatedLikedPoems));

    // API Call
    try {
        await fetch(`${API_BASE}/poems/${poem._id}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action }),
        });
    } catch (err) {
        console.error('Failed to update like status', err);
        // Revert on error
        setLiked(isLiked);
        setLikesCount(prev => (isLiked ? prev + 1 : prev - 1));
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${poem.title}\n\n${poem.content}`);
    alert('Poem copied to clipboard!');
  };

  return (
    <div className="relative mt-12">
       {/* Cat Ears Decoration */}
      <div className="absolute -top-4 left-8 w-8 h-8 bg-white rounded-t-xl transform -rotate-12 z-0 border-t border-l border-pink-50"></div>
      <div className="absolute -top-4 right-8 w-8 h-8 bg-white rounded-t-xl transform rotate-12 z-0 border-t border-r border-pink-50"></div>

      <div className="relative z-10 bg-white rounded-3xl p-8 shadow-pink-soft hover:shadow-pink-glow transition-all duration-300 border border-pink-50">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                  <h2 className="text-3xl font-bold text-chocolate-text font-serif tracking-wide">{poem.title}</h2>
                  <p className="text-sm text-soft-mauve mt-2 font-sans flex items-center gap-2">
                    <span>{new Date(poem.date).toLocaleDateString()}</span> 
                    <span>•</span>
                    <span className="uppercase tracking-wider text-xs font-bold text-dusty-rose bg-pink-50 px-2 py-1 rounded-full">{poem.category}</span>
                  </p>
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <Link 
                    href={`/admin?id=${poem._id}`}
                    className="text-soft-mauve hover:text-dusty-rose transition p-2 bg-pink-50 rounded-full"
                    title="Edit Poem"
                  >
                      <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => onDeleteRequest && onDeleteRequest(poem._id)}
                    className="text-soft-mauve hover:text-red-400 transition p-2 bg-pink-50 rounded-full"
                    title="Delete Poem"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="whitespace-pre-wrap font-serif text-lg leading-loose mb-8 text-chocolate-text/90 pl-4 border-l-2 border-pink-100">
              {poem.content}
            </div>

            <div className="flex gap-6 border-t border-pink-50 pt-6">
              <button 
                  onClick={handleLike} 
                  className={`flex items-center gap-2 transition-all duration-300 group ${liked ? 'text-dusty-rose' : 'text-soft-mauve hover:text-dusty-rose'}`}
              >
                  <div className={`p-2 rounded-full transition-colors ${liked ? 'bg-pink-100' : 'bg-gray-50 group-hover:bg-pink-50'}`}>
                    <PawPrint className={`transition-transform duration-300 ${liked ? 'fill-current scale-110' : 'scale-100'}`} size={20} />
                  </div>
                  <span className="font-bold font-sans">{likesCount}</span>
              </button>
              <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 text-soft-mauve hover:text-dusty-rose transition font-sans group"
              >
                <div className="p-2 rounded-full bg-gray-50 group-hover:bg-pink-50 transition-colors">
                    <Share2 size={20} />
                </div>
                  <span className="font-medium">Share</span>
              </button>
            </div>
          </div>

          {/* Poem Image - Fixed 128x128 */}
          {imageUrl && (
              <div className="shrink-0">
                  <img 
                      src={imageUrl} 
                      alt="Poem Illustration" 
                      className="w-32 h-32 rounded-2xl object-cover shadow-sm"
                  />
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoemDisplay;
