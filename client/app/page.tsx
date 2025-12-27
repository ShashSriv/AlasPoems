'use client';
import { useEffect, useState } from 'react';
import PoemDisplay from '@/components/PoemDisplay';
import { Loader2 } from 'lucide-react';
import iconCat from '../public/assets/Wshy.png'
import Image from 'next/image'; 

interface Poem {
    _id: string;
    title: string;
    content: string;
    date: string;
    category: string;
    likes: number;
}

const CAT_IMAGES = [
  '/assets/BJump.jpg',
  '/assets/BPeace.jpg',
  '/assets/BWhugging.jpg',
  '/assets/BWlaydown.jpg',
  '/assets/WBonTop.jpg',
  '/assets/WCap.jpg',
  '/assets/Wshy.png',
];

// Helper to shuffle array
const shuffleArray = (array: string[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Home() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);
  
  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPoemId, setSelectedPoemId] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Check admin status
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);

    // Prepare shuffled images
    setShuffledImages(shuffleArray(CAT_IMAGES));

    fetch(`${API_BASE}/poems`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setPoems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch poems', err);
        setError('Could not load poems. Ensure backend is running on port 5000.');
        setLoading(false);
      });
  }, []);

  const handleDeleteRequest = (id: string) => {
    setSelectedPoemId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPoemId) return;

    try {
      const res = await fetch(`${API_BASE}/poems/${selectedPoemId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-admin': 'true',
        },
      });

      if (res.ok) {
        setPoems(prev => prev.filter(p => p._id !== selectedPoemId));
        setShowDeleteModal(false);
        setSelectedPoemId(null);
      } else {
        alert('Failed to delete poem');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting poem');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-dusty-rose">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-serif text-xl animate-pulse">Loading poems...</p>
    </div>
  );
  
  if (error) return <div className="text-center py-10 text-red-400 font-bold">{error}</div>;

  return (
    <main className="pb-20">
      <header className="mb-16 text-center">
        <h1 className="text-6xl font-bold mb-4 text-chocolate-text font-serif tracking-tight drop-shadow-sm text-center">Alicja Czaja</h1>
        <p className="text-xl text-soft-mauve italic font-serif relative inline-block">
            A collection of thoughts and verses
        </p>
      </header>

      <div className="grid gap-8 max-w-3xl mx-auto">
        {poems.map((poem, index) => (
          <PoemDisplay 
            key={poem._id} 
            poem={poem} 
            isAdmin={isAdmin} 
            onDeleteRequest={handleDeleteRequest}
            imageUrl={shuffledImages.length > 0 ? shuffledImages[index % shuffledImages.length] : undefined}
          />
        ))}
        {poems.length === 0 && (
            <div className="text-center py-20 opacity-70">
                <div className="inline-block p-6 bg-white rounded-full shadow-pink-soft mb-4">
                    <Image src={iconCat} width={64} height={64} alt="Cat Icon" className="text-dusty-rose" />
                </div>
                <p className="text-chocolate-text font-serif text-xl">The pages are empty...</p>
            </div>
        )}
      </div>

      {/* Custom Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5D4037]/20 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl shadow-pink-soft max-w-sm w-full p-8 transform transition-all scale-100 border-2 border-pink-100 relative overflow-hidden">
            {/* Decorative BG element */}
            <div className="absolute top-0 left-0 w-full h-2 bg-dusty-rose"></div>

            <div className="flex justify-center mb-4 text-dusty-rose">
                <Image src={iconCat} width={128} height={128} alt="Cat Icon" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-chocolate-text mb-4 text-center">Are you sure?</h3>
            <p className="text-soft-mauve font-sans mb-8 text-center leading-relaxed">
              Do you really want to delete this poem? <br/> It will be lost forever.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 text-chocolate-text hover:bg-pink-50 font-bold rounded-xl transition-colors font-sans"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-3 bg-red-400 text-white font-bold rounded-xl hover:bg-red-500 shadow-pink-glow transition-all duration-300 font-sans transform hover:scale-105"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}