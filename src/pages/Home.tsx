import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, Sparkles, ArrowRight, Play, Brain, Eye, Layers, ChevronDown } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Enhanced furniture images for diagonal scrolling
  const furnitureImages = [
    {
      url: 'https://images.pexels.com/photos/963486/pexels-photo-963486.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Modern Chair',
      category: 'Seating'
    },
    {
      url: 'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Luxury Sofa',
      category: 'Living Room'
    },
    {
      url: 'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Elegant Bed',
      category: 'Bedroom'
    },
    {
      url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Dining Table',
      category: 'Dining'
    },
    {
      url: 'https://images.pexels.com/photos/707676/pexels-photo-707676.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Designer Lamp',
      category: 'Lighting'
    },
    {
      url: 'https://images.pexels.com/photos/1571181/pexels-photo-1571181.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Modern Shelf',
      category: 'Storage'
    },
    {
      url: 'https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Coffee Table',
      category: 'Living Room'
    },
    {
      url: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Bar Stool',
      category: 'Seating'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Eye,
      title: 'AR Visualization',
      description: 'See furniture in your actual space with pixel-perfect accuracy using advanced AR technology'
    },
    {
      icon: Brain,
      title: 'AI Design Assistant',
      description: 'Get intelligent recommendations based on your space, style preferences, and color palette'
    },
    {
      icon: Layers,
      title: 'Real-time Rendering',
      description: 'Experience instant 3D rendering with realistic lighting, shadows, and material textures'
    }
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-purple-900/10 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,_92,_246,_0.1)_0%,_transparent_50%)]" />
      </div>

      {/* Diagonal Scrolling Furniture Images */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* First diagonal row - moving right */}
        <div 
          className="absolute flex items-center gap-8 animate-diagonal-scroll-right"
          style={{
            top: '10%',
            left: '-50%',
            transform: `translateX(${scrollY * 0.5}px) rotate(15deg)`,
            width: '200%'
          }}
        >
          {furnitureImages.slice(0, 4).map((item, index) => (
            <div
              key={`row1-${index}`}
              className="w-32 h-32 flex-shrink-0 transform hover:scale-110 transition-all duration-500 opacity-60 hover:opacity-100"
              style={{
                animationDelay: `${index * 0.3}s`
              }}
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover rounded-2xl shadow-2xl border border-violet-500/30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-violet-900/40 to-transparent rounded-2xl" />
            </div>
          ))}
        </div>

        {/* Second diagonal row - moving left */}
        <div 
          className="absolute flex items-center gap-8 animate-diagonal-scroll-left"
          style={{
            top: '30%',
            right: '-50%',
            transform: `translateX(-${scrollY * 0.3}px) rotate(-12deg)`,
            width: '200%'
          }}
        >
          {furnitureImages.slice(4, 8).map((item, index) => (
            <div
              key={`row2-${index}`}
              className="w-28 h-28 flex-shrink-0 transform hover:scale-110 transition-all duration-500 opacity-50 hover:opacity-100"
              style={{
                animationDelay: `${index * 0.4}s`
              }}
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover rounded-xl shadow-xl border border-purple-500/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent rounded-xl" />
            </div>
          ))}
        </div>

        {/* Third diagonal row - moving right slow */}
        <div 
          className="absolute flex items-center gap-6 animate-diagonal-scroll-right-slow"
          style={{
            top: '60%',
            left: '-40%',
            transform: `translateX(${scrollY * 0.2}px) rotate(8deg)`,
            width: '180%'
          }}
        >
          {furnitureImages.slice(2, 6).map((item, index) => (
            <div
              key={`row3-${index}`}
              className="w-24 h-24 flex-shrink-0 transform hover:scale-110 transition-all duration-500 opacity-40 hover:opacity-80"
              style={{
                animationDelay: `${index * 0.5}s`
              }}
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover rounded-lg shadow-lg border border-violet-400/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-violet-800/30 to-transparent rounded-lg" />
            </div>
          ))}
        </div>

        {/* Fourth diagonal row - moving left fast */}
        <div 
          className="absolute flex items-center gap-10 animate-diagonal-scroll-left-fast"
          style={{
            top: '80%',
            right: '-60%',
            transform: `translateX(-${scrollY * 0.7}px) rotate(-20deg)`,
            width: '220%'
          }}
        >
          {furnitureImages.slice(1, 5).map((item, index) => (
            <div
              key={`row4-${index}`}
              className="w-36 h-36 flex-shrink-0 transform hover:scale-110 transition-all duration-500 opacity-30 hover:opacity-70"
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover rounded-3xl shadow-2xl border border-purple-600/30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent rounded-3xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div ref={heroRef} className="relative z-10 px-6 pt-20 pb-16 min-h-screen flex flex-col justify-center">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl mb-8 shadow-2xl animate-pulse-glow animate-float">
            <Scan className="w-12 h-12 text-white animate-pulse" />
          </div>
          
          {/* Large Background Text */}
          <div className="relative mb-8">
            <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600/20 to-purple-600/20 absolute inset-0 transform scale-110 -z-10 animate-shimmer">
              VIBEAR
            </h1>
            <h1 className="text-5xl font-bold mb-4 relative z-10 animate-bounce-in">
              <span className="text-white">Vibe</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 animate-text-glow">AR</span>
            </h1>
          </div>

          <p className="text-2xl text-gray-300 leading-relaxed max-w-lg mx-auto mb-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            The Future of <span className="text-violet-400 font-semibold gradient-text">Interior Design</span> is Here
          </p>
          <p className="text-lg text-gray-400 max-w-md mx-auto mb-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            Visualize, customize, and perfect your space with cutting-edge AR + AI technology
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4 mb-8">
          <button
            onClick={() => navigate('/search')}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-violet-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4 group relative overflow-hidden animate-pulse-glow"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Play className="w-8 h-8 group-hover:scale-110 transition-transform relative z-10" />
            <span className="relative z-10">Start Your AR Journey</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
          </button>
          
          <button
            onClick={() => navigate('/ar-demo')}
            className="w-full glass text-white py-4 rounded-xl font-semibold text-lg hover:bg-violet-500/10 transition-all duration-300 flex items-center justify-center gap-3 group border border-violet-500/30 hover:border-violet-400/60"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Try AR Demo</span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center animate-bounce">
          <ChevronDown className="w-8 h-8 text-violet-400 opacity-70" />
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-6 pb-16">
        <h2 className="text-3xl font-bold text-white mb-2 text-center animate-fade-in-up">
          Why Choose VibeAR?
        </h2>
        <p className="text-gray-400 text-center mb-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          Experience the next generation of interior design with AR + AI
        </p>
        
        <div className="space-y-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass rounded-3xl p-8 border border-violet-500/20 shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 transform hover:scale-105 group animate-slide-in-right"
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-glow">
                    <Icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-white group-hover:gradient-text transition-colors mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* What is VibeAR Section */}
      <div className="relative z-10 px-6 pb-20">
        <div className="glass rounded-3xl p-8 border border-violet-500/30 hover:border-violet-400/50 transition-all duration-500 group animate-fade-in-up">
          <h2 className="text-3xl font-bold text-white mb-6 text-center group-hover:gradient-text transition-colors">
            What is VibeAR?
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg group-hover:text-white transition-colors">
              <span className="text-violet-400 font-semibold gradient-text">VibeAR</span> is a revolutionary augmented reality platform that transforms how you design and visualize your living spaces.
            </p>
            <p className="group-hover:text-white transition-colors">
              Using advanced AI and AR technology, we help you make confident furniture decisions by letting you see exactly how items will look and fit in your actual space before you buy.
            </p>
            <p className="text-violet-300 font-medium group-hover:scale-105 transition-transform inline-block">
              Say goodbye to expensive mistakes and hello to your perfect space! 🏠✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;