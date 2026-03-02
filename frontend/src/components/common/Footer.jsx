import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap, Mail, Globe } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-1 mb-4">
            <span className="text-2xl font-bold text-blue-400">CAREERS</span>
            <span className="text-2xl font-bold text-white">TIDEZ</span>
          </div>
          <p className="text-sm text-gray-400 max-w-xs">
            Your global gateway to career opportunities and world-class education. Connect with top employers and universities worldwide.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2"><Briefcase size={16} /> Jobs</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/jobs" className="hover:text-white transition">Browse Jobs</Link></li>
            <li><Link to="/jobs?jobType=remote" className="hover:text-white transition">Remote Jobs</Link></li>
            <li><Link to="/jobs?jobType=internship" className="hover:text-white transition">Internships</Link></li>
            <li><Link to="/post-job" className="hover:text-white transition">Post a Job</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2"><GraduationCap size={16} /> Study Abroad</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/study-abroad" className="hover:text-white transition">Universities</Link></li>
            <li><Link to="/programs" className="hover:text-white transition">Programs</Link></li>
            <li><Link to="/scholarships" className="hover:text-white transition">Scholarships</Link></li>
          </ul>
        </div>
      </div>
      <hr className="border-gray-800 mt-8 mb-6" />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} CAREERSTIDEZ. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="mailto:info@careerstidez.com" className="flex items-center gap-1 hover:text-white transition"><Mail size={14} /> info@careerstidez.com</a>
          <a href="https://careerstidez.com" className="flex items-center gap-1 hover:text-white transition"><Globe size={14} /> careerstidez.com</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
