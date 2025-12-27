'use client';
import { useEffect, useState } from 'react';
import PoemDisplay from '@/components/PoemDisplay';

interface Poem {
    _id: string;
    title: string;
    content: string;
    date: string;
    category: string;
    likes: number;
}

export default function Home() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/poems')
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

  if (loading) return <div className="text-center py-10">Loading poems...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <main>
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">Alas, Poems</h1>
        <p className="text-xl text-gray-600 italic">A collection of thoughts and verses</p>
      </header>

      <div className="grid gap-6">
        {poems.map(poem => (
          <PoemDisplay key={poem._id} poem={poem} />
        ))}
        {poems.length === 0 && <p className="text-center text-gray-500">No poems found.</p>}
      </div>
    </main>
  );
}
