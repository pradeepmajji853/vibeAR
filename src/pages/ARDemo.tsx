import { 
  Mic, 
  Filter, 
  Sparkles, 
  Video, 
  Share2, 
  Home,
  Scan,
  Search,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const ARDemo = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize camera on component mount
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Use back camera
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
          setCameraError(null);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setCameraError('Camera access denied or not available');
        setIsCameraActive(false);
      }
    };

    initCamera();

    // Cleanup camera on unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const demoModels = [
    {
      id: 'chair-demo',
      name: 'Wooden Chair',
      modelUrl: '/old_wooden_chair.glb',
      description: 'Vintage wooden chair',
      category: 'Seating'
    },
    {
      id: 'sofa-demo',
      name: 'Modern Sofa',
      modelUrl: '/sofa.glb',
      description: 'Contemporary sofa',
      category: 'Seating'
    },
    {
      id: 'bed-demo',
      name: 'Wooden Bed',
      modelUrl: '/wooden_bed.glb',
      description: 'Solid wood bed frame',
      category: 'Bedroom'
    }
  ];

  const categories = ['All', 'Seating', 'Tables', 'Bedroom', 'Storage', 'Lighting'];

  const handleARView = (modelUrl: string, name: string) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const fullUrl = `${window.location.origin}${modelUrl}`;
    
    if (isIOS) {
      const link = document.createElement('a');
      link.href = fullUrl;
      link.rel = 'ar';
      link.download = name;
      link.click();
    } else if (isAndroid) {
      const arUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(fullUrl)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`;
      window.location.href = arUrl;
    } else {
      alert('AR viewing is available on mobile devices. Please visit this page on your smartphone or tablet.');
    }
  };

  const startRoomScan = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Real Camera Background */}
      {isCameraActive ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        /* Fallback simulated camera view or permission request */
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 opacity-80"></div>
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 mx-6">
                <Video className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">Camera Access Needed</h3>
                <p className="text-white/70 text-sm mb-4">{cameraError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition-all"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* AR Grid Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>

      {/* Top Overlay - vibeKit Header */}
      <div className="relative z-10 p-6">
        <div className="bg-gradient-to-r from-blue-600/90 via-blue-500/90 to-purple-600/90 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">vibeKit</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/')}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
              >
                <Home className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => navigate('/ai-analysis')}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
              >
                <span className="text-white font-semibold">▲</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Set your vibe"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/70 px-4 py-4 rounded-2xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-lg"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
            </div>
            <button className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all border border-white/30">
              <Mic className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30 hover:bg-white/30 transition-all"
            >
              <Filter className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Filters</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/30 hover:bg-white/30 transition-all flex items-center justify-center gap-3">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-white font-medium">AI Suggest</span>
            </button>
            <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all border border-white/30">
              <Video className="w-6 h-6 text-white" />
            </button>
            <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all border border-white/30">
              <Share2 className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm border border-white/30 hover:bg-white/30 transition-all"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Furniture Models Quick Access */}
      <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2 z-10">
        <div className="space-y-3">
          {demoModels.map((model) => (
            <div
              key={model.id}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">{model.name}</h3>
                  <p className="text-white/70 text-sm">{model.description}</p>
                </div>
                <button
                  onClick={() => handleARView(model.modelUrl, model.name)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all"
                >
                  Place
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Scan Button */}
      <div className="absolute bottom-8 left-6 right-6 z-10">
        <button
          onClick={startRoomScan}
          disabled={isScanning}
          className={`w-full py-6 rounded-3xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
            isScanning
              ? 'bg-orange-500 text-white'
              : 'bg-white text-blue-600 hover:bg-blue-50 shadow-2xl'
          }`}
        >
          <Scan className={`w-6 h-6 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning Room...' : 'Scan Room'}</span>
        </button>
      </div>

      {/* Scanning Overlay */}
      {isScanning && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/20">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-white text-xl font-bold mb-2">Analyzing Room</h3>
            <p className="text-white/70">Detecting surfaces and lighting...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARDemo;
