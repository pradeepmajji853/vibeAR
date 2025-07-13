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

export const fetchSketchfabModels = async (query = 'furniture', page = 1, limit = 20): Promise<{
  results: FurnitureItem[];
  total: number;
  next: string | null;
  previous: string | null;
}> => {
  try {
    const response = await fetch(
      `${SKETCHFAB_API_BASE}/search?type=models&q=${encodeURIComponent(query)}&downloadable=true&animated=false&sort_by=-likeCount&page=${page}&count=${limit}`,
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

    const data = await response.json();
    
    // Transform the data to our format
    return {
      results: data.results.map((model: SketchfabModel) => ({
        id: model.uid,
        name: model.name,
        description: model.description || 'No description available',
        thumbnail: model.thumbnails?.images?.[0]?.url || '',
        viewerUrl: `https://sketchfab.com/models/${model.uid}/embed?autostart=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=1&ui_watermark_link=1`,
        // Use Sketchfab's proper embed URL with domain allowlist
        embedUrl: `https://sketchfab.com/models/${model.uid}/embed?autostart=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_watermark_link=0&ui_ar=1&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=1&ui_annotations=0`,
        downloadUrl: model.archives?.gltf?.url || null,
        author: model.user?.displayName || 'Unknown',
        likeCount: model.likeCount || 0,
        viewCount: model.viewCount || 0,
        tags: model.tags?.map(tag => tag.name) || [],
        category: model.categories?.[0]?.name || 'Furniture',
        isDownloadable: model.isDownloadable,
        license: model.license?.label || 'Unknown'
      })),
      total: data.count,
      next: data.next,
      previous: data.previous
    };
  } catch (error) {
    console.error('Error fetching Sketchfab models:', error);
    throw error;
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