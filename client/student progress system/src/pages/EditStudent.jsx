import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditStudentModal = ({ studentId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    cfHandle: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/students/${studentId}`);
        setFormData({
          fullName: res.data.fullName,
          email: res.data.email,
          phoneNumber: res.data.phoneNumber,
          cfHandle: res.data.cfHandle
        });
      } catch (err) {
        toast.error('Failed to load student data');
        onClose(); // close if data fails to load
      }
    };

    if (studentId) fetchStudent();
  }, [studentId]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/students/${studentId}`, formData);
      toast.success('Student updated');
      onSuccess(); // refetch students
      onClose();   // close modal
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded p-6 w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">Edit Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          {/* <input
            type="text"
            name="cfHandle"
            value={formData.cfHandle}
            onChange={handleChange}
            placeholder="Codeforces Handle"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          /> */}

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
