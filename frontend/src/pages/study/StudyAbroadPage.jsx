import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { universitiesAPI } from '../../services/api';
import MainLayout from '../../layouts/MainLayout';
import { MapPin, Globe, Search, Star, Building } from 'lucide-react';

const UniversityCard = ({ university }) => (
  <Link to={`/study-abroad/${university._id}`} className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 overflow-hidden hover:shadow-md transition group">
    {university.coverImage && (
      <img src={university.coverImage} alt={university.name} className="w-full h-32 object-cover" />
    )}
    <div className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
          {university.logo ? <img src={university.logo} alt="" className="w-10 h-10 object-contain" /> : <Building className="text-green-600" size={24} />}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 transition line-clamp-1">{university.name}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={12} />{university.city ? `${university.city}, ` : ''}{university.country}</p>
        </div>
      </div>
      {university.ranking?.world > 0 && (
        <div className="flex items-center gap-1 mb-3 text-sm text-yellow-600">
          <Star size={14} fill="currentColor" /> World Ranking: #{university.ranking.world}
        </div>
      )}
      <div className="flex items-center justify-between text-sm">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${university.type === 'public' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'}`}>
          {university.type}
        </span>
        {university.tuitionFee?.undergraduate > 0 && (
          <span className="text-gray-500 dark:text-gray-400">From ${university.tuitionFee.undergraduate.toLocaleString()}/yr</span>
        )}
      </div>
    </div>
  </Link>
);

const StudyAbroadPage = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({ search: '', country: '', type: '', page: 1 });

  useEffect(() => { fetchUniversities(); }, [filters]);

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const res = await universitiesAPI.getUniversities(filters);
      setUniversities(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      // handle silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Study Abroad</h1>
          <p className="text-green-100 mb-6">Explore 2,000+ universities across 150+ countries</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search universities..."
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-white outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="Country"
              value={filters.country}
              onChange={e => setFilters(f => ({ ...f, country: e.target.value, page: 1 }))}
              className="sm:w-40 px-4 py-2.5 rounded-lg bg-white text-gray-900 outline-none"
            />
            <select
              value={filters.type}
              onChange={e => setFilters(f => ({ ...f, type: e.target.value, page: 1 }))}
              className="sm:w-36 px-4 py-2.5 rounded-lg bg-white text-gray-900 outline-none"
            >
              <option value="">All Types</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Link to="/programs" className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-500 transition">
            Browse Programs
          </Link>
          <Link to="/scholarships" className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-500 transition">
            Find Scholarships
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border h-48 animate-pulse" />)}
          </div>
        ) : universities.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Building size={48} className="mx-auto mb-4 opacity-30" />
            <p>No universities found. Try different filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {universities.map(u => <UniversityCard key={u._id} university={u} />)}
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(pagination.pages)].map((_, i) => (
              <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${filters.page === i + 1 ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border dark:border-gray-700 hover:border-green-500'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StudyAbroadPage;
