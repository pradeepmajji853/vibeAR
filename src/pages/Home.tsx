import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Eye, 
  Scan,
  Play,
  ShoppingBag,
  Star,
  Home as HomeIcon,
  Sofa
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // High-quality furniture images with better variety
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      title: 'Modern Living Room',
      subtitle: 'Scandinavian Design'
    },
    {
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      title: 'Minimalist Bedroom',
      subtitle: 'Contemporary Style'
    },
    {
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
      title: 'Elegant Dining',
      subtitle: 'Modern Luxury'
    },
    {
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      title: 'Smart Kitchen',
      subtitle: 'Tech-Enabled Living'
    }
  ];

  const features = [
    {
      icon: Camera,
      title: 'AI Room Analysis',
      description: 'Upload a photo and get instant color palette, theme, and dimension analysis',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Eye,
      title: 'AR Visualization',
      description: 'See furniture in your space with realistic lighting and accurate scaling',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      icon: Brain,
      title: 'Smart Recommendations',
      description: 'Get personalized furniture suggestions based on your style and space',
      gradient: 'from-green-500 to-blue-500'
    }
  ];

  const capabilities = [
    { title: 'AI Analysis', description: 'Room color & style detection', icon: Brain },
    { title: 'AR Preview', description: 'Real-time 3D visualization', icon: Eye },
    { title: 'Smart Search', description: 'Intelligent furniture matching', icon: Sofa },
    { title: 'Multiple Sources', description: 'Sketchfab & local models', icon: Star }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-float-medium"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-pink-500/15 rounded-full blur-xl animate-float-fast"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 px-6 pt-20 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-8 shadow-2xl animate-pulse-glow">
            <Scan className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-6xl font-extrabold mb-4 animate-slide-in-up">
            <span className="text-white">Vibe</span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AR</span>
          </h1>
          
          <p className="text-xl text-white/80 mb-6 font-medium animate-slide-in-up" style={{animationDelay: '0.2s'}}>
            Experimental AR Furniture Visualization
          </p>
          
          <p className="text-gray-300 max-w-sm mx-auto mb-8 animate-slide-in-up" style={{animationDelay: '0.4s'}}>
            Explore how AI and AR can help you visualize furniture in your space
          </p>
        </div>

        {/* Hero Image Carousel */}
        <div className="relative h-64 mb-12 overflow-hidden rounded-3xl animate-slide-in-up" style={{animationDelay: '0.6s'}}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <h3 className="text-white font-bold text-lg">{image.title}</h3>
                <p className="text-white/80 text-sm">{image.subtitle}</p>
              </div>
            </div>
          ))}
          
          {/* Image Indicators */}
          <div className="absolute bottom-4 right-4 flex gap-2 z-20">
            {heroImages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4 mb-12">
          <button
            onClick={() => navigate('/vibekit-ar')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group animate-slide-in-up"
            style={{animationDelay: '0.6s'}}
          >
            <Scan className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>VibeKit AR Experience</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate('/ai-analysis')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group animate-slide-in-up"
            style={{animationDelay: '0.8s'}}
          >
            <Brain className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>Analyze Your Room</span>
          </button>
          
          <button
            onClick={() => navigate('/search')}
            className="w-full bg-white/10 backdrop-blur-sm text-white py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3 group animate-slide-in-up"
            style={{animationDelay: '1s'}}
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Browse Furniture</span>
          </button>
        </div>

        {/* Capabilities Section */}
        <div className="grid grid-cols-2 gap-4 mb-16 animate-slide-in-up" style={{animationDelay: '1.2s'}}>
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
                <Icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white mb-1">{capability.title}</div>
                <div className="text-xs text-gray-300">{capability.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-6 pb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12 animate-slide-in-up">
          How VibeAR Works
        </h2>
        
        <div className="space-y-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300 group animate-slide-in-up"
                style={{animationDelay: `${0.2 * index}s`}}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* About Section */}
      <div className="relative z-10 px-6 pb-20">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-3xl p-8 border border-white/10 animate-slide-in-up">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-4">
              <HomeIcon className="w-6 h-6 text-purple-400" />
              <span className="text-purple-400 font-semibold">About VibeAR</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              The Future of Interior Design
            </h2>
          </div>
          
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              <span className="text-purple-400 font-semibold">VibeAR</span> is an experimental platform 
              that combines artificial intelligence with augmented reality to help you visualize furniture 
              in your space before making purchase decisions.
            </p>
            <p>
              Upload a photo of your room to get AI-powered analysis of colors and style, then browse 
              3D furniture models from Sketchfab and our local collection to see how they would look 
              in your actual space using AR technology.
            </p>
            <div className="flex items-center justify-center gap-2 pt-4">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Prototype - Explore the possibilities</span>
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 px-6 pb-8">
        <button
          onClick={() => navigate('/ar-demo')}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 group shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 animate-slide-in-up"
        >
          <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Try AR Demo</span>
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Home;