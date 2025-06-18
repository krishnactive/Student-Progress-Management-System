import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ContestChart from '../components/ContestChart';
import ProblemSummary from '../components/ProblemSummary';

const ProfilePage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/students/${id}`);
      setStudent({
        ...res.data.student,
        cfStats: res.data.cfStats
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [id]);


  const getRatingColor = (rating) => {
    if (!rating) return 'bg-gray-400';
    if (rating >= 2400) return 'bg-red-600';
    if (rating >= 2100) return 'bg-orange-500';
    if (rating >= 1900) return 'bg-purple-600';
    if (rating >= 1600) return 'bg-blue-600';
    if (rating >= 1400) return 'bg-cyan-600';
    if (rating >= 1200) return 'bg-green-600';
    return 'bg-gray-500';
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  if (loading) return <div className="p-6 text-center">Loading profile...</div>;
  if (!student) return <div className="p-6 text-center text-red-500">Profile not found.</div>;

const {
  fullName,
  email,
  phoneNumber,
  cfHandle,
  cfStats,
  curRating,
  maxRating,
  updatedAt,
  avatar,
  rank,
  maxRank,
  cfName,
} = student;
const { contestHistory, submissionStats } = cfStats || {};
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <p>{rank}adcdscadscasd</p>
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 flex flex-col sm:flex-row sm:items-center gap-6">
       {avatar ? (
  <img
    src={avatar}
    alt="avatar"
    className="w-20 h-20 rounded-full object-cover border border-gray-300 dark:border-gray-700"
  />
) : (
  <div className="w-20 h-20 flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-100 rounded-full text-3xl font-bold uppercase">
    {fullName?.charAt(0)}
  </div>
)}

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{fullName}</h1>
          <p className="text-gray-600 dark:text-gray-300">📧 {email}</p>
          <p className="text-gray-600 dark:text-gray-300">📱 {phoneNumber}</p>
          <p className="text-gray-600 dark:text-gray-300">
            🧑‍💻 Handle:
            <a
              href={`https://codeforces.com/profile/${cfHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-blue-500 hover:underline"
            >
              {cfHandle}
            </a>
          </p>
          {cfName && (
  <p className="text-gray-600 dark:text-gray-300">🧾 Name: {cfName}</p>
)}
{rank && (
  <p className="text-gray-600 dark:text-gray-300">
    🏅 Rank: <span className="capitalize">{rank}</span>
  </p>
)}
{maxRank && (
  <p className="text-gray-600 dark:text-gray-300">
    🔥 Max Rank: <span className="capitalize">{maxRank}</span>
  </p>
)}


          {cfStats && (
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <span
                className={`text-white px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(
                  curRating
                )}`}
              >
                {curRating ?? '-'} Rating
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Max: {maxRating ?? '-'}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last Synced: {updatedAt ? formatDate(updatedAt) : 'N/A'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Contest Chart */}
      {contestHistory?.length > 0 && (
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-4">
          
          <ContestChart contests={contestHistory} />
        </div>
      )}

      {/* Problem Summary */}
      {submissionStats?.length > 0 && (
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-4">
          <ProblemSummary summary={cfStats.problemSummary} submissions={submissionStats} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
