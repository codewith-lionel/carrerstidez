import { useState, useEffect } from 'react';
import { adminAPI, scholarshipsAPI } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import { Award, Search, Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', country: '', type: 'full', amount: '', currency: 'USD', deadline: '', description: '' };

const AdminScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState([]);
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
      const res = await adminAPI.getAllScholarships({ page, search: search || undefined });
      setScholarships(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchData(); };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.country) return toast.error('Name and country are required');
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        country: form.country,
        type: form.type,
        amount: { value: Number(form.amount) || 0, currency: form.currency },
        deadline: form.deadline || undefined,
        description: form.description,
      };
      const res = await scholarshipsAPI.createScholarship(payload);
      setScholarships(prev => [res.data.data, ...prev]);
      setShowForm(false);
      setForm(EMPTY_FORM);
      toast.success('Scholarship created');
    } catch {
      toast.error('Failed to create scholarship');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this scholarship?')) return;
    try {
      await scholarshipsAPI.deleteScholarship(id);
      setScholarships(prev => prev.filter(s => s._id !== id));
      toast.success('Scholarship deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Scholarships Management</h2>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'Add Scholarship'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 p-5 mb-6 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scholarship Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Fulbright Scholarship" className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country *</label>
              <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                placeholder="e.g. United States" className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none">
                <option value="full">Full</option>
                <option value="partial">Partial</option>
                <option value="tuition">Tuition Only</option>
                <option value="living">Living Expenses</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="e.g. 50000" className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3} placeholder="Brief description..." className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
            </div>
            <div className="col-span-2">
              <button type="submit" disabled={saving}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60">
                {saving ? 'Saving...' : 'Create Scholarship'}
              </button>
            </div>
          </form>
        )}

        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search scholarships..."
              className="w-full pl-9 pr-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Search</button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{pagination.total ?? 0} scholarships total</p>

        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border h-14 animate-pulse" />)}</div>
        ) : scholarships.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Award size={40} className="mx-auto mb-3 opacity-30" />
            <p>No scholarships found</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Scholarship</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Country</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Deadline</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {scholarships.map(s => (
                  <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium dark:text-white">{s.name}</p>
                      {s.amount?.value > 0 && <p className="text-xs text-gray-500">{s.amount.value.toLocaleString()} {s.amount.currency}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.country}</td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-xs bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 px-2 py-0.5 rounded-full">{s.type}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                      {s.deadline ? new Date(s.deadline).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:text-red-700 transition">
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

export default AdminScholarshipsPage;
