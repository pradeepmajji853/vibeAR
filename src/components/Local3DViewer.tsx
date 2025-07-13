import { useEffect } from 'react';

interface Local3DViewerProps {
  modelUrl: string;
  alt: string;
  className?: string;
}

const Local3DViewer: React.FC<Local3DViewerProps> = ({ modelUrl, alt, className = '' }) => {
  useEffect(() => {
    // Ensure model-viewer is loaded
    import('@google/model-viewer');
  }, []);

  return (
    <model-viewer
      src={modelUrl}
      alt={alt}
      auto-rotate
      camera-controls
      ar
      ar-modes="webxr scene-viewer quick-look"
      environment-image="neutral"
      shadow-intensity="1"
      className={`w-full h-full ${className}`}
      loading="lazy"
    />
  );
};

export default Local3DViewer;
