const SKETCHFAB_API_TOKEN = '442e6a29b17188e118c274ed7b274862';
const SKETCHFAB_API_BASE = 'https://api.sketchfab.com/v3';

interface SketchfabModel {
  uid: string;
  name: string;
  description?: string;
  thumbnails?: {
    images?: Array<{ url: string }>;
  };
  user?: {
    displayName?: string;
  };
  likeCount?: number;
  viewCount?: number;
  tags?: Array<{ name: string }>;
  categories?: Array<{ name: string }>;
  isDownloadable?: boolean;
  license?: {
    label?: string;
  };
  archives?: {
    gltf?: {
      url?: string;
    };
  };
}

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

// Fallback furniture from local assets
const getFallbackFurniture = (): FurnitureItem[] => {
  return [
    {
      id: 'local-chair',
      name: 'Vintage Wooden Chair',
      description: 'A classic wooden chair perfect for dining or office use. Features traditional craftsmanship with comfortable seating.',
      thumbnail: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=400&fit=crop', // Chair thumbnail
      viewerUrl: '#',
      embedUrl: '#',
      downloadUrl: '/old_wooden_chair.glb',
      author: 'Local Collection',
      likeCount: 95,
      viewCount: 1250,
      tags: ['wood', 'chair', 'vintage', 'furniture', 'seating'],
      category: 'Furniture',
      isDownloadable: true,
      license: 'Free'
    },
    {
      id: 'local-sofa',
      name: 'Modern Sofa',
      description: 'Comfortable modern sofa perfect for living room. Spacious seating with contemporary design.',
      thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', // Sofa thumbnail
      viewerUrl: '#',
      embedUrl: '#',
      downloadUrl: '/sofa.glb',
      author: 'Local Collection',
      likeCount: 156,
      viewCount: 2100,
      tags: ['sofa', 'modern', 'living room', 'furniture', 'seating'],
      category: 'Furniture',
      isDownloadable: true,
      license: 'Free'
    },
    {
      id: 'local-bed',
      name: 'Wooden Bed Frame',
      description: 'Elegant wooden bed frame for bedroom. Sturdy construction with classic wood finish.',
      thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', // Bed thumbnail
      viewerUrl: '#',
      embedUrl: '#',
      downloadUrl: '/wooden_bed.glb',
      author: 'Local Collection',
      likeCount: 203,
      viewCount: 3200,
      tags: ['bed', 'wood', 'bedroom', 'furniture', 'sleep'],
      category: 'Furniture',
      isDownloadable: true,
      license: 'Free'
    },
    {
      id: 'local-clock',
      name: 'Steampunk Decorative Clock',
      description: 'Unique steampunk-style decorative clock. Perfect accent piece for vintage or industrial themes.',
      thumbnail: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=400&fit=crop', // Clock thumbnail
      viewerUrl: '#',
      embedUrl: '#',
      downloadUrl: '/broken_steampunk_clock.glb',
      author: 'Local Collection',
      likeCount: 78,
      viewCount: 890,
      tags: ['clock', 'steampunk', 'decoration', 'vintage', 'industrial'],
      category: 'Decor',
      isDownloadable: true,
      license: 'Free'
    },
    {
      id: 'local-table',
      name: 'Modern Coffee Table',
      description: 'Sleek modern coffee table ideal for living rooms. Clean lines and functional design.',
      thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', // Table thumbnail
      viewerUrl: '#',
      embedUrl: '#',
      downloadUrl: '/215a41d8b6d44ecdbd70cc9680c0f585.glb',
      author: 'Local Collection',
      likeCount: 124,
      viewCount: 1890,
      tags: ['table', 'coffee table', 'modern', 'furniture', 'living room'],
      category: 'Furniture',
      isDownloadable: true,
      license: 'Free'
    }
  ];
};

export const fetchSketchfabModels = async (query = 'furniture', page = 1, limit = 20): Promise<{
  results: FurnitureItem[];
  total: number;
  next: string | null;
  previous: string | null;
}> => {
  try {
    console.log('Searching Sketchfab for:', query);
    
    // Simplify the search query to be more reliable
    const searchUrl = `${SKETCHFAB_API_BASE}/search?type=models&q=${encodeURIComponent(query)}&sort_by=-likeCount&page=${page}&count=${limit}`;
    console.log('Search URL:', searchUrl);
    
    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': `Token ${SKETCHFAB_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sketchfab API error:', response.status, errorText);
      throw new Error(`Sketchfab API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Sketchfab response:', data);
    
    if (!data.results || !Array.isArray(data.results)) {
      console.error('Invalid response format:', data);
      return {
        results: [],
        total: 0,
        next: null,
        previous: null
      };
    }
    
    // Transform the data to our format
    const transformedResults = data.results.map((model: SketchfabModel) => ({
      id: model.uid,
      name: model.name,
      description: model.description || 'No description available',
      thumbnail: model.thumbnails?.images?.[0]?.url || '',
      viewerUrl: `https://sketchfab.com/models/${model.uid}`,
      embedUrl: `https://sketchfab.com/models/${model.uid}/embed?autostart=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0`,
      downloadUrl: model.archives?.gltf?.url || null,
      author: model.user?.displayName || 'Unknown',
      likeCount: model.likeCount || 0,
      viewCount: model.viewCount || 0,
      tags: model.tags?.map(tag => tag.name) || [],
      category: model.categories?.[0]?.name || 'Furniture',
      isDownloadable: model.isDownloadable,
      license: model.license?.label || 'Unknown'
    }));

    console.log('Transformed results:', transformedResults.length, 'items');

    return {
      results: transformedResults,
      total: data.count || 0,
      next: data.next,
      previous: data.previous
    };
  } catch (error) {
    console.error('Error fetching Sketchfab models:', error);
    
    // Return some fallback furniture items from local assets
    return {
      results: getFallbackFurniture(),
      total: 4,
      next: null,
      previous: null
    };
  }
};

export const getModelDetails = async (modelId: string): Promise<FurnitureItem> => {
  try {
    const response = await fetch(
      `${SKETCHFAB_API_BASE}/models/${modelId}`,
      {
        headers: {
          'Authorization': `Token ${SKETCHFAB_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Sketchfab API error: ${response.status}`);
    }

    const model: SketchfabModel = await response.json();
    
    return {
      id: model.uid,
      name: model.name,
      description: model.description || 'No description available',
      thumbnail: model.thumbnails?.images?.[0]?.url || '',
      viewerUrl: `https://sketchfab.com/models/${model.uid}/embed?autostart=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=1&ui_watermark_link=1`,
      embedUrl: `https://sketchfab.com/models/${model.uid}/embed?autostart=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_watermark_link=0&ui_ar=1&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=1&ui_annotations=0`,
      downloadUrl: model.archives?.gltf?.url || null,
      author: model.user?.displayName || 'Unknown',
      likeCount: model.likeCount || 0,
      viewCount: model.viewCount || 0,
      tags: model.tags?.map(tag => tag.name) || [],
      category: model.categories?.[0]?.name || 'Furniture',
      isDownloadable: model.isDownloadable,
      license: model.license?.label || 'Unknown'
    };
  } catch (error) {
    console.error('Error fetching model details:', error);
    throw error;
  }
};

export const searchFurnitureByCategory = async (category = 'chair') => {
  const queries: Record<string, string> = {
    chair: 'chair furniture seat',
    table: 'table desk furniture',
    sofa: 'sofa couch furniture',
    bed: 'bed bedroom furniture',
    lamp: 'lamp light lighting',
    shelf: 'shelf bookshelf storage',
    cabinet: 'cabinet storage furniture',
    plant: 'plant pot decoration'
  };
  
  const query = queries[category.toLowerCase()] || `${category} furniture`;
  return fetchSketchfabModels(query);
};

// Enhanced search with multiple fallback strategies
export const searchFurnitureEnhanced = async (keywords: string[]): Promise<FurnitureItem[]> => {
  const searchStrategies = [
    // Strategy 1: Try combined keywords
    keywords.slice(0, 3).join(' '),
    // Strategy 2: Try just the primary keyword
    keywords[0] || 'furniture',
    // Strategy 3: Try common furniture categories
    'chair',
    'table', 
    'sofa',
    // Strategy 4: Very broad search
    'furniture'
  ];

  for (const searchTerm of searchStrategies) {
    try {
      console.log(`Trying search strategy: "${searchTerm}"`);
      const results = await fetchSketchfabModels(searchTerm, 1, 8);
      
      if (results.results.length > 0) {
        console.log(`Found ${results.results.length} results with "${searchTerm}"`);
        return results.results;
      }
    } catch (error) {
      console.log(`Search failed for "${searchTerm}":`, error);
      continue;
    }
  }

  // If all strategies fail, return fallback furniture
  console.log('All search strategies failed, using fallback furniture');
  return getFallbackFurniture();
};

// Helper function to get AR-compatible model URL
export const getARModelUrl = (model: any): string => {
  // For AR, we need GLB format. If downloadUrl is available, use it
  // Otherwise, we'll use a fallback GLB model
  if (model.downloadUrl && model.downloadUrl.includes('.glb')) {
    return model.downloadUrl;
  }
  
  // Fallback to sample GLB models for AR
  const fallbackModels = [
    'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    'https://modelviewer.dev/shared-assets/models/DamagedHelmet.glb',
    'https://modelviewer.dev/shared-assets/models/Duck.glb'
  ];
  
  return fallbackModels[Math.floor(Math.random() * fallbackModels.length)];
};