import cron from 'node-cron';
import Student from '../models/Student.js';
import CFStats from '../models/CFstats.js';
import { fetchCfData } from '../utils/cfService.js';

export const startCFDataSyncJob = () => {
  cron.schedule('0 2 * * *', async () => {
    console.log("🔁 Running daily Codeforces sync at 2 AM...");

    const students = await Student.find({});

    for (let student of students) {
      try {
        const cfData = await fetchCfData(student.codeforcesHandle);

        await CFStats.findOneAndUpdate(
          { student: student._id },
          { ...cfData },
          { upsert: true }
        );

        student.currentRating = cfData.currentRating;
        student.maxRating = cfData.maxRating;
        await student.save();

      } catch (err) {
        console.error(`❌ Failed for ${student.codeforcesHandle}:`, err.message);
      }
    }

    console.log("✅ Daily sync completed.");
  });
};
