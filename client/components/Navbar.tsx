'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Feather, LogOut, LogIn } from 'lucide-react';
import iconCat from '../public/assets/WBonTop.jpg';

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, [pathname]);

  const navLinkClass = (path: string) => `
    flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
    ${pathname === path 
      ? 'bg-dusty-rose text-white shadow-pink-soft font-bold' 
      : 'text-chocolate-text hover:bg-white hover:text-dusty-rose hover:shadow-sm'}
  `;

  return (
    <nav className="mb-8 glass-panel rounded-3xl p-3 flex items-center shadow-pink-glow sticky top-4 z-40">
      <div className="flex-1 flex gap-2">
        <Link href="/" className={navLinkClass('/')}>
          <Home size={18} />
          <span>Home</span>
        </Link>
        <Link href="/about" className={navLinkClass('/about')}>
          <Sparkles size={18} />
          <span>About</span>
        </Link>
      </div>
      
      {/* Center Logo/Icon for extra cuteness */}
      <div className="flex-shrink-0 hidden sm:flex text-dusty-rose">
        <Image src={iconCat} alt="Cat Icon" width={48} height={48} />
      </div>

      <div className="flex-1 flex gap-2 justify-end">
        {isAdmin ? (
          <>
            <Link href="/admin" className={navLinkClass('/admin')}>
              <Feather size={18} />
              <span>Publish</span>
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('isAdmin');
                window.location.reload();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-chocolate-text hover:bg-red-50 hover:text-red-400 transition-all duration-300"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link href="/login" className={navLinkClass('/login')}>
            <LogIn size={18} />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
