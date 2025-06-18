import express from 'express';
import { addStudent, getAllStudents, getStudentProfile, deleteStudent, updateStudent } from '../controllers/studentController.js';

const router = express.Router();

router.post('/', addStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentProfile);
router.delete('/:id', deleteStudent);
router.put('/:id', updateStudent);

export default router;
