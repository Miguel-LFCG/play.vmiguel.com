import React, { useState, useEffect } from 'react';
import { Download, Search, CheckCircle, Lock } from 'lucide-react';

const GameLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [games, setGames] = useState([]);
  const [startedDownloads, setStartedDownloads] = useState({});

  useEffect(() => {
    fetch('https://vmiguel.com/games/games.json')
      .then(response => response.json())
      .then(data => setGames(data))
      .catch(error => console.error('Error fetching games:', error));
  }, []);

  const handleDownloadClick = (gameId) => {
    setStartedDownloads((prev) => ({ ...prev, [gameId]: true }));
  };

  // Filter games based on search and category
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || game.category.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const gradientClasses = "bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500";
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
          {["all", "solo", "multiplayer"].map(category => (
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
                src={`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.steamid}/header.jpg`}
                alt={game.title}
                className="w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                  <span>{game.size}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <a
                    href={`https://vmiguel.com/games/${game.gamefile}`}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                      game.isLocked ? lockedClasses : gradientClasses
                    } ${startedDownloads[game.id] ? 'bg-green-600' : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (game.isLocked) {
                        e.preventDefault();
                      } else {
                        handleDownloadClick(game.id);
                      }
                    }}
                  >
                    {game.isLocked ? <Lock size={18} /> : startedDownloads[game.id] ? <CheckCircle size={18} /> : <Download size={18} />}
                    {game.isLocked ? 'Locked' : startedDownloads[game.id] ? 'Download Started' : 'Download'}
                  </a>
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