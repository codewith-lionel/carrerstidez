const Job = require('../models/Job');

// Skill-matching based recommendation algorithm
exports.getRecommendations = async (user) => {
  if (!user.skills || user.skills.length === 0) {
    return Job.find({ status: 'active' }).sort('-createdAt').limit(10).populate('recruiter', 'name company');
  }

  // Score jobs based on skill overlap with user's skills
  const jobs = await Job.find({ status: 'active' }).populate('recruiter', 'name company');

  const userSkills = user.skills.map(s => s.toLowerCase());

  const scoredJobs = jobs.map(job => {
    const jobSkills = (job.skills || []).map(s => s.toLowerCase());
    const matchCount = userSkills.filter(skill => jobSkills.includes(skill)).length;
    const score = jobSkills.length > 0 ? matchCount / jobSkills.length : 0;

    // Boost score for matching experience level
    let expBoost = 0;
    if (user.experience >= job.experience.min && user.experience <= job.experience.max) {
      expBoost = 0.2;
    }

    return { job, score: score + expBoost };
  });

  // Sort by score descending, take top 10
  return scoredJobs
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(item => item.job);
};
