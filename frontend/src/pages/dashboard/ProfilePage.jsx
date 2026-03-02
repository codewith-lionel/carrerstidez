import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Loader2, Plus, X } from 'lucide-react';

const inputCls = 'w-full px-4 py-2.5 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(user?.skills || []);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
      experience: user?.experience || 0,
    },
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile({ ...data, skills });
      updateUser(res.data.data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 p-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role} • {user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input {...register('name')} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input {...register('phone')} placeholder="+1 555 000 0000" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input {...register('location')} placeholder="City, Country" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            <textarea {...register('bio')} rows={3} placeholder="Tell us about yourself..." className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Years of Experience</label>
            <input type="number" {...register('experience')} min={0} max={50} className={`${inputCls} w-32`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</label>
            <div className="flex gap-2 mb-3">
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add skill and press Enter" className={inputCls} />
              <button type="button" onClick={addSkill} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s} className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm px-2.5 py-1 rounded-full">
                  {s} <button type="button" onClick={() => setSkills(prev => prev.filter(i => i !== s))}><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 flex items-center gap-2">
            {saving && <Loader2 size={16} className="animate-spin" />} Save Changes
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
