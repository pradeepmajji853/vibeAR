import React, { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { generateSuggestion } from '../utils/gemini';

interface GeminiPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const GeminiPanel: React.FC<GeminiPanelProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Make this room cozier",
    "What suits this grey wall?",
    "Add warmth to this space",
    "Modern minimalist suggestions"
  ];

  const handleSubmit = async (prompt: string) => {
    setLoading(true);
    try {
      const result = await generateSuggestion(prompt);
      setSuggestion(result);
    } catch (error) {
      setSuggestion("Sorry, I'm having trouble generating suggestions right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    handleSubmit(prompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 mx-4 bg-gray-900 rounded-t-3xl shadow-2xl border border-violet-900/30 z-40 max-h-96 overflow-hidden">
      <div className="p-4 border-b border-violet-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-400" />
          <h3 className="font-semibold text-white">AI Room Suggestions</h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors text-gray-400"
        >
          ×
        </button>
      </div>

      <div className="p-4 max-h-80 overflow-y-auto">
        {/* Quick Prompts */}
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-3 py-1 bg-violet-900/30 text-violet-300 rounded-full text-sm hover:bg-violet-900/50 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for room suggestions..."
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(input)}
            />
            <button
              onClick={() => handleSubmit(input)}
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Suggestion Response */}
        {suggestion && (
          <div className="bg-gradient-to-r from-violet-900/20 to-blue-900/20 p-4 rounded-lg border border-violet-900/30">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-white mb-2">AI Suggestion:</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{suggestion}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiPanel;