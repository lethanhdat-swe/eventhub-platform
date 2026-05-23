import { useState } from 'react';
import { Calendar, ChevronDown, MapPin, Search, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SearchSelect() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const action = [
    { icon: MapPin, label: 'Location', defaultValue: 'All Locations' },
    { icon: Calendar, label: 'Date', defaultValue: 'Any Date' },
    { icon: Tag, label: 'Category', defaultValue: 'All Categories' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }

    // Navigate to search page with query parameter
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 p-4 mx-8 rounded-2xl bg-(--background-color)/70 container">
      <div className="flex items-center flex-1 gap-3 px-4 py-2 rounded-xl bg-(--text-primary)/5">
        <Search size={16} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search events, artists, or venues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full text-sm text-gray-300 placeholder-gray-600 bg-transparent outline-none"
        />
      </div>

      {/* Divider + Selects */}
      {action.map(({ icon: Icon, label, defaultValue }) => (
        <div key={label} className="flex items-center">
          <div className="w-px h-8 mr-4 bg-(--text-primary)/10" />
          <div className="flex flex-col gap-1 px-4 cursor-pointer group">
            <span className="text-xs text-gray-500">{label}</span>
            <div className="flex items-center gap-2 text-sm font-medium text-(--text-primary)">
              <Icon size={13} className="text-gray-400" />
              <span>{defaultValue}</span>
              <ChevronDown
                size={13}
                className="text-gray-400 transition-colors group-hover:text-(--text-primary)"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Search button */}
      <button 
        type="submit"
        className="px-6 py-3 ml-2 text-sm font-semibold text-(--text-primary) transition-all rounded-xl hover:opacity-90 hover:scale-105 bg-(--primary-color)"
      >
        Search
      </button>
    </form>
  );
}

export default SearchSelect;
