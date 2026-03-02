import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scholarshipsAPI } from '../../services/api';
import MainLayout from '../../layouts/MainLayout';
import { Search, Award, Calendar, MapPin, GraduationCap } from 'lucide-react';

const ScholarshipCard = ({ s }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-5 hover:shadow-md transition">
    <div className="flex items-start justify-between gap-4 mb-3">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{s.name}</h3>
        {s.university?.name && <p className="text-sm text-gray-500 mt-0.5">{s.university.name}</p>}
      </div>
      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${
        s.amount?.type === 'full' ? 'bg-green-100 text-green-700' :
        s.amount?.type === 'partial' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
      }`}>
        {s.amount?.type === 'full' ? '🎯 Full' : s.amount?.type === 'partial' ? '📊 Partial' : '💰 Stipend'}
      </span>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{s.description}</p>
    <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
      <span className="flex items-center gap-1"><MapPin size={13} />{s.country}</span>
      {s.applicationDeadline && (
        <span className="flex items-center gap-1"><Calendar size={13} />Deadline: {new Date(s.applicationDeadline).toLocaleDateString()}</span>
      )}
    </div>
    {s.eligibility?.degree?.length > 0 && (
      <div className="flex flex-wrap gap-1 mb-3">
        {s.eligibility.degree.map(d => (
          <span key={d} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded"><GraduationCap size={11} className="inline mr-1" />{d}</span>
        ))}
      </div>
    )}
    {s.applicationLink && (
      <a href={s.applicationLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 font-medium hover:underline">Apply Now →</a>
    )}
  </div>
);

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({ search: '', country: '', degree: '', type: '', page: 1 });

  useEffect(() => { fetchScholarships(); }, [filters]);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const res = await scholarshipsAPI.getScholarships(filters);
      setScholarships(res.data.data);
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
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Scholarships</h1>
          <p className="text-purple-100 mb-6">Find funding opportunities for your education worldwide</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search scholarships..." value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-gray-900 outline-none" />
            </div>
            <input type="text" placeholder="Country" value={filters.country}
              onChange={e => setFilters(f => ({ ...f, country: e.target.value, page: 1 }))}
              className="sm:w-36 px-4 py-2.5 rounded-lg bg-white text-gray-900 outline-none" />
            <select value={filters.degree} onChange={e => setFilters(f => ({ ...f, degree: e.target.value, page: 1 }))}
              className="sm:w-36 px-4 py-2.5 rounded-lg bg-white text-gray-900 outline-none">
              <option value="">All Degrees</option>
              <option value="UG">Undergraduate</option>
              <option value="PG">Postgraduate</option>
              <option value="PhD">PhD</option>
              <option value="Diploma">Diploma</option>
            </select>
            <select value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value, page: 1 }))}
              className="sm:w-36 px-4 py-2.5 rounded-lg bg-white text-gray-900 outline-none">
              <option value="">All Types</option>
              <option value="full">Full</option>
              <option value="partial">Partial</option>
              <option value="stipend">Stipend</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border h-48 animate-pulse" />)}
          </div>
        ) : scholarships.length === 0 ? (
          <div className="text-center py-16 text-gray-500"><Award size={48} className="mx-auto mb-4 opacity-30" /><p>No scholarships found.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scholarships.map(s => <ScholarshipCard key={s._id} s={s} />)}
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(pagination.pages)].map((_, i) => (
              <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${filters.page === i + 1 ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border dark:border-gray-700'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ScholarshipsPage;
