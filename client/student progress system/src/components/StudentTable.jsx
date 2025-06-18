import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import { FiEye, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';
import axios from 'axios';
import StudentForm from './StudentForm'
import EditStudent from '../pages/EditStudent';

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

const StudentTable = ({ students, fetchStudents }) => {
  const [editId, setEditId] = useState(null);

  const [editDetails, setEditDetails] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const navigate = useNavigate();

  const deleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/students/${id}`);
      toast.success('Student deleted');
      fetchStudents(); // Refresh list
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const exportCSV = () => {
    const headers = ['Name,Email,Phone,Handle,Current Rating,Max Rating'];
    const rows = students.map(s =>
      `${s.fullName},${s.email},${s.phoneNumber},${s.cfHandle},${s.curRating},${s.maxRating}`
    );
    const csv = headers.concat(rows).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'students.csv');
  };

  const filtered = students.filter(s =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.cfHandle.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / studentsPerPage);
  const displayedStudents = filtered.slice((currentPage - 1) * studentsPerPage, currentPage * studentsPerPage);

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, email or handle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-full sm:max-w-md dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <FiDownload /> Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm border dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 text-left text-sm">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Handle</th>
              <th className="p-2">Current</th>
              <th className="p-2">Max</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedStudents.map((s) => (
              <tr key={s._id} className="border-t dark:border-gray-700">
                <td className="p-2">{s.fullName}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.phoneNumber}</td>
                <td className="p-2">{s.cfHandle}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getRatingColor(s.curRating)}`}
                  >
                    {s.curRating ?? '-'}
                  </span>
                </td>
                <td className="p-2">{s.maxRating ?? '-'}</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/students/${s._id}`)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <FiEye />
                    </button>
                    <button
                    //  onClick={() => navigate(`students/edit/${s._id}`)}
                     onClick={() => setEditId(s._id)}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Edit"
                    >
                      <FiEdit />
                    </button>

                    <button
                      onClick={() => deleteStudent(s._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center flex-wrap mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={`px-3 py-1 rounded border dark:border-gray-600 ${p === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {p}
          </button>
        ))}
      </div>
      {editId && (
        <EditStudent
          studentId={editId}
          onClose={() => setEditId(null)}
          onSuccess={() => {
            fetchStudents();
            setEditId(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentTable;
