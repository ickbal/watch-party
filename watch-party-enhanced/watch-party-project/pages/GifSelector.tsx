"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

interface GifSelectorProps {
  onSelectGif: (gifUrl: string) => void;
  onClose: () => void;
}

const GifSelector: React.FC<GifSelectorProps> = ({ onSelectGif, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Tenor API key (this would normally be in an environment variable)
  const API_KEY = 'LIVDSRZULELA'; // This is a public test key for Tenor
  
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term) {
        // Show trending GIFs if no search term
        fetchTrendingGifs();
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://api.tenor.com/v1/search?q=${encodeURIComponent(term)}&key=${API_KEY}&limit=20`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch GIFs');
        }
        
        const data = await response.json();
        setGifs(data.results || []);
      } catch (err) {
        setError('Error loading GIFs. Please try again.');
        console.error('Error fetching GIFs:', err);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );
  
  const fetchTrendingGifs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.tenor.com/v1/trending?key=${API_KEY}&limit=20`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch trending GIFs');
      }
      
      const data = await response.json();
      setGifs(data.results || []);
    } catch (err) {
      setError('Error loading trending GIFs. Please try again.');
      console.error('Error fetching trending GIFs:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Load trending GIFs on initial render
  useEffect(() => {
    fetchTrendingGifs();
  }, []);
  
  // Search when term changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-700 flex items-center">
        <h3 className="text-white font-bold mr-2">GIF Selector</h3>
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search GIFs..."
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-white p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center p-4">{error}</div>
        ) : gifs.length === 0 ? (
          <div className="text-gray-400 text-center p-4">No GIFs found. Try another search term.</div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {gifs.map((gif) => (
              <div
                key={gif.id}
                onClick={() => onSelectGif(gif.media[0].gif.url)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img
                  src={gif.media[0].gif.preview}
                  alt={gif.title}
                  className="w-full h-auto rounded"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-2 text-xs text-gray-400 text-center border-t border-gray-700">
        Powered by Tenor
      </div>
    </div>
  );
};

export default GifSelector;
