import React, { useState } from 'react';
import { Download, X, Search, CheckCircle, Star, Lock } from 'lucide-react';

const GameLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [games, setGames] = useState([
    {
      id: 1,
      title: "Cyber Nexus 2077",
      image: "/api/placeholder/280/160",
      size: "62.3 GB",
      category: "action",
      downloadProgress: null,
      downloadSpeed: null,
      isDownloaded: false,
      isPremium: true,
      isLocked: false
    },
    {
      id: 2,
      title: "Star Voyager: Ultimate Edition",
      image: "/api/placeholder/280/160",
      size: "48.1 GB",
      category: "rpg",
      downloadProgress: null,
      downloadSpeed: null,
      isDownloaded: false,
      isPremium: true,
      isLocked: true
    },
    {
      id: 3,
      title: "Racing Masters 2024",
      image: "/api/placeholder/280/160",
      size: "35.7 GB",
      category: "racing",
      downloadProgress: null,
      downloadSpeed: null,
      isDownloaded: false,
      isPremium: false,
      isLocked: false
    },
    {
      id: 4,
      title: "Medieval Legends",
      image: "/api/placeholder/280/160",
      size: "28.9 GB",
      category: "strategy",
      downloadProgress: null,
      downloadSpeed: null,
      isDownloaded: false,
      isPremium: false,
      isLocked: true
    }
  ]);

  // Filter games based on search and category
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const startDownload = (gameId) => {
    setGames(prevGames => prevGames.map(game => {
      if (game.id === gameId && !game.isLocked) {
        return {
          ...game,
          downloadProgress: 0,
          downloadSpeed: (Math.random() * 10 + 5).toFixed(1)
        };
      }
      return game;
    }));

    const interval = setInterval(() => {
      setGames(prevGames => {
        const updatedGames = prevGames.map(game => {
          if (game.id === gameId && game.downloadProgress !== null) {
            const newProgress = game.downloadProgress + 1;
            if (newProgress >= 100) {
              clearInterval(interval);
              return {
                ...game,
                downloadProgress: null,
                downloadSpeed: null,
                isDownloaded: true
              };
            }
            return {
              ...game,
              downloadProgress: newProgress,
              downloadSpeed: (Math.random() * 10 + 5).toFixed(1)
            };
          }
          return game;
        });
        return updatedGames;
      });
    }, 100);
  };

  const cancelDownload = (gameId) => {
    setGames(prevGames => prevGames.map(game => {
      if (game.id === gameId) {
        return {
          ...game,
          downloadProgress: null,
          downloadSpeed: null
        };
      }
      return game;
    }));
  };

  const gradientClasses = "bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500";
  const premiumGradientClasses = "bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-600 hover:to-amber-500";
  const lockedClasses = "bg-gradient-to-r from-gray-600 to-gray-500 cursor-not-allowed opacity-75";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Game Library
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search games..."
              className="bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-8">
          {['all', 'action', 'rpg', 'strategy', 'racing'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg capitalize transition-all duration-200 ${
                selectedCategory === category
                  ? gradientClasses
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map(game => (
            <div key={game.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-200">
              <img
                src={game.image}
                alt={game.title}
                className="w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                  <span>{game.size}</span>
                  {game.downloadProgress !== null && (
                    <span>{game.downloadSpeed} MB/s</span>
                  )}
                </div>

                {/* Download Progress Bar */}
                {game.downloadProgress !== null && (
                  <div className="mb-4">
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all duration-200"
                        style={{ width: `${game.downloadProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm text-gray-400">
                      <span>{game.downloadProgress}%</span>
                      <span>
                        {((parseInt(game.size) * (100 - game.downloadProgress)) / 100).toFixed(1)} GB remaining
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {game.isDownloaded ? (
                    <button className="flex-1 bg-gradient-to-r from-green-600 to-green-400 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                      <CheckCircle size={18} />
                      Downloaded
                    </button>
                  ) : game.downloadProgress !== null ? (
                    <button
                      onClick={() => cancelDownload(game.id)}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => !game.isLocked && startDownload(game.id)}
                        className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                          game.isLocked ? lockedClasses : gradientClasses
                        }`}
                        disabled={game.isLocked}
                      >
                        {game.isLocked ? <Lock size={18} /> : <Download size={18} />}
                        {game.isLocked ? 'Locked' : 'Download'}
                      </button>
                      {game.isPremium && (
                        <button 
                          className={`${premiumGradientClasses} p-2 rounded-lg flex items-center justify-center transition-all duration-200`}
                          title="Premium Game"
                        >
                          <Star className="w-5 h-5" fill="white" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            No games found matching your search criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default GameLibrary;
