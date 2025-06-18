import cron from 'node-cron';
import Student from '../models/Student.js';
import CFStats from '../models/CFstats.js';
import { fetchCfData } from '../utils/cfService.js';
import { sendReminderEmail } from '../utils/sendReminderEmail.js';

export const startCFDataSyncJob = () => {
  cron.schedule('0 2 * * *', async () => {
    console.log("Running daily Codeforces sync at 2 AM...");

    const students = await Student.find({});
    const now = Date.now();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

    for (let student of students) {
      try {
        if (!student.cfHandle) {
          console.warn(`Missing handle for ${student.fullName}`);
          continue;
        }

        const cfData = await fetchCfData(student.cfHandle);

        const stats = await CFStats.findOneAndUpdate(
          { studentId: student._id },
          { ...cfData },
          { upsert: true, new: true }
        );

        student.curRating = cfData.curRating;
        student.maxRating = cfData.maxRating;
        student.lastSyncedAt = new Date();

        // Check if inactive in last 7 days
        const recent = stats.submissionStats?.some(sub => {
          return now - sub.timestamp * 1000 <= SEVEN_DAYS;
        });

        if (!recent && !student.emailDisabled) {
          await sendReminderEmail(student.email, student.fullName);
          student.reminderCount = (student.reminderCount || 0) + 1;
          console.log(`Sent reminder to ${student.fullName}`);
        }

        await student.save();

      } catch (err) {
        console.error(`Failed for ${student.cfHandle}:`, err.message);
      }
    }

    console.log("Daily sync completed.");
  });
};
