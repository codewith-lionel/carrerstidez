import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { programsAPI } from '../../services/api';
import MainLayout from '../../layouts/MainLayout';
import { Search, BookOpen, Clock, Globe } from 'lucide-react';

const ProgramCard = ({ program }) => (
  <Link to={`/programs/${program._id}`} className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-5 hover:shadow-md transition group">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition line-clamp-2">{program.name}</h3>
        {program.university && <p className="text-sm text-gray-500 mt-0.5">{program.university.name}</p>}
      </div>
      <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full whitespace-nowrap">{program.degree}</span>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{program.field}</p>
    <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
      <span className="flex items-center gap-1"><Clock size={12} />{program.duration?.value} {program.duration?.unit}</span>
      <span className="flex items-center gap-1"><Globe size={12} />{program.language}</span>
      {program.tuitionFee?.amount > 0 && <span>${program.tuitionFee.amount.toLocaleString()}/yr</span>}
      {program.scholarshipAvailable && <span className="text-green-600 font-medium">✓ Scholarship Available</span>}
    </div>
  </Link>
);

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({ search: '', degree: '', field: '', page: 1 });

  useEffect(() => { fetchPrograms(); }, [filters]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await programsAPI.getPrograms(filters);
      setPrograms(res.data.data);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Study Programs</h1>
          <p className="text-gray-500 dark:text-gray-400">Browse programs by degree type, field, and university</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search programs..." value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
              className="w-full pl-10 pr-4 py-2.5 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <select value={filters.degree} onChange={e => setFilters(f => ({ ...f, degree: e.target.value, page: 1 }))}
            className="sm:w-40 px-4 py-2.5 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none">
            <option value="">All Degrees</option>
            <option value="UG">Undergraduate</option>
            <option value="PG">Postgraduate</option>
            <option value="PhD">PhD</option>
            <option value="Diploma">Diploma</option>
            <option value="Certificate">Certificate</option>
          </select>
          <input type="text" placeholder="Field of study" value={filters.field}
            onChange={e => setFilters(f => ({ ...f, field: e.target.value, page: 1 }))}
            className="sm:w-40 px-4 py-2.5 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border h-40 animate-pulse" />)}
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-16 text-gray-500"><BookOpen size={48} className="mx-auto mb-4 opacity-30" /><p>No programs found.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map(p => <ProgramCard key={p._id} program={p} />)}
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(pagination.pages)].map((_, i) => (
              <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${filters.page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-700 border dark:border-gray-700'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProgramsPage;
