import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  showFilter?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search furniture...",
  showFilter = true
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm text-white placeholder-gray-400"
          />
          {showFilter && (
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="absolute right-3 p-1 text-gray-500 hover:text-violet-400 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Filter Dropdown */}
      {isFilterOpen && showFilter && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-30 p-4">
          <h4 className="font-medium text-white mb-3">Filters</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white">
                <option>All Categories</option>
                <option>Chairs</option>
                <option>Tables</option>
                <option>Sofas</option>
                <option>Storage</option>
                <option>Lighting</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Style</label>
              <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white">
                <option>All Styles</option>
                <option>Modern</option>
                <option>Minimalist</option>
                <option>Industrial</option>
                <option>Scandinavian</option>
                <option>Classic</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setIsFilterOpen(false)}
              className="flex-1 px-4 py-2 text-gray-400 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;