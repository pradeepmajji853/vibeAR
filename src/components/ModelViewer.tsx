import React, { useEffect, useRef, useState } from 'react';

interface ModelViewerProps {
  src: string;
  alt: string;
  className?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  arEnabled?: boolean;
  onARClick?: () => void;
  iosSource?: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  src,
  alt,
  className = '',
  autoRotate = true,
  cameraControls = true,
  arEnabled = false,
  onARClick,
  iosSource
}) => {
  const modelRef = useRef<any>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);

  useEffect(() => {
    // Import model-viewer dynamically with better error handling
    const loadModelViewer = async () => {
      try {
        await import('@google/model-viewer');
        console.log('Model viewer loaded successfully');
      } catch (error) {
        console.error('Failed to load model-viewer:', error);
        setModelError(true);
      }
    };
    
    loadModelViewer();
  }, []);

  const handleModelLoad = () => {
    console.log('Model loaded successfully:', src);
    setModelLoaded(true);
    setModelError(false);
  };

  const handleModelError = () => {
    console.error('Model failed to load:', src);
    setModelError(true);
    setModelLoaded(false);
  };

  const handleARClick = () => {
    if (onARClick) {
      onARClick();
    } else {
      // Detect device and use appropriate AR method
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      if (isIOS && iosSource) {
        // iOS Quick Look AR
        const link = document.createElement('a');
        link.href = iosSource;
        link.rel = 'ar';
        link.click();
      } else if (isAndroid) {
        // Android Scene Viewer
        const modelUrl = iosSource || src;
        const arUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(modelUrl)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`;
        window.location.href = arUrl;
      } else {
        // Fallback for desktop - show in new tab
        window.open(`https://modelviewer.dev/editor/?model=${encodeURIComponent(src)}`, '_blank');
      }
    }
  };

  // Debug: Log the src URL
  useEffect(() => {
    console.log('ModelViewer src:', src);
    console.log('ModelViewer full URL:', window.location.origin + src);
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      {!modelError ? (
        <model-viewer
          ref={modelRef}
          src={src}
          ios-src={iosSource}
          alt={alt}
          auto-rotate={autoRotate}
          camera-controls={cameraControls}
          ar
          ar-modes="webxr scene-viewer quick-look"
          environment-image="neutral"
          shadow-intensity="1"
          style={{ width: '100%', height: '100%' }}
          loading="lazy"
          onLoad={handleModelLoad}
          onError={handleModelError}
        />
      ) : (
        <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center text-center p-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-3">
            <span className="text-gray-400 text-xl">📦</span>
          </div>
          <h4 className="text-white font-medium mb-2">Model Unavailable</h4>
          <p className="text-gray-400 text-sm">
            This 3D model couldn't be loaded
          </p>
          <p className="text-gray-500 text-xs mt-2">
            URL: {src}
          </p>
        </div>
      )}
      
      {!modelLoaded && !modelError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      )}
      
      {arEnabled && (
        <button
          onClick={handleARClick}
          className="absolute bottom-4 right-4 bg-violet-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
        >
          <span className="text-sm font-medium">View in AR</span>
        </button>
      )}
    </div>
  );
};

export default ModelViewer;