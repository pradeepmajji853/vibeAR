import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Local3DViewer from '../components/Local3DViewer';
import { Eye, Heart, ExternalLink, Download, User, ThumbsUp, Sparkles } from 'lucide-react';
import { fetchSketchfabModels, getARModelUrl } from '../utils/sketchfab';

interface FurnitureItem {
  id: string;
  name: string;
  category: string;
  author: string;
  thumbnail?: string;
  description?: string;
  likeCount: number;
  isDownloadable?: boolean;
  modelUrl?: string;
  embedUrl?: string | null;
}

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Featured models - Using external URLs for 3D models to avoid large file issues
  const featuredModels = [
    {
      id: 'modern-chair',
      name: 'Modern Chair',
      category: 'Seating',
      author: 'Sketchfab Collection',
      thumbnail: 'https://images.pexels.com/photos/963486/pexels-photo-963486.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Contemporary chair with sleek design',
      likeCount: 42,
      isDownloadable: false,
      modelUrl: undefined,
      embedUrl: null
    },
    {
      id: 'wooden-table',
      name: 'Wooden Table',
      category: 'Furniture',
      author: 'Sketchfab Collection',
      thumbnail: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Classic wooden table perfect for dining',
      likeCount: 38,
      isDownloadable: false,
      modelUrl: undefined,
      embedUrl: null
    },
    {
      id: 'modern-sofa',
      name: 'Modern Sofa',
      category: 'Seating',
      author: 'Sketchfab Collection',
      thumbnail: 'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Contemporary comfortable sofa for living room',
      likeCount: 56,
      isDownloadable: false,
      modelUrl: undefined,
      embedUrl: null
    },
    {
      id: 'bed-frame',
      name: 'Bed Frame',
      category: 'Bedroom',
      author: 'Sketchfab Collection',
      thumbnail: 'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Elegant bed frame with modern styling',
      likeCount: 45,
      isDownloadable: false,
      modelUrl: undefined,
      embedUrl: null
    },
    {
      id: 'coffee-table',
      name: 'Coffee Table',
      category: 'Furniture',
      author: 'Sketchfab Collection',
      thumbnail: 'https://images.pexels.com/photos/1571181/pexels-photo-1571181.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Stylish coffee table for living spaces',
      likeCount: 28,
      isDownloadable: false,
      modelUrl: undefined,
      embedUrl: null
    },
    {
      id: 'bookshelf',
      name: 'Modern Bookshelf',
      category: 'Storage',
      author: 'Sketchfab Collection',
      thumbnail: 'https://images.pexels.com/photos/159581/dictionary-reference-book-learning-meaning-159581.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Contemporary bookshelf for modern homes',
      likeCount: 33,
      isDownloadable: false,
      modelUrl: undefined,
      embedUrl: null
    }
  ];

  const categories = [
    { id: 'all', label: 'All', query: 'furniture' },
    { id: 'chair', label: 'Chairs', query: 'chair' },
    { id: 'table', label: 'Tables', query: 'table' },
    { id: 'sofa', label: 'Sofas', query: 'sofa' },
    { id: 'bed', label: 'Beds', query: 'bed' },
    { id: 'lamp', label: 'Lighting', query: 'lamp' },
    { id: 'shelf', label: 'Storage', query: 'shelf' }
  ];

  // Load initial furniture items
  useEffect(() => {
    // Don't load initial items - let users browse featured or search
    setHasSearched(false);
  }, []);

  const loadFurnitureItems = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSketchfabModels(query, 1, 12);
      setFurnitureItems(response.results);
    } catch (err) {
      setError('Failed to load furniture items. Please try again.');
      console.error('Error loading furniture:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      setHasSearched(true);
      await loadFurnitureItems(query);
    } else {
      setHasSearched(false);
      setFurnitureItems([]);
    }
  };

  const handleCategoryChange = async (category: any) => {
    setSelectedCategory(category.id);
    setHasSearched(true);
    await loadFurnitureItems(category.query);
  };

  const handleViewItem = (item: FurnitureItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleARView = (item: FurnitureItem) => {
    // For local models, use the local path; for Sketchfab models, use the API
    const modelUrl = item.modelUrl || getARModelUrl(item);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
      // iOS Quick Look AR - create a full URL for local files
      const fullUrl = item.modelUrl ? `${window.location.origin}${item.modelUrl}` : modelUrl;
      const link = document.createElement('a');
      link.href = fullUrl;
      link.rel = 'ar';
      link.download = item.name;
      link.click();
    } else if (isAndroid) {
      // Android Scene Viewer - create a full URL for local files
      const fullUrl = item.modelUrl ? `${window.location.origin}${item.modelUrl}` : modelUrl;
      const arUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(fullUrl)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`;
      window.location.href = arUrl;
    } else {
      // Fallback - for local models, show in 3D viewer; for Sketchfab, open Sketchfab
      if (item.modelUrl) {
        // Open in a 3D viewer for local models
        const viewerUrl = `https://modelviewer.dev/editor/?model=${encodeURIComponent(window.location.origin + item.modelUrl)}`;
        window.open(viewerUrl, '_blank');
      } else {
        window.open(`https://sketchfab.com/3d-models/${item.id}`, '_blank');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Find Your Perfect Furniture</h1>
          <button
            onClick={() => navigate('/ar-demo')}
            className="bg-violet-600 text-white px-3 py-2 rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AR Demo
          </button>
        </div>
        <SearchBar
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
            // If user clears the search, go back to featured
            if (!value.trim()) {
              setHasSearched(false);
              setFurnitureItems([]);
              setSelectedCategory('all');
            }
          }}
          onSearch={handleSearch}
          placeholder="Search chairs, tables, lighting..."
        />
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Local Models Section - Only show when not searching */}
      {!hasSearched && !loading && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Featured Collection</h2>
            <span className="text-sm text-gray-400">Curated high-quality models</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {featuredModels.slice(0, 6).map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = 'https://images.pexels.com/photos/586738/pexels-photo-586738.jpeg?auto=compress&cs=tinysrgb&w=300';
                    }}
                  />
                  <button
                    onClick={() => handleViewItem(item)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-black/80 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-gray-300" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-violet-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Featured
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="font-semibold text-white text-sm mb-1 truncate" title={item.name}>
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-1">{item.category}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{item.likeCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500 truncate max-w-16" title={item.author}>
                        {item.author}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewItem(item)}
                      className="flex-1 bg-gray-700 text-gray-300 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button
                      onClick={() => handleARView(item)}
                      className="flex-1 bg-violet-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      AR
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Browse Categories CTA */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-3">Looking for something specific?</p>
            <p className="text-gray-300 text-sm">Use the categories above or search to explore thousands of 3D models</p>
          </div>
        </div>
      )}

      {/* Back to Featured Button - Show when searching */}
      {hasSearched && (
        <div className="mb-4">
          <button
            onClick={() => {
              setHasSearched(false);
              setFurnitureItems([]);
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1 transition-colors"
          >
            ← Back to Featured Collection
          </button>
        </div>
      )}

      {/* Search Results Header - Only show when searching */}
      {hasSearched && furnitureItems.length > 0 && !loading && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white mb-2">
            {selectedCategory === 'all' ? 'Search Results' : `${categories.find(c => c.id === selectedCategory)?.label} Furniture`}
          </h2>
          <p className="text-gray-400 text-sm">
            {furnitureItems.length} item{furnitureItems.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          <span className="ml-3 text-gray-400">Loading furniture...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-900/30 rounded-xl p-4 mb-6">
          <p className="text-red-400 text-center">{error}</p>
          <button
            onClick={() => loadFurnitureItems('furniture')}
            className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Furniture Grid - Only show when searching */}
      {hasSearched && !loading && furnitureItems.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {furnitureItems.map((item) => (
            <div key={item.id} className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = 'https://images.pexels.com/photos/586738/pexels-photo-586738.jpeg?auto=compress&cs=tinysrgb&w=300';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
                <button
                  onClick={() => handleViewItem(item)}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-black/80 transition-colors"
                >
                  <Heart className="w-4 h-4 text-gray-300" />
                </button>
              </div>
              
              <div className="p-3">
                <h3 className="font-semibold text-white text-sm mb-1 truncate" title={item.name}>
                  {item.name}
                </h3>
                <p className="text-xs text-gray-400 mb-1">{item.category}</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">{item.likeCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500 truncate max-w-16" title={item.author}>
                      {item.author}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewItem(item)}
                    className="flex-1 bg-gray-700 text-gray-300 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                  <button
                    onClick={() => handleARView(item)}
                    className="flex-1 bg-violet-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    AR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State - Only show when searching but no results found */}
      {hasSearched && !loading && furnitureItems.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-white font-medium mb-2">No furniture found</h3>
          <p className="text-gray-400 text-sm mb-4">
            {searchQuery ? `No results for "${searchQuery}"` : 'No items in this category'}
          </p>
          <button
            onClick={() => {
              setHasSearched(false);
              setFurnitureItems([]);
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
          >
            Browse Featured Collection
          </button>
        </div>
      )}

      {/* 3D Model Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-white truncate pr-4">{selectedItem.name}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors text-gray-300 flex-shrink-0"
              >
                ×
              </button>
            </div>
            
            <div className="h-64 bg-gray-900 rounded-lg overflow-hidden">
              {selectedItem.embedUrl ? (
                <iframe
                  src={selectedItem.embedUrl}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                  title={selectedItem.name}
                  onError={() => {
                    console.log('Iframe failed to load, showing fallback');
                  }}
                />
              ) : selectedItem.modelUrl ? (
                <Local3DViewer
                  modelUrl={selectedItem.modelUrl}
                  alt={selectedItem.name}
                  className="bg-gray-900"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center mb-4">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-white font-medium mb-2">3D Preview</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Click below to view this model on Sketchfab
                  </p>
                  <button
                    onClick={() => window.open(`https://sketchfab.com/3d-models/${selectedItem.id}`, '_blank')}
                    className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    Open in Sketchfab
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4 text-violet-400" />
                    <span className="text-violet-400 font-medium">{selectedItem.likeCount}</span>
                  </div>
                  <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                    {selectedItem.category}
                  </span>
                </div>
                {selectedItem.isDownloadable && (
                  <Download className="w-4 h-4 text-green-400" />
                )}
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-400 mb-1">By {selectedItem.author}</p>
                {selectedItem.description && (
                  <p className="text-gray-300 text-sm line-clamp-2">{selectedItem.description}</p>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleARView(selectedItem)}
                  className="flex-1 bg-violet-600 text-white py-3 rounded-xl font-medium hover:bg-violet-700 transition-colors"
                >
                  View in AR
                </button>
                <button 
                  onClick={() => window.open(`https://sketchfab.com/3d-models/${selectedItem.id}`, '_blank')}
                  className="px-6 py-3 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Sketchfab
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;