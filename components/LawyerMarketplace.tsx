'use client';

import { useState, useMemo } from 'react';
import { lawyers, specialties, states, priceRanges, Lawyer } from '@/lib/lawyers-data';
import { Search, SlidersHorizontal, Grid3x3, List, Star, MapPin, DollarSign, Clock, Award, X, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function LawyerMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter lawyers based on selections
  const filteredLawyers = useMemo(() => {
    return lawyers.filter(lawyer => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          lawyer.name.toLowerCase().includes(query) ||
          lawyer.specialty.some(s => s.toLowerCase().includes(query)) ||
          lawyer.bio.toLowerCase().includes(query) ||
          lawyer.location.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Specialty filter
      if (selectedSpecialties.length > 0) {
        const hasMatchingSpecialty = lawyer.specialty.some(s => 
          selectedSpecialties.includes(s)
        );
        if (!hasMatchingSpecialty) return false;
      }

      // State filter
      if (selectedStates.length > 0) {
        if (!selectedStates.includes(lawyer.state)) return false;
      }

      // Price filter
      if (selectedPriceRange) {
        const range = priceRanges.find(r => r.label === selectedPriceRange);
        if (range) {
          const minPrice = Math.min(...lawyer.consultationTypes.map(c => c.price));
          if (minPrice < range.min || minPrice > range.max) return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedSpecialties, selectedStates, selectedPriceRange]);

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const toggleState = (state: string) => {
    setSelectedStates(prev => 
      prev.includes(state) 
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  };

  const clearFilters = () => {
    setSelectedSpecialties([]);
    setSelectedStates([]);
    setSelectedPriceRange('');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedSpecialties.length > 0 || selectedStates.length > 0 || selectedPriceRange || searchQuery;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <div className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-4">Find Your Perfect Lawyer</h1>
              <p className="text-xl text-stone-300 mb-8">
                Connect with verified attorneys who specialize in contract review and negotiation. 
                All offer free initial consultations.
              </p>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by name, specialty, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white text-stone-900 rounded-xl border-2 border-transparent focus:border-stone-400 focus:outline-none text-lg"
                />
              </div>
            </div>

            <Link href="/lawyers/register">
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-xl font-semibold hover:bg-stone-100 transition-colors whitespace-nowrap">
                <UserPlus className="w-5 h-5" />
                Become a Lawyer
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters & Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                showFilters 
                  ? 'bg-stone-900 text-white border-stone-900' 
                  : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-0.5 bg-stone-100 text-stone-900 text-xs rounded-full font-semibold">
                  {[selectedSpecialties.length, selectedStates.length, selectedPriceRange ? 1 : 0].filter(n => n > 0).reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            )}

            <div className="text-sm text-stone-600">
              <span className="font-semibold text-stone-900">{filteredLawyers.length}</span> {filteredLawyers.length === 1 ? 'lawyer' : 'lawyers'} found
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg border-2 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
              }`}
              aria-label="Grid view"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg border-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
              }`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Specialty Filter */}
              <div>
                <h3 className="text-sm font-semibold text-stone-900 mb-3">Specialty</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {specialties.map(specialty => (
                    <label key={specialty} className="flex items-center gap-2 cursor-pointer hover:bg-stone-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedSpecialties.includes(specialty)}
                        onChange={() => toggleSpecialty(specialty)}
                        className="w-4 h-4 rounded border-stone-300"
                      />
                      <span className="text-sm text-stone-700">{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* State Filter */}
              <div>
                <h3 className="text-sm font-semibold text-stone-900 mb-3">State</h3>
                <div className="space-y-2">
                  {states.map(state => (
                    <label key={state} className="flex items-center gap-2 cursor-pointer hover:bg-stone-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedStates.includes(state)}
                        onChange={() => toggleState(state)}
                        className="w-4 h-4 rounded border-stone-300"
                      />
                      <span className="text-sm text-stone-700">{state}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="text-sm font-semibold text-stone-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer hover:bg-stone-50 p-2 rounded">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === range.label}
                        onChange={() => setSelectedPriceRange(range.label)}
                        className="w-4 h-4 border-stone-300"
                      />
                      <span className="text-sm text-stone-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lawyer Grid/List */}
        {filteredLawyers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-stone-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-stone-900 mb-2">No lawyers found</h3>
            <p className="text-stone-600 mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredLawyers.map(lawyer => (
              <LawyerCard key={lawyer.id} lawyer={lawyer} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LawyerCard({ lawyer, viewMode }: { lawyer: Lawyer; viewMode: 'grid' | 'list' }) {
  const minPrice = Math.min(...lawyer.consultationTypes.map(c => c.price));
  const popularConsultation = lawyer.consultationTypes.find(c => c.popular);

  if (viewMode === 'list') {
    return (
      <Link href={`/lawyers/${lawyer.id}`}>
        <div className="bg-white border border-stone-200 rounded-xl p-6 hover:shadow-lg hover:border-stone-300 transition-all cursor-pointer">
          <div className="flex gap-6">
            <img
              src={lawyer.profileImage}
              alt={lawyer.name}
              className="w-24 h-24 rounded-xl border-2 border-stone-200 flex-shrink-0"
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-stone-900">{lawyer.name}</h3>
                    {lawyer.verified && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        <Award className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-stone-600 mb-2">{lawyer.title}</p>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-stone-900">{lawyer.rating}</span>
                    <span className="text-sm text-stone-500">({lawyer.reviewCount})</span>
                  </div>
                  <div className="text-sm text-stone-600">{lawyer.yearsOfExperience} years exp.</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {lawyer.specialty.slice(0, 3).map(spec => (
                  <span key={spec} className="px-2 py-1 bg-stone-100 text-stone-700 rounded text-xs font-medium">
                    {spec}
                  </span>
                ))}
              </div>

              <p className="text-sm text-stone-600 mb-4 line-clamp-2">{lawyer.bio}</p>

              <div className="flex items-center gap-4 text-sm text-stone-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {lawyer.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {lawyer.responseTime}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  From {minPrice === 0 ? 'Free' : `$${minPrice}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/lawyers/${lawyer.id}`}>
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-stone-300 transition-all cursor-pointer h-full flex flex-col">
        <div className="p-6 flex-1">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={lawyer.profileImage}
              alt={lawyer.name}
              className="w-16 h-16 rounded-xl border-2 border-stone-200"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-stone-900">{lawyer.name}</h3>
                {lawyer.verified && (
                  <Award className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-stone-900 text-sm">{lawyer.rating}</span>
                <span className="text-xs text-stone-500">({lawyer.reviewCount})</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-stone-600 font-medium mb-3">{lawyer.title}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {lawyer.specialty.slice(0, 2).map(spec => (
              <span key={spec} className="px-2 py-1 bg-stone-100 text-stone-700 rounded text-xs font-medium">
                {spec}
              </span>
            ))}
            {lawyer.specialty.length > 2 && (
              <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs">
                +{lawyer.specialty.length - 2}
              </span>
            )}
          </div>

          <p className="text-sm text-stone-600 mb-4 line-clamp-3">{lawyer.bio}</p>

          <div className="space-y-2 text-xs text-stone-600 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              {lawyer.location}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              {lawyer.responseTime}
            </div>
          </div>

          {lawyer.featuredBadges && lawyer.featuredBadges.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {lawyer.featuredBadges.map(badge => (
                <span key={badge} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-stone-200 p-4 bg-stone-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-600">Starting at</span>
            <span className="text-lg font-bold text-stone-900">
              {minPrice === 0 ? 'Free' : `$${minPrice}`}
            </span>
          </div>
          {popularConsultation && (
            <p className="text-xs text-stone-600 line-clamp-2">{popularConsultation.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
