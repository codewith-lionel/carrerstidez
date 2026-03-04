import { useState, useEffect } from 'react';
import { adminAPI, programsAPI } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import { BookOpen, Search, Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', degree: 'bachelor', duration: '', language: 'English', universityId: '' };

const AdminProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllPrograms({ page, search: search || undefined });
      setPrograms(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchData(); };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Program name is required');
    setSaving(true);
    try {
      const payload = { name: form.name, degree: form.degree, duration: form.duration, language: form.language };
      if (form.universityId) payload.university = form.universityId;
      const res = await programsAPI.createProgram(payload);
      setPrograms(prev => [res.data.data, ...prev]);
      setShowForm(false);
      setForm(EMPTY_FORM);
      toast.success('Program created');
    } catch {
      toast.error('Failed to create program');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this program?')) return;
    try {
      await programsAPI.deleteProgram(id);
      setPrograms(prev => prev.filter(p => p._id !== id));
      toast.success('Program deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Programs Management</h2>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'Add Program'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-5 mb-6 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Program Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Computer Science" className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Degree</label>
              <select value={form.degree} onChange={e => setForm(f => ({ ...f, degree: e.target.value }))}
                className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none">
                <option value="bachelor">Bachelor</option>
                <option value="master">Master</option>
                <option value="phd">PhD</option>
                <option value="diploma">Diploma</option>
                <option value="certificate">Certificate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
              <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                placeholder="e.g. 4 years" className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
              <input value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                placeholder="e.g. English" className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <button type="submit" disabled={saving}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60">
                {saving ? 'Saving...' : 'Create Program'}
              </button>
            </div>
          </form>
        )}

        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search programs..."
              className="w-full pl-9 pr-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Search</button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{pagination.total ?? 0} programs total</p>

        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border h-14 animate-pulse" />)}</div>
        ) : programs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p>No programs found</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Program</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">University</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Degree</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Added</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {programs.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium dark:text-white">{p.name}</p>
                      {p.duration && <p className="text-xs text-gray-500">{p.duration}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">
                      {p.university?.name || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-xs bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded-full">{p.degree}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700 transition">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex gap-2 mt-4">
            {[...Array(pagination.pages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-900 border dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-500'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProgramsPage;
