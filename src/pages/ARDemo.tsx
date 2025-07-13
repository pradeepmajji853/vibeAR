import { ArrowLeft, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ARDemo = () => {
  const navigate = useNavigate();

  const demoModels = [
    {
      id: 'chair-demo',
      name: 'Wooden Chair',
      modelUrl: '/old_wooden_chair.glb',
      description: 'Place this vintage wooden chair in your space'
    },
    {
      id: 'sofa-demo',
      name: 'Modern Sofa',
      modelUrl: '/sofa.glb',
      description: 'See how this sofa fits in your living room'
    },
    {
      id: 'bed-demo',
      name: 'Wooden Bed',
      modelUrl: '/wooden_bed.glb',
      description: 'Visualize this bed in your bedroom'
    }
  ];

  const handleARView = (modelUrl: string, name: string) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const fullUrl = `${window.location.origin}${modelUrl}`;
    
    if (isIOS) {
      // iOS Quick Look AR
      const link = document.createElement('a');
      link.href = fullUrl;
      link.rel = 'ar';
      link.download = name;
      link.click();
    } else if (isAndroid) {
      // Android Scene Viewer
      const arUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(fullUrl)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`;
      window.location.href = arUrl;
    } else {
      // Desktop fallback - show instructions
      alert('AR viewing is available on mobile devices. Please visit this page on your smartphone or tablet.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">AR Demo</h1>
      </div>

      {/* Instructions */}
      <div className="bg-violet-900/20 border border-violet-900/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Smartphone className="w-6 h-6 text-violet-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-violet-400 mb-2">How to use AR</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Tap any model below to launch AR</li>
              <li>• Point your camera at a flat surface</li>
              <li>• Tap to place the furniture</li>
              <li>• Walk around to see it from all angles</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Demo Models */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold mb-4">Try these models in AR</h2>
        {demoModels.map((model) => (
          <div key={model.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{model.name}</h3>
                <p className="text-sm text-gray-400">{model.description}</p>
              </div>
              <button
                onClick={() => handleARView(model.modelUrl, model.name)}
                className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors ml-4"
              >
                View in AR
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Device Info */}
      <div className="mt-8 p-4 bg-gray-800 rounded-xl">
        <h3 className="font-semibold mb-2">Device Support</h3>
        <div className="text-sm text-gray-300 space-y-1">
          <p><strong>iOS:</strong> iPhone 6s+ with iOS 12+</p>
          <p><strong>Android:</strong> ARCore supported devices</p>
          <p><strong>Web:</strong> Chrome, Safari, Edge with WebXR support</p>
        </div>
      </div>
    </div>
  );
};

export default ARDemo;
