// Type declarations for Google Model Viewer
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': {
      src?: string;
      alt?: string;
      'auto-rotate'?: boolean;
      'camera-controls'?: boolean;
      ar?: boolean;
      'ar-modes'?: string;
      'ar-scale'?: string;
      'touch-action'?: string;
      'environment-image'?: string;
      'shadow-intensity'?: string;
      className?: string;
      loading?: string;
      'ios-src'?: string;
      style?: React.CSSProperties;
      onLoad?: () => void;
      onError?: () => void;
      children?: React.ReactNode;
    };
  }
}
