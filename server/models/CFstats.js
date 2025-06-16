import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema({
  contestId: Number,
  contestName: String,
  rank: Number,
  oldRating: Number,
  newRating: Number,
  ratingUpdateTimeSeconds: Number,
  unsolvedCount: Number,
});

const submissionSchema = new mongoose.Schema({
  problemId: String,
  problemName: String,
  rating: Number,
  verdict: String,
  language: String,
  tags: [String],
  timestamp: Number,
});

const problemSummarySchema = new mongoose.Schema({
  mostDifficultSolved: {
    name: String,
    rating: Number,
    link: String,
  },
  totalSolved: Number,
  avgRating: Number,
  avgPerDay: Number,
  bucketCounts: {
    type: Map,
    of: Number,
  },
  heatmapData: [
    {
      date: String, 
      count: Number,
    }
  ],
});

const cfStatsSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  contestHistory: [contestSchema],
  submissionStats: [submissionSchema],
  problemSummary: problemSummarySchema,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true });

export default mongoose.model('CFStats', cfStatsSchema);
