import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Loader2, Brain, ArrowRight, Palette, Ruler, Lightbulb, Home, Search, ExternalLink, Download } from 'lucide-react';
import { analyzeRoomWithImage, RoomAnalysis } from '../utils/gemini';
import { searchFurnitureEnhanced } from '../utils/sketchfab';

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

const AIAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<RoomAnalysis | null>(null);
  const [furnitureSuggestions, setFurnitureSuggestions] = useState<FurnitureItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFurniture, setLoadingFurniture] = useState(false);
  const [imageDescription, setImageDescription] = useState('');
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Auto-hide notification after 3 seconds
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysis(null);
        setFurnitureSuggestions([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      alert('Please upload an image first');
      return;
    }

    setLoading(true);
    try {
      const roomAnalysis = await analyzeRoomWithImage(selectedImage, imageDescription);
      setAnalysis(roomAnalysis);
      
      // Fetch furniture suggestions based on analysis
      setLoadingFurniture(true);
      
      // Create more targeted search based on room analysis
      const spaceKeywords = roomAnalysis.dimensions.availableSpace.join(' ').toLowerCase();
      const styleKeywords = `${roomAnalysis.theme} ${roomAnalysis.style}`.toLowerCase();
      const baseKeywords = roomAnalysis.furnitureKeywords;
      
      // Determine primary furniture needs based on available space
      let priorityFurniture = [];
      if (spaceKeywords.includes('corner')) priorityFurniture.push('corner', 'chair');
      if (spaceKeywords.includes('center') || spaceKeywords.includes('middle')) priorityFurniture.push('table', 'coffee table');
      if (spaceKeywords.includes('wall')) priorityFurniture.push('shelf', 'cabinet');
      if (spaceKeywords.includes('window')) priorityFurniture.push('plant', 'stand');
      if (spaceKeywords.includes('seating') || spaceKeywords.includes('living')) priorityFurniture.push('sofa', 'chair');
      
      const allKeywords = [...baseKeywords, ...priorityFurniture, ...styleKeywords.split(' ')].filter(k => k.length > 0);
      console.log('Searching for furniture with keywords:', allKeywords);
      
      // Use enhanced search that tries multiple strategies
      const furnitureResults = await searchFurnitureEnhanced(allKeywords);
      setFurnitureSuggestions(furnitureResults);
      
      // Show notification if using fallback furniture
      if (furnitureResults.some(item => item.id.startsWith('local-'))) {
        setNotification('Using local furniture collection - Sketchfab API may be limited');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Sorry, I\'m having trouble analyzing the image right now. Please try again later.');
    } finally {
      setLoading(false);
      setLoadingFurniture(false);
    }
  };

  const ColorPalette = ({ colors }: { colors: string[] }) => {
    // Function to convert color names to hex values
    const getColorValue = (colorName: string): string => {
      const colorMap: { [key: string]: string } = {
        // Whites and Grays
        'white': '#FFFFFF',
        'warm white': '#FDF6E3',
        'off white': '#FAF0E6',
        'cream': '#F5F5DC',
        'beige': '#F5F5DC',
        'gray': '#808080',
        'grey': '#808080',
        'light gray': '#D3D3D3',
        'dark gray': '#A9A9A9',
        'charcoal': '#36454F',
        'black': '#000000',
        
        // Browns and Wood tones
        'brown': '#8B4513',
        'oak brown': '#8B7355',
        'walnut': '#5D4037',
        'mahogany': '#C04000',
        'wooden': '#8B4513',
        'natural wood': '#DEB887',
        'dark wood': '#654321',
        
        // Blues
        'blue': '#0000FF',
        'navy': '#000080',
        'navy blue': '#000080',
        'light blue': '#ADD8E6',
        'sky blue': '#87CEEB',
        'teal': '#008080',
        
        // Greens
        'green': '#008000',
        'sage': '#9CAF88',
        'olive': '#808000',
        'forest green': '#228B22',
        
        // Warm colors
        'red': '#FF0000',
        'burgundy': '#800020',
        'orange': '#FFA500',
        'yellow': '#FFFF00',
        'gold': '#FFD700',
        
        // Others
        'pink': '#FFC0CB',
        'purple': '#800080',
        'lavender': '#E6E6FA',
        'silver': '#C0C0C0',
        'bronze': '#CD7F32'
      };
      
      const normalizedName = colorName.toLowerCase().trim();
      return colorMap[normalizedName] || '#808080'; // Default to gray if color not found
    };

    return (
      <div className="flex gap-2 flex-wrap">
        {colors.map((color, index) => (
          <div key={index} className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2 min-w-fit">
            <div 
              className="w-5 h-5 rounded-full border-2 border-gray-500 flex-shrink-0"
              style={{ backgroundColor: getColorValue(color) }}
            />
            <span className="text-sm text-gray-300 whitespace-nowrap">{color}</span>
          </div>
        ))}
      </div>
    );
  };

  const AnalysisCard = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-4">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚠️</span>
            <span className="text-sm">{notification}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Room Analysis</h1>
            <p className="text-gray-400 text-sm">Upload a photo to get detailed room insights and furniture suggestions</p>
          </div>
        </div>
      </div>

      {/* Debug/Test Button */}
      {!selectedImage && (
        <div className="mb-6 space-y-3">
          <button
            onClick={() => {
              // Set a sample analysis for testing
              const sampleAnalysis: RoomAnalysis = {
                colorPalette: ["Warm White", "Navy Blue", "Oak Brown", "Sage Green", "Gold"],
                theme: "Modern Scandinavian",
                style: "Contemporary Minimalist",
                dimensions: {
                  estimatedSize: "Medium living room (15x12 ft)",
                  availableSpace: [
                    "Corner near large window",
                    "Wall opposite to sofa",
                    "Center area for coffee table",
                    "Empty wall for shelving"
                  ]
                },
                lighting: "Natural light from large south-facing windows with warm ambient lighting",
                suggestions: [
                  "Add a corner reading chair near the window to create a cozy reading nook",
                  "Install floating shelves on the empty wall for books and decorative items",
                  "Place a round coffee table in the center to improve flow and conversation",
                  "Consider adding plants to bring life and complement the natural lighting"
                ],
                furnitureKeywords: ["scandinavian", "modern", "chair", "table", "shelf", "minimalist", "wood"]
              };
              setAnalysis(sampleAnalysis);
              
              // Also test furniture search
              setLoadingFurniture(true);
              searchFurnitureEnhanced(["scandinavian", "modern", "chair", "table"]).then((results) => {
                console.log('Enhanced furniture search results:', results);
                setFurnitureSuggestions(results);
                setLoadingFurniture(false);
              }).catch((error) => {
                console.error('Enhanced furniture search error:', error);
                setLoadingFurniture(false);
              });
            }}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <Brain className="w-4 h-4" />
            Try Sample Analysis + Furniture Search
          </button>
          
          <button
            onClick={async () => {
              setLoadingFurniture(true);
              try {
                console.log('Testing enhanced furniture search...');
                const results = await searchFurnitureEnhanced(["chair", "modern", "furniture"]);
                console.log('Enhanced search results:', results);
                setFurnitureSuggestions(results);
              } catch (error) {
                console.error('Enhanced search error:', error);
              }
              setLoadingFurniture(false);
            }}
            className="w-full bg-gray-700 text-white py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Test Furniture Search Only
          </button>
        </div>
      )}

      {/* Upload Section */}
      <div className="mb-6">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          {selectedImage ? (
            <div className="relative">
              <img
                src={selectedImage}
                alt="Room to analyze"
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setAnalysis(null);
                  setFurnitureSuggestions([]);
                }}
                className="absolute top-4 right-4 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-white font-medium mb-2">Upload Room Photo</h3>
              <p className="text-gray-400 text-sm mb-6">Take a photo or upload from gallery for AI analysis</p>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  Camera
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Gallery
                </button>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Optional Description */}
      {selectedImage && (
        <div className="mb-6">
          <label className="block text-white font-medium mb-3">
            Additional Details (Optional)
          </label>
          <textarea
            value={imageDescription}
            onChange={(e) => setImageDescription(e.target.value)}
            placeholder="Add any specific details about the room that might not be visible in the image..."
            className="w-full h-20 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
          />
        </div>
      )}

      {/* Analyze Button */}
      {selectedImage && (
        <div className="mb-6">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing Room...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Analyze Room
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6 mb-8">
          {/* Room Overview */}
          <div className="bg-gradient-to-r from-violet-900/20 to-purple-900/20 rounded-2xl border border-violet-900/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Home className="w-6 h-6 text-violet-400" />
              <h2 className="text-xl font-bold text-white">Room Analysis</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-violet-300 mb-2">Theme & Style</h3>
                <p className="text-gray-300">{analysis.theme} - {analysis.style}</p>
              </div>
              <div>
                <h3 className="font-medium text-violet-300 mb-2">Estimated Size</h3>
                <p className="text-gray-300">{analysis.dimensions.estimatedSize}</p>
              </div>
            </div>
          </div>

          {/* Detailed Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnalysisCard icon={Palette} title="Color Palette">
              {analysis.colorPalette && analysis.colorPalette.length > 0 && 
               !analysis.colorPalette[0].includes('Unable to analyze') ? (
                <ColorPalette colors={analysis.colorPalette} />
              ) : (
                <div className="text-center py-4">
                  <Palette className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    Unable to detect colors from the image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Try uploading a clearer, well-lit image
                  </p>
                </div>
              )}
            </AnalysisCard>

            <AnalysisCard icon={Lightbulb} title="Lighting Analysis">
              <p className="text-gray-300">{analysis.lighting}</p>
            </AnalysisCard>

            <AnalysisCard icon={Ruler} title="Available Space">
              <div className="space-y-2">
                <div className="mb-3">
                  <span className="text-xs text-violet-300 font-medium">Room Size:</span>
                  <p className="text-sm text-gray-300 mt-1">{analysis.dimensions.estimatedSize}</p>
                </div>
                <div>
                  <span className="text-xs text-violet-300 font-medium">Available Areas:</span>
                  <div className="mt-2 space-y-2">
                    {analysis.dimensions.availableSpace.map((space, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-300">{space}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnalysisCard>

            <AnalysisCard icon={Brain} title="AI Suggestions">
              <div className="space-y-3">
                {analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
                    <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
            </AnalysisCard>
          </div>
        </div>
      )}

      {/* Furniture Suggestions */}
      {analysis && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-6 h-6 text-violet-400" />
            <h2 className="text-xl font-bold text-white">Furniture Suggestions</h2>
            {loadingFurniture && <Loader2 className="w-5 h-5 animate-spin text-violet-400" />}
          </div>

          {loadingFurniture ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-medium mb-2">Finding Perfect Furniture</h3>
              <p className="text-gray-400 text-sm">
                Searching Sketchfab for furniture that matches your room's style and available space...
              </p>
              <div className="flex items-center justify-center gap-1 mt-4">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : furnitureSuggestions.length > 0 ? (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-400">
                  Found {furnitureSuggestions.length} furniture suggestions based on your room analysis
                </p>
                {furnitureSuggestions.some(item => item.id.startsWith('local-')) && (
                  <p className="text-xs text-amber-400 mt-1">
                    ⚡ Showing local collection due to API limitations
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {furnitureSuggestions.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-violet-500 transition-colors cursor-pointer group"
                    onClick={() => setSelectedFurniture(item)}
                  >
                    <div className="aspect-square bg-gray-700 relative overflow-hidden">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-12 h-12 text-gray-500" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-white mb-1 truncate group-hover:text-violet-300 transition-colors">{item.name}</h3>
                      <p className="text-sm text-gray-400 mb-2 truncate">by {item.author}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            ❤️ {item.likeCount}
                          </span>
                          <span className="flex items-center gap-1">
                            👁️ {item.viewCount}
                          </span>
                        </div>
                        <div className="flex gap-1">                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.id.startsWith('local-')) {
                              // For local models, show in AR or download
                              if (item.downloadUrl) {
                                window.open(item.downloadUrl, '_blank');
                              }
                            } else {
                              window.open(item.viewerUrl, '_blank');
                            }
                          }}
                          className="p-1 bg-violet-600 rounded text-white hover:bg-violet-700 transition-colors"
                          title={item.id.startsWith('local-') ? "Download Model" : "View in 3D"}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                          {item.downloadUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(item.downloadUrl!, '_blank');
                              }}
                              className="p-1 bg-gray-600 rounded text-white hover:bg-gray-700 transition-colors"
                              title="Download Model"
                            >
                              <Download className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !loadingFurniture && analysis && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-white font-medium mb-2">No furniture found</h3>
              <p className="text-gray-400 text-sm mb-4">
                We couldn't find furniture matching your room style. This might be due to:
              </p>
              <ul className="text-gray-500 text-sm space-y-1 mb-6">
                <li>• Limited furniture models in this style</li>
                <li>• Very specific room requirements</li>
                <li>• Network connectivity issues</li>
              </ul>
              <button
                onClick={() => handleAnalyze()}
                className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Furniture Detail Modal */}
      {selectedFurniture && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">{selectedFurniture.name}</h2>
                <button
                  onClick={() => setSelectedFurniture(null)}
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="aspect-video bg-gray-700 rounded-xl mb-4 overflow-hidden">
                {selectedFurniture.id.startsWith('local-') ? (
                  // Local 3D model viewer
                  <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-br from-gray-700 to-gray-800">
                    <model-viewer
                      src={selectedFurniture.downloadUrl || ''}
                      alt={selectedFurniture.name}
                      auto-rotate
                      camera-controls
                      style={{ width: '100%', height: '100%' }}
                    />
                    <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                      3D Model
                    </div>
                  </div>
                ) : (
                  // Sketchfab iframe
                  <iframe
                    src={selectedFurniture.embedUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                  />
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-white mb-2">Description</h3>
                  <p className="text-gray-300 text-sm">{selectedFurniture.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-white mb-2">Author</h3>
                    <p className="text-gray-300 text-sm">{selectedFurniture.author}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-2">Category</h3>
                    <p className="text-gray-300 text-sm">{selectedFurniture.category}</p>
                  </div>
                </div>
                
                {selectedFurniture.tags.length > 0 && (
                  <div>
                    <h3 className="font-medium text-white mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFurniture.tags.slice(0, 6).map((tag, index) => (
                        <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 mt-6">
                  {selectedFurniture.id.startsWith('local-') ? (
                    <>
                      <button
                        onClick={() => {
                          if (selectedFurniture.downloadUrl) {
                            const link = document.createElement('a');
                            link.href = selectedFurniture.downloadUrl;
                            link.download = selectedFurniture.name + '.glb';
                            link.click();
                          }
                        }}
                        className="flex-1 bg-violet-600 text-white py-3 rounded-xl font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Model
                      </button>
                      <button
                        onClick={() => {
                          // Navigate to AR view with this model
                          alert('AR functionality coming soon!');
                        }}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        📱 AR View
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => window.open(selectedFurniture.viewerUrl, '_blank')}
                        className="flex-1 bg-violet-600 text-white py-3 rounded-xl font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Sketchfab
                      </button>
                      {selectedFurniture.downloadUrl && (
                        <button
                          onClick={() => window.open(selectedFurniture.downloadUrl!, '_blank')}
                          className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-4">How AI Analysis Works</h3>
        <div className="space-y-3">
          {[
            { step: 1, title: 'Image Processing', desc: 'AI analyzes your room photo for colors, lighting, and space' },
            { step: 2, title: 'Theme Detection', desc: 'Identifies design style and aesthetic preferences' },
            { step: 3, title: 'Space Analysis', desc: 'Measures dimensions and available areas' },
            { step: 4, title: 'Smart Suggestions', desc: 'Recommends furniture from Sketchfab based on analysis' }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {item.step}
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">{item.title}</h4>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;