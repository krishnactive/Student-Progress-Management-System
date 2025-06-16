import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ContestChart from './ContestChart';
import ProblemSummary from './ProblemSummary';

const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/students/${id}`);
        // Merge student and cfStats as one object
        setStudent({
          ...res.data.student,
          cfStats: res.data.cfStats,
        });
      } catch (err) {
        console.error('Failed to fetch student profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!student) return <div className="p-4 text-red-500">Student not found</div>;

  const { fullName, email, phoneNumber, cfHandle, cfStats } = student;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{fullName}</h1>
      <p className="text-gray-600 dark:text-gray-400">{email} • CF Handle: <strong>{cfHandle}</strong></p>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Current Rating: {cfStats?.curRating ?? 'N/A'} | Max: {cfStats?.maxRating ?? 'N/A'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded p-4 shadow">
          <ContestChart contests={cfStats?.contestHistory || []} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded p-4 shadow">
          <ProblemSummary summary={cfStats?.problemSummary || {}} submissions={cfStats?.submissionStats || []} />
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
