import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import SupportModal from './support/SupportModal';

export default function Navbar() {
  const { data: session } = useSession();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Ickbal Watch Party
        </Link>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsSupportModalOpen(true)}
            className="text-white hover:text-blue-300 transition-colors"
          >
            Support
          </button>
          
          {session ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="text-white hover:text-blue-300 transition-colors">
                Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="text-white hover:text-blue-300 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="text-white hover:text-blue-300 transition-colors">
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <SupportModal 
        isOpen={isSupportModalOpen} 
        onClose={() => setIsSupportModalOpen(false)} 
      />
    </nav>
  );
}
