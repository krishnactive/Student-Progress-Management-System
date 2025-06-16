import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

export const getStudents = () => API.get('/students');
export const getStudentById = (id) => API.get(`/students/${id}`);
export const addStudent = (data) => API.post('/students', data);
