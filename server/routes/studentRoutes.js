import express from 'express';
import { addStudent, getAllStudents, getStudentProfile, deleteStudent } from '../controllers/studentController.js';

const router = express.Router();

router.post('/', addStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentProfile);
router.delete('/:id', deleteStudent);


export default router;
