import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  Filter, 
  Sparkles, 
  Video, 
  Share2, 
  Home,
  Scan,
  X,
  ChevronDown,
  Camera,
  ExternalLink,
  Eye
} from 'lucide-react';
import { analyzeRoomWithImage, generateNLPFurnitureSearch } from '../utils/gemini';
import { searchFurnitureEnhanced } from '../utils/sketchfab';
import Local3DViewer from '../components/Local3DViewer';

interface FurnitureItem {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  viewerUrl: string;
  embedUrl: string;
  downloadUrl: string | null;
  author: string;
  likeCount: number;
  viewCount: number;
  tags: string[];
  category: string;
  isDownloadable?: boolean;
  license: string;
}

const VibeKitAR = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'permission' | 'camera' | 'scanned' | 'suggestions' | 'placement' | 'ar-view'>('permission');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [furnitureSuggestions, setFurnitureSuggestions] = useState<FurnitureItem[]>([]);
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureItem | null>(null);
  const [showFurnitureDropdown, setShowFurnitureDropdown] = useState(false);
  const [placedFurniture, setPlacedFurniture] = useState<FurnitureItem[]>([]);
  const [whyItLooksGood, setWhyItLooksGood] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [roomAnalysis, setRoomAnalysis] = useState<any>(null);
  const [arPlacement, setArPlacement] = useState<{x: number, y: number, furniture: FurnitureItem} | null>(null);
  const [loadingFurniture, setLoadingFurniture] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Request camera permission first (especially important for mobile)
  const requestCameraPermission = async () => {
    console.log('🎥 Requesting camera permission...');
    
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera not supported on this device or connection must be HTTPS');
        console.error('❌ MediaDevices not available');
        return;
      }

      // Check if we're on mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      console.log('📱 Mobile device detected:', isMobile);
      
      if (isMobile) {
        // For mobile, show a user-friendly permission request first
        const confirmPermission = window.confirm(
          "VibeKit needs camera access to scan your room and suggest furniture. Allow camera access?"
        );
        
        if (!confirmPermission) {
          setCameraError('Camera permission is required to use VibeKit AR features');
          console.log('❌ User declined camera permission');
          return;
        }
      }

      console.log('🔄 Attempting to get camera stream...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      console.log('✅ Camera stream obtained successfully');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setCameraError(null);
        setStep('camera');
        console.log('✅ Camera activated and step changed to camera');
      } else {
        console.error('❌ Video ref is null');
        setCameraError('Video element not available');
      }
    } catch (error) {
      console.error('❌ Error accessing camera:', error);
      if (error instanceof Error) {
        console.log('Error name:', error.name);
        console.log('Error message:', error.message);
        
        if (error.name === 'NotAllowedError') {
          setCameraError('Camera access denied. Please allow camera access and try again.');
        } else if (error.name === 'NotFoundError') {
          setCameraError('No camera found on this device.');
        } else if (error.name === 'NotSecureError' || error.message.includes('secure')) {
          setCameraError('Camera requires HTTPS connection. Please access via HTTPS.');
        } else {
          setCameraError(`Camera access failed: ${error.message}`);
        }
      } else {
        setCameraError('Camera access failed. Please try again.');
      }
      setIsCameraActive(false);
    }
  };

  // Initialize component
  useEffect(() => {
    console.log('🚀 VibeKit AR component mounted, step:', step);
    console.log('🌐 Current protocol:', window.location.protocol);
    console.log('🔒 Secure context:', window.isSecureContext);
    
    // Check environment and auto-start for desktop testing
    const isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isDesktop && isLocalhost && window.isSecureContext) {
      console.log('🖥️ Desktop + Localhost + HTTPS detected, auto-starting camera...');
      setTimeout(() => {
        requestCameraPermission();
      }, 500);
    } else {
      console.log('📱 Mobile or remote access detected, waiting for user permission');
    }
    
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        console.log('🛑 Camera stream stopped');
      }
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setScannedImage(imageData);
        return imageData;
      }
    }
    return null;
  };

  const handleScanRoom = async () => {
    setIsScanning(true);
    
    // Capture image
    const imageData = captureImage();
    if (imageData) {
      setStep('scanned');
      
      // Simulate scanning process
      setTimeout(() => {
        setIsScanning(false);
      }, 2000);
    }
  };

  // Enhanced AI query handling with better NLP understanding
  const handleAIQuery = async (query: string) => {
    if (!scannedImage) return;

    setIsAnalyzing(true);
    try {
      // First, analyze the room with AI
      const analysis = await analyzeRoomWithImage(scannedImage, query);
      setRoomAnalysis(analysis);
      
      // Then, use Gemini to understand the NLP query and generate furniture keywords
      const furnitureKeywords = await generateNLPFurnitureSearch(query, analysis);
      
      // Generate contextual AI response based on NLP understanding
      let response = '';
      const queryLower = query.toLowerCase();
      
      if (queryLower.includes('cozy') || queryLower.includes('comfortable')) {
        response = `I understand you want to make this space more cozy! Based on your ${analysis.theme} style room, I recommend:

• Soft seating like an upholstered armchair or loveseat
• Warm lighting with table lamps or floor lamps
• Textured elements like throw pillows or a soft rug
• Natural materials in ${analysis.colorPalette[0]} tones

The ${analysis.lighting} in your space would work beautifully with these cozy additions!`;
      } else if (queryLower.includes('modern') || queryLower.includes('sleek')) {
        response = `Perfect! I can see you're going for a modern aesthetic. For your ${analysis.dimensions.estimatedSize} space:

• Clean-lined furniture in neutral colors
• Minimalist pieces that don't clutter the space
• Contemporary materials like metal and glass
• Geometric shapes that complement your ${analysis.theme} style

These suggestions will enhance the modern vibe while working with your existing ${analysis.colorPalette.join(', ')} color scheme.`;
      } else if (queryLower.includes('empty') || queryLower.includes('add') || queryLower.includes('furniture')) {
        response = `I can see this ${analysis.dimensions.estimatedSize} space has great potential! Based on the ${analysis.theme} style and ${analysis.lighting}, here's what would work perfectly:

• A ${analysis.furnitureKeywords.includes('chair') ? 'stylish accent chair' : 'comfortable seating option'} in the ${analysis.dimensions.availableSpace[0]}
• A functional table that complements the ${analysis.colorPalette[0]} tones
• Decorative elements to enhance the ${analysis.style} aesthetic
• Storage solutions that match your existing style

The natural lighting here would beautifully showcase these additions!`;
      } else {
        response = `Based on your "${query}" request and analyzing your ${analysis.theme} ${analysis.style} space, I've found furniture pieces that would perfectly suit your needs and complement your room's existing ${analysis.colorPalette.join(', ')} palette.`;
      }
      
      setAiResponse(response);
      
      // Search for furniture with enhanced NLP-based criteria
      setLoadingFurniture(true);
      const furniture = await searchFurnitureEnhanced([
        ...furnitureKeywords,
        ...analysis.furnitureKeywords,
        analysis.theme.toLowerCase(),
        analysis.style.toLowerCase(),
        ...analysis.colorPalette.map(c => c.toLowerCase().replace(' ', ''))
      ]);
      setFurnitureSuggestions(furniture);
      setLoadingFurniture(false);
      setStep('suggestions');
      
    } catch (error) {
      console.error('AI analysis error:', error);
      setAiResponse('I had trouble analyzing your space. The lighting might be too dim or the image unclear. Try taking another photo with better lighting!');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Enhanced furniture placement with AI explanations
  const handlePlaceFurniture = async (furniture: FurnitureItem) => {
    setSelectedFurniture(furniture);
    setPlacedFurniture(prev => [...prev, furniture]);
    setStep('placement');
    
    // Generate AI-powered explanation
    if (roomAnalysis) {
      const styleMatch = roomAnalysis.theme.toLowerCase().includes(furniture.category.toLowerCase()) || 
                        furniture.tags.some((tag: string) => roomAnalysis.furnitureKeywords.includes(tag));
      
      const colorMatch = furniture.description.toLowerCase().includes('wood') && 
                        roomAnalysis.colorPalette.some((color: string) => color.toLowerCase().includes('brown'));
      
      let explanation = `This ${furniture.name} `;
      
      if (styleMatch && colorMatch) {
        explanation += `perfectly matches your ${roomAnalysis.theme} style and complements the ${roomAnalysis.colorPalette[0]} tones in your space. `;
      } else if (styleMatch) {
        explanation += `aligns beautifully with your ${roomAnalysis.theme} aesthetic. `;
      } else if (colorMatch) {
        explanation += `harmonizes well with your room's color palette. `;
      } else {
        explanation += `adds an interesting contrast to your space. `;
      }
      
      explanation += `Placed in the ${roomAnalysis.dimensions.availableSpace[0]}, it would enhance the room's functionality while maintaining good flow and visual balance.`;
      
      setWhyItLooksGood(explanation);
    } else {
      // Fallback explanations
      const explanations = [
        `This ${furniture.name} complements the natural lighting in your space and matches the color palette perfectly.`,
        `The style of this ${furniture.name} creates a nice focal point and improves the flow of your room.`,
        `This piece adds both functionality and aesthetic appeal, balancing the proportions of your space beautifully.`,
        `The ${furniture.name} enhances the room's ambiance while providing practical value for everyday use.`
      ];
      setWhyItLooksGood(explanations[Math.floor(Math.random() * explanations.length)]);
    }
    
    // Simulate AR placement position
    setArPlacement({
      x: Math.random() * 0.6 + 0.2, // 20-80% from left
      y: Math.random() * 0.4 + 0.4, // 40-80% from top
      furniture
    });
    
    console.log('Placed furniture:', furniture.name, 'Total pieces:', placedFurniture.length + 1);
  };

  // Enhanced AR placement with Google Model Viewer
  const handleARPlacement = (furniture: FurnitureItem) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (furniture.downloadUrl) {
      if (isIOS || isAndroid) {
        // Open AR view with model-viewer
        setStep('ar-view');
      } else {
        // Desktop fallback with instructions
        alert(`To view ${furniture.name} in AR:\n\n1. Open this page on your mobile device\n2. Tap "Place in AR" again\n3. Point your camera at a flat surface\n4. Tap to place the furniture\n\nFor now, you can preview the 3D model below.`);
      }
    } else {
      alert('This furniture model is not available for AR viewing. Please try another piece.');
    }
  };

  // Function to redirect to furniture website
  const handleViewMore = () => {
    // You can customize this URL to redirect to your furniture catalog website
    const furnitureWebsiteUrl = 'https://www.wayfair.com/furniture/'; // Example furniture website
    window.open(furnitureWebsiteUrl, '_blank');
  };

  // Add microphone functionality for voice input
  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.onstart = () => {
        console.log('Voice recognition started');
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        handleAIQuery(transcript);
      };
      
      recognition.start();
    } else {
      alert('Voice recognition not supported on this device. Please type your query.');
    }
  };

  // Add share functionality
  const handleShare = async () => {
    if (selectedFurniture && scannedImage) {
      const shareData = {
        title: `Check out this ${selectedFurniture.name} in AR!`,
        text: `I found the perfect ${selectedFurniture.name} for my space using VibeKit AR. ${whyItLooksGood}`,
        url: window.location.href
      };
      
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (error) {
          console.log('Share cancelled');
        }
      } else {
        // Fallback for browsers without Web Share API
        navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert('Link copied to clipboard!');
      }
    } else {
      alert('Please scan a room and select furniture first!');
    }
  };

  // Add furniture placement animation effect
  useEffect(() => {
    if (arPlacement) {
      // Animate the placement indicator
      const timer = setTimeout(() => {
        console.log('Furniture placed successfully in AR simulation');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [arPlacement]);

  // Add keyboard shortcuts for better UX
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && step === 'scanned' && searchQuery) {
        handleAIQuery(searchQuery);
      }
      if (event.key === 'Escape') {
        if (showFurnitureDropdown) setShowFurnitureDropdown(false);
        if (selectedFurniture && step === 'placement') setStep('suggestions');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [step, searchQuery, showFurnitureDropdown, selectedFurniture]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Camera Permission Screen */}
      {step === 'permission' && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
          <div className="text-center text-white p-8 max-w-md mx-auto">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Welcome to VibeKit AR</h1>
            <p className="text-white/90 mb-2">Transform your space with AI-powered furniture suggestions</p>
            <p className="text-white/80 text-sm mb-8">We need camera access to scan your room and provide personalized recommendations</p>
            
            {/* Debug info */}
            <div className="mb-4 text-xs text-white/60 bg-black/20 rounded-lg p-3">
              <p>🌐 Protocol: {window.location.protocol}</p>
              <p>📱 Device: {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'}</p>
              <p>🔒 Secure: {window.isSecureContext ? '✅ Yes' : '❌ No'}</p>
              <p>📹 MediaDevices: {navigator.mediaDevices ? '✅ Available' : '❌ Not Available'}</p>
              <p>🎥 getUserMedia: {(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') ? '✅ Available' : '❌ Not Available'}</p>
              <p>🏠 Network IP: 192.168.194.46:5173</p>
            </div>
            
            <button
              onClick={requestCameraPermission}
              className="w-full bg-white text-blue-600 py-4 rounded-2xl font-semibold text-lg mb-4 hover:bg-blue-50 transition-colors"
            >
              Allow Camera Access
            </button>
            
            {cameraError && (
              <div className="bg-red-500/20 border border-red-400 rounded-xl p-4 mb-4">
                <p className="text-red-200 text-sm">{cameraError}</p>
                <button
                  onClick={requestCameraPermission}
                  className="mt-2 text-red-200 underline text-sm"
                >
                  Try Again
                </button>
              </div>
            )}
            
            <button
              onClick={() => navigate('/')}
              className="text-white/70 text-sm underline"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      {/* AR Viewer Screen */}
      {step === 'ar-view' && selectedFurniture && (
        <div className="absolute inset-0 bg-black">
          <div className="h-full flex flex-col">
            {/* AR Header */}
            <div className="p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep('placement')}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <h2 className="text-white font-semibold">{selectedFurniture.name}</h2>
                <button
                  onClick={handleViewMore}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View More
                </button>
              </div>
            </div>

            {/* Model Viewer for AR */}
            <div className="flex-1">
              <model-viewer
                src={selectedFurniture.downloadUrl?.startsWith('http') ? selectedFurniture.downloadUrl : `${window.location.origin}${selectedFurniture.downloadUrl}`}
                ios-src={selectedFurniture.downloadUrl?.startsWith('http') ? selectedFurniture.downloadUrl : `${window.location.origin}${selectedFurniture.downloadUrl}`}
                alt={selectedFurniture.name}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                touch-action="pan-y"
                auto-rotate
                ar-scale="auto"
                loading="lazy"
                style={{ width: '100%', height: '100%' }}
              >
                <div slot="ar-button" className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
                  📱 View in AR
                </div>
              </model-viewer>
            </div>

            {/* AR Controls */}
            <div className="p-4 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0">
              <div className="text-center text-white mb-4">
                <p className="text-sm opacity-80">Point your camera at a flat surface</p>
                <p className="text-xs opacity-60">Tap "View in AR" to place furniture</p>
              </div>
              
              {/* Fallback AR Buttons */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => {
                    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                    const isAndroid = /Android/.test(navigator.userAgent);
                    const modelUrl = selectedFurniture.downloadUrl?.startsWith('http') ? 
                      selectedFurniture.downloadUrl : 
                      `${window.location.origin}${selectedFurniture.downloadUrl}`;
                    
                    if (isAndroid) {
                      const arUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(modelUrl)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`;
                      window.location.href = arUrl;
                    } else if (isIOS) {
                      const link = document.createElement('a');
                      link.href = modelUrl;
                      link.rel = 'ar';
                      link.download = selectedFurniture.name + '.glb';
                      link.click();
                    } else {
                      alert('AR requires a mobile device (Android or iOS)');
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-3 rounded-lg text-sm font-medium"
                >
                  🚀 Direct AR
                </button>
                <button
                  onClick={() => {
                    // Open debug page for troubleshooting
                    window.open('/ar-issue-detector.html', '_blank');
                  }}
                  className="bg-gray-600 text-white py-2 px-3 rounded-lg text-sm"
                >
                  🔧 Debug
                </button>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('placement')}
                  className="flex-1 bg-white/20 text-white py-3 rounded-xl"
                >
                  Back
                </button>
                <button
                  onClick={handleViewMore}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View More Furniture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Camera/Image Background */}
      <div className="absolute inset-0">
        {step === 'camera' && isCameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : step !== 'camera' && step !== 'permission' && step !== 'ar-view' && scannedImage ? (
          <img 
            src={scannedImage} 
            alt="Scanned room" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            {cameraError ? (
              <div className="text-center text-white p-6">
                <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">{cameraError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="text-center text-white">
                <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Starting camera...</p>
              </div>
            )}
          </div>
        )}
        
        {/* Blue gradient overlay matching the image */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/70 via-blue-500/40 to-transparent"></div>
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* UI Overlay */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-6 pt-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <h1 className="text-white text-lg font-semibold">vibeKit</h1>
            </div>
            {step === 'camera' && (
              <button
                onClick={() => requestCameraPermission()}
                className="text-white/80 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full"
              >
                Refresh Camera
              </button>
            )}
          </div>

          {/* Search Bar - only show in camera mode */}
          {step === 'camera' && (
            <>
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Set your vibe"
                    className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/70 px-4 py-4 rounded-2xl border-none outline-none"
                  />
                  <button 
                    onClick={handleVoiceInput}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <Mic className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="mb-8 flex items-center gap-2 text-white/80"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => handleAIQuery(searchQuery || "this space is empty i want to add something suggest me")}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-2xl"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>AI Suggest</span>
                </button>
                <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Video className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={handleShare}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </>
          )}

          {/* AI Response */}
          {step === 'suggestions' && aiResponse && (
            <div className="mb-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">AI Analysis</h4>
                  <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">{aiResponse}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="mb-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white text-sm">Analyzing your space with AI...</p>
              </div>
            </div>
          )}
        </div>

        {/* Furniture Suggestions */}
        {step === 'suggestions' && (
          <div className="flex-1 px-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Suggested Furniture</h3>
              {loadingFurniture && (
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs">Finding matches...</span>
                </div>
              )}
            </div>
            
            {loadingFurniture ? (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 animate-pulse">
                    <div className="aspect-square bg-gray-600 rounded-xl mb-3"></div>
                    <div className="h-4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-600/50 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : furnitureSuggestions.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {furnitureSuggestions.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handlePlaceFurniture(item)}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-left hover:bg-white/30 transition-all transform hover:scale-105"
                  >
                    <div className="aspect-square bg-gray-700 rounded-xl mb-3 overflow-hidden relative">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <h4 className="text-white font-medium text-sm mb-1 truncate">{item.name}</h4>
                    <p className="text-white/70 text-xs mb-1">{item.author}</p>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-xs">AI Match</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-white/50" />
                </div>
                <p className="text-white/70 text-sm">No furniture suggestions yet. Try asking AI about your space!</p>
              </div>
            )}
            
            {furnitureSuggestions.length > 4 && !loadingFurniture && (
              <button
                onClick={() => setShowFurnitureDropdown(true)}
                className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
              >
                <span>View {furnitureSuggestions.length - 4} More Options</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* AR Placement View */}
        {step === 'placement' && selectedFurniture && (
          <div className="flex-1 px-6">
            {/* Furniture Info Card */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">{selectedFurniture.name}</h3>
                  <p className="text-white/60 text-xs">{selectedFurniture.author}</p>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-3 mb-4">
                <h4 className="text-white/90 font-medium text-sm mb-2">Why this looks perfect:</h4>
                <p className="text-white/80 text-sm leading-relaxed">{whyItLooksGood}</p>
              </div>
              
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => handleARPlacement(selectedFurniture)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-colors"
                >
                  <Scan className="w-4 h-4" />
                  Place in AR
                </button>
                <button
                  onClick={() => setStep('suggestions')}
                  className="px-4 py-3 bg-white/20 text-white rounded-xl text-sm hover:bg-white/30 transition-colors"
                >
                  Back
                </button>
              </div>
              
              {/* View More Button */}
              <button
                onClick={handleViewMore}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View More Furniture
              </button>
            </div>

            {/* AR Simulation Overlay */}
            {arPlacement && (
              <div className="relative mb-4">
                <div className="aspect-video bg-white/10 rounded-2xl overflow-hidden relative">
                  {scannedImage && (
                    <img 
                      src={scannedImage} 
                      alt="Room" 
                      className="w-full h-full object-cover opacity-60"
                    />
                  )}
                  {/* Simulated furniture placement */}
                  <div 
                    className="absolute w-16 h-16 bg-green-400/30 border-2 border-green-400 rounded-lg flex items-center justify-center animate-pulse"
                    style={{
                      left: `${arPlacement.x * 100}%`,
                      top: `${arPlacement.y * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <Home className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-white text-sm font-medium">AR Preview</p>
                      <p className="text-white/70 text-xs">This shows where your furniture would be placed</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3D Preview */}
            {selectedFurniture.downloadUrl && (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">3D Preview</h4>
                  <span className="text-white/60 text-xs">Rotate • Zoom • Explore</span>
                </div>
                <div className="h-64 rounded-xl overflow-hidden">
                  <Local3DViewer
                    modelUrl={selectedFurniture.downloadUrl}
                    alt={selectedFurniture.name}
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Section */}
        <div className="p-6">
          {step === 'camera' && (
            <button
              onClick={handleScanRoom}
              disabled={isScanning || !isCameraActive}
              className={`w-full py-4 rounded-3xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
                isScanning
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Scan className={`w-6 h-6 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning Room...' : 'Scan Room'}</span>
            </button>
          )}

          {step === 'scanned' && !isScanning && (
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
                <h3 className="text-white text-lg font-semibold mb-2">Room Scanned Successfully! 📸</h3>
                <p className="text-white/80 text-sm">
                  Your space has been captured. Now ask AI anything about your room!
                </p>
              </div>
              
              {/* Quick suggestion buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  "This space is empty, suggest furniture",
                  "What colors would work here?", 
                  "Make this room more cozy",
                  "Add modern furniture here"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      handleAIQuery(suggestion);
                    }}
                    className="bg-white/20 backdrop-blur-sm text-white text-xs p-3 rounded-xl hover:bg-white/30 transition-colors text-left"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
              
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAIQuery(searchQuery)}
                  placeholder="Ask AI about your space..."
                  className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/60 px-4 py-3 pr-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleAIQuery(searchQuery)}
                  disabled={isAnalyzing}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Sparkles className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
              
              <button
                onClick={() => handleAIQuery(searchQuery || "this space is empty i want to add something suggest me")}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-2xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Ask AI
                  </>
                )}
              </button>
            </div>
          )}

          {(step === 'suggestions' || step === 'placement') && (
            <div className="flex gap-3">
              <button
                onClick={() => setStep('scanned')}
                className="flex-1 bg-white/20 backdrop-blur-sm text-white py-3 rounded-2xl"
              >
                Ask Again
              </button>
              <button
                onClick={() => setStep('camera')}
                className="flex-1 bg-blue-500 text-white py-3 rounded-2xl"
              >
                New Scan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scanning Overlay */}
      {isScanning && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/20">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-white text-xl font-bold mb-2">Analyzing Room</h3>
            <p className="text-white/70">Detecting surfaces, lighting, and space...</p>
          </div>
        </div>
      )}

      {/* More Furniture Dropdown */}
      {showFurnitureDropdown && (
        <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm">
          <div className="h-full flex flex-col">
            <div className="p-6 flex items-center justify-between">
              <h2 className="text-white text-lg font-semibold">More Furniture</h2>
              <button
                onClick={() => setShowFurnitureDropdown(false)}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            
            <div className="flex-1 px-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {furnitureSuggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      handlePlaceFurniture(item);
                      setShowFurnitureDropdown(false);
                    }}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-left hover:bg-white/30 transition-colors"
                  >
                    <div className="aspect-square bg-gray-700 rounded-xl mb-3 overflow-hidden">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <h4 className="text-white font-medium text-sm mb-1">{item.name}</h4>
                    <p className="text-white/70 text-xs mb-2">{item.author}</p>
                    <p className="text-white/60 text-xs">{item.description.slice(0, 60)}...</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VibeKitAR;
