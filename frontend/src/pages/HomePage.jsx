import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap, Globe, Award, TrendingUp, Users } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const stats = [
  { icon: Briefcase, label: 'Jobs Posted', value: '50,000+' },
  { icon: GraduationCap, label: 'Universities', value: '2,000+' },
  { icon: Globe, label: 'Countries', value: '150+' },
  { icon: Users, label: 'Users', value: '500,000+' },
];

const features = [
  {
    icon: Briefcase,
    title: 'Global Job Portal',
    desc: 'Search and apply for jobs worldwide. AI-powered recommendations match you with the best opportunities.',
    color: 'bg-blue-50 text-blue-600',
    link: '/jobs',
  },
  {
    icon: GraduationCap,
    title: 'Study Abroad Programs',
    desc: 'Explore universities, programs, and scholarships across the globe. Filter by country, degree, and budget.',
    color: 'bg-green-50 text-green-600',
    link: '/study-abroad',
  },
  {
    icon: Award,
    title: 'Scholarships',
    desc: 'Discover funding opportunities. Browse full and partial scholarships from universities worldwide.',
    color: 'bg-purple-50 text-purple-600',
    link: '/scholarships',
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    desc: 'Build your resume, track applications, and get insights to accelerate your career journey.',
    color: 'bg-orange-50 text-orange-600',
    link: '/dashboard',
  },
];

const HomePage = () => (
  <MainLayout>
    {/* Hero */}
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Your Global Gateway to <br />
          <span className="text-yellow-400">Careers & Education</span>
        </h1>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Connect with top employers worldwide and explore world-class universities. Your future starts here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/jobs" className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-blue-50 transition shadow-lg">
            🔍 Explore Jobs
          </Link>
          <Link to="/study-abroad" className="border-2 border-white text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-700 transition">
            🎓 Study Abroad
          </Link>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-2">
                <Icon className="text-blue-600" size={32} />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Everything You Need</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          A comprehensive platform for job seekers, students, and recruiters.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(({ icon: Icon, title, desc, color, link }) => (
          <Link key={title} to={link} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border dark:border-gray-800 hover:shadow-md transition group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <Icon size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
          </Link>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-blue-100 mb-8 text-lg">Join 500,000+ professionals and students already using CAREERSTIDEZ.</p>
        <Link to="/register" className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-blue-50 transition inline-block">
          Create Free Account
        </Link>
      </div>
    </section>
  </MainLayout>
);

export default HomePage;
