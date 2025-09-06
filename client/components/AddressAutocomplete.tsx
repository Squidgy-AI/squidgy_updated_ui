import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface AddressResult {
  formatted_address: string;
  street_number?: string;
  street_name?: string;
  city?: string;
  state?: string;
  state_code?: string;
  postal_code?: string;
  country?: string;
  country_code?: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: AddressResult) => void;
  country?: string;
  placeholder?: string;
  disabled?: boolean;
}

// Mock address data for demonstration
// In production, this would be replaced with a real geocoding API like Google Places
const mockAddressData: AddressResult[] = [
  {
    formatted_address: "123 Main Street, New York, NY 10001",
    street_number: "123",
    street_name: "Main Street",
    city: "New York",
    state: "New York",
    state_code: "NY",
    postal_code: "10001",
    country: "United States",
    country_code: "US"
  },
  {
    formatted_address: "456 Oak Avenue, Los Angeles, CA 90001",
    street_number: "456",
    street_name: "Oak Avenue",
    city: "Los Angeles",
    state: "California",
    state_code: "CA",
    postal_code: "90001",
    country: "United States",
    country_code: "US"
  },
  {
    formatted_address: "789 Pine Road, Chicago, IL 60601",
    street_number: "789",
    street_name: "Pine Road",
    city: "Chicago",
    state: "Illinois",
    state_code: "IL",
    postal_code: "60601",
    country: "United States",
    country_code: "US"
  },
  {
    formatted_address: "15396 183rd St, Little Falls, MN 56345",
    street_number: "15396",
    street_name: "183rd St",
    city: "Little Falls",
    state: "Minnesota",
    state_code: "MN",
    postal_code: "56345",
    country: "United States",
    country_code: "US"
  },
  {
    formatted_address: "321 Elm Street, Houston, TX 77001",
    street_number: "321",
    street_name: "Elm Street",
    city: "Houston",
    state: "Texas",
    state_code: "TX",
    postal_code: "77001",
    country: "United States",
    country_code: "US"
  }
];

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  country = 'US',
  placeholder = 'Start typing your address...',
  disabled = false
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Simulate API call for address suggestions
  useEffect(() => {
    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      // Filter mock data based on input
      const filtered = mockAddressData.filter(addr =>
        addr.formatted_address.toLowerCase().includes(value.toLowerCase())
      );
      
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, country]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setSelectedIndex(-1);
  };

  const handleAddressSelect = (address: AddressResult) => {
    // Set the formatted address in the input
    onChange(`${address.street_number} ${address.street_name}`);
    
    // Pass the full address data to parent for auto-filling other fields
    onAddressSelect(address);
    
    // Hide suggestions
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleAddressSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full p-3 pl-10 pr-10 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleAddressSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? 'bg-purple-50 text-squidgy-purple'
                  : 'hover:bg-gray-50 text-text-primary'
              }`}
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-400" />
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {suggestion.street_number} {suggestion.street_name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {suggestion.city}, {suggestion.state_code} {suggestion.postal_code}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && suggestions.length === 0 && value.length >= 3 && !isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4">
          <div className="text-sm text-gray-500 text-center">
            No addresses found. Try typing more of your address.
          </div>
        </div>
      )}
    </div>
  );
}