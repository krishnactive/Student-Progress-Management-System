import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentTable from '../components/StudentTable';
import StudentForm from '../components/StudentForm';
import {FiPlus} from 'react-icons/fi';
const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchStudents = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/students`);
    // console.log('Fetched students:', res.data);
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Progress Tracker</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          <FiPlus className="text-lg" />
          <span>Add Student</span>
        </button>
      </div>

      <StudentTable students={students} />

      {showForm && (
        <StudentForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchStudents();
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
