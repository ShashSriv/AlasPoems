'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Feather } from 'lucide-react';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Modern');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; msg: string }>({ type: '', msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const poemId = searchParams.get('id');
  const isEditing = !!poemId;

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (isEditing) {
      fetch(`${API_BASE}/poems/${poemId}`)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch poem');
            return res.json();
        })
        .then(data => {
            setTitle(data.title);
            setCategory(data.category);
            setContent(data.content);
        })
        .catch(err => {
            console.error(err);
            setStatus({ type: 'error', msg: 'Could not load poem for editing.' });
        });
    }
  }, [poemId, isEditing]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', msg: '' });

    const url = isEditing 
        ? `${API_BASE}/poems/${poemId}`
        : `${API_BASE}/poems`;
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin': 'true', 
        },
        body: JSON.stringify({
          title,
          category,
          content,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save poem');
      }

      if (isEditing) {
          setStatus({ type: 'success', msg: 'Poem updated successfully!' });
      } else {
        // Clear form on create success
        setTitle('');
        setCategory('Modern');
        setContent('');
        setStatus({ type: 'success', msg: 'Poem published successfully!' });
      }
      
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', msg: 'Error saving poem. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-pink-200">
        <h1 className="text-4xl font-bold text-chocolate-text font-serif flex items-center gap-3">
            <Feather className="text-dusty-rose" size={32} />
            {isEditing ? 'Edit Poem' : 'Weave a Verse'}
        </h1>
      </div>
      
      {status.msg && (
        <div className={`p-4 rounded-2xl mb-6 shadow-sm font-sans font-bold text-center ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-8 rounded-3xl shadow-pink-soft">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-chocolate-text mb-2 font-sans">
            Poem Title
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-pink-100 rounded-xl focus:ring-2 focus:ring-dusty-rose focus:border-dusty-rose outline-none transition bg-white/80 text-chocolate-text placeholder-soft-mauve shadow-sm"
            placeholder="Give your poem a name..."
          />
        </div>

        {/* Category Selection */}
        <div>
          <label htmlFor="category" className="block text-sm font-bold text-chocolate-text mb-2 font-sans">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-pink-100 rounded-xl focus:ring-2 focus:ring-dusty-rose focus:border-dusty-rose outline-none transition bg-white/80 text-chocolate-text shadow-sm"
          >
            <option value="Modern">Modern</option>
            <option value="Nature">Nature</option>
            <option value="Philosophy">Philosophy</option>
            <option value="Love">Love</option>
            <option value="Haiku">Haiku</option>
            <option value="Sonnet">Sonnet</option>
            <option value="Free Verse">Free Verse</option>
          </select>
        </div>

        {/* Content Textarea */}
        <div>
          <label htmlFor="content" className="block text-sm font-bold text-chocolate-text mb-2 font-sans">
            Poem Content
          </label>
          <textarea
            id="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full px-4 py-4 border border-pink-100 rounded-xl focus:ring-2 focus:ring-dusty-rose focus:border-dusty-rose outline-none transition font-serif text-lg leading-loose resize-y bg-white/80 text-chocolate-text placeholder-soft-mauve shadow-sm"
            placeholder="Type your poem here..."
          />
          <p className="text-xs text-soft-mauve mt-2 text-right font-sans italic">Whitespace and stanzas are preserved.</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 text-white font-bold rounded-xl shadow-pink-glow transition-all duration-300
            ${isSubmitting 
              ? 'bg-soft-mauve cursor-not-allowed' 
              : 'bg-dusty-rose hover:bg-[#c46d88] transform hover:-translate-y-1'
            }`}
        >
          {isSubmitting 
            ? (isEditing ? 'Updating...' : 'Publishing...') 
            : (isEditing ? 'Update Poem' : 'Publish Poem')
          }
        </button>
      </form>
    </main>
  );
}
