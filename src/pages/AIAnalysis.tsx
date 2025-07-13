import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Loader2, Brain, ArrowRight, Eye } from 'lucide-react';
import { analyzeRoomImage } from '../utils/gemini';

const AIAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [imageDescription, setImageDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysis('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !imageDescription.trim()) {
      alert('Please upload an image and describe what you see in the room');
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeRoomImage(imageDescription);
      setAnalysis(result);
    } catch (error) {
      setAnalysis("Sorry, I'm having trouble analyzing the image right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "A modern living room with grey walls, white sofa, and large windows",
    "Small bedroom with wooden floors, white walls, and minimal furniture",
    "Open kitchen with white cabinets, marble countertops, and pendant lights",
    "Home office with desk, bookshelf, and natural lighting"
  ];

  return (
    <div className="min-h-screen bg-black p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Room Analysis</h1>
            <p className="text-gray-400 text-sm">Upload a photo and get personalized furniture suggestions</p>
          </div>
        </div>
      </div>

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
                onClick={() => setSelectedImage(null)}
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
              <p className="text-gray-400 text-sm mb-6">Take a photo or upload from gallery</p>
              
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

      {/* Description Section */}
      {selectedImage && (
        <div className="mb-6">
          <label className="block text-white font-medium mb-3">
            Describe your room
          </label>
          <textarea
            value={imageDescription}
            onChange={(e) => setImageDescription(e.target.value)}
            placeholder="Describe what you see in the room: colors, furniture, lighting, style, etc."
            className="w-full h-24 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
          />
          
          {/* Sample Prompts */}
          <div className="mt-3">
            <p className="text-sm text-gray-400 mb-2">Sample descriptions:</p>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setImageDescription(prompt)}
                  className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs hover:bg-gray-600 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analyze Button */}
      {selectedImage && (
        <div className="mb-6">
          <button
            onClick={handleAnalyze}
            disabled={loading || !imageDescription.trim()}
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
        <div className="bg-gradient-to-r from-violet-900/20 to-purple-900/20 rounded-2xl border border-violet-900/30 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">AI Analysis Results</h3>
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {analysis}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button className="flex-1 bg-violet-600 text-white py-3 rounded-xl font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-2">
              <Eye className="w-4 h-4" />
              View Suggested Items
            </button>
            <button className="px-6 py-3 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors">
              Save Analysis
            </button>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="mt-8 bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-4">How AI Analysis Works</h3>
        <div className="space-y-3">
          {[
            { step: 1, title: 'Upload Photo', desc: 'Take or upload a photo of your room' },
            { step: 2, title: 'Describe Details', desc: 'Add context about colors, style, and preferences' },
            { step: 3, title: 'AI Analysis', desc: 'Our AI analyzes lighting, space, and aesthetics' },
            { step: 4, title: 'Get Suggestions', desc: 'Receive personalized furniture recommendations' }
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