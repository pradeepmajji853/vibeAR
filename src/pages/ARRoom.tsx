import React, { useState, useRef } from 'react';
import GeminiPanel from '../components/GeminiPanel';
import SearchBar from '../components/SearchBar';
import ModelViewer from '../components/ModelViewer';
import { Camera, Sparkles, RotateCcw, Grid3X3, Settings2, Layers, Share } from 'lucide-react';

const ARRoom = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [placedItems, setPlacedItems] = useState<Array<{id: string, name: string, position: {x: number, y: number}}>>([]);
  const [selectedTool, setSelectedTool] = useState<'place' | 'move' | 'rotate'>('place');
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraActive(true); // For demo purposes, show UI even if camera fails
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // In a real app, this would search furniture and allow placement
  };

  const tools = [
    { id: 'place', icon: Layers, label: 'Place' },
    { id: 'move', icon: Grid3X3, label: 'Move' },
    { id: 'rotate', icon: RotateCcw, label: 'Rotate' },
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Camera View */}
      <div className="absolute inset-0">
        {isCameraActive ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* AR Overlay Grid */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/20" />
              {/* Grid overlay for AR positioning */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px'
                }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-violet-900 flex items-center justify-center">
            <div className="text-center text-white">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">AR Room View</h2>
              <p className="text-violet-200 mb-6">Start your camera to place furniture in AR</p>
              <button
                onClick={startCamera}
                className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Camera
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Top UI */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white font-semibold text-lg">AR Room Designer</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAIOpen(true)}
              className="w-10 h-10 bg-violet-600/80 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-violet-600 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <Share className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <Settings2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Search furniture to place in AR..."
          showFilter={false}
        />
      </div>

      {/* Side Tools */}
      {isCameraActive && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-2 space-y-2">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id as any)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    selectedTool === tool.id
                      ? 'bg-violet-600 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      {isCameraActive && (
        <div className="absolute bottom-24 left-0 right-0 z-30 p-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={stopCamera}
              className="bg-red-500/80 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium hover:bg-red-500 transition-colors"
            >
              Stop Camera
            </button>
            <button
              onClick={() => setIsAIOpen(true)}
              className="bg-violet-600/80 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium hover:bg-violet-600 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Ask AI
            </button>
          </div>
        </div>
      )}

      {/* AR Object Simulation */}
      {isCameraActive && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-20">
          <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center">
            <span className="text-white text-xs text-center">
              Tap to place<br />furniture here
            </span>
          </div>
        </div>
      )}

      {/* Placed Items Counter */}
      {placedItems.length > 0 && (
        <div className="absolute top-20 right-4 z-30">
          <div className="bg-violet-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {placedItems.length} item{placedItems.length !== 1 ? 's' : ''} placed
          </div>
        </div>
      )}

      {/* AI Panel */}
      <GeminiPanel isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};

export default ARRoom;