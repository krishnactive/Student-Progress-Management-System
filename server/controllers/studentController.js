import Student from '../models/Student.js'
import CFstats from '../models/CFstats.js'
import {fetchCfData} from '../utils/cfService.js'

export const addStudent = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, cfHandle } = req.body;
    const existing = await Student.findOne({ cfHandle });
    if (existing) {
      return res.status(400).json({ message: "Profile already added" });
    }

    const student = await Student.create({ fullName, email, phoneNumber, cfHandle });

    const cfstats = await fetchCfData(cfHandle);

    await CFstats.create({
      studentId: student._id,
      ...cfstats,
    });

    student.curRating = cfstats.curRating;
    student.maxRating = cfstats.maxRating;
    student.avatar = cfstats.avatar;
    student.rank = cfstats.rank;
    student.maxRank = cfstats.maxRank;
    student.cfName = cfstats.cfName;
    student.lastSyncedAt = new Date();

    await student.save();

    return res.status(201).json({ message: "Student added successfully" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    const enriched = await Promise.all(
      students.map(async (student) => {
        const cfStats = await CFstats.findOne({ studentId: student._id });
        return {
          ...student.toObject(),
          cfStats,
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    const cfStats = await CFstats.findOne({ studentId: req.params.id });

    if (!student || !cfStats) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      student,
      cfStats
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching student profile", error: err.message });
  }
};

// DELETE /api/students/:id
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    await CFstats.findOneAndDelete({ studentId: id });
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete student' });
  }
};

export const updateStudent = async (req, res)=>{
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Student not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
