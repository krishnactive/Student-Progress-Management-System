import axios from 'axios';
import { computeProblemSummary } from './problemSummary.js';

const getUserRating = async (handle) => {
  const url = `https://codeforces.com/api/user.rating?handle=${handle}`;
  const res = await axios.get(url);
  return res.data.result;
};

const getUserSubmissions = async (handle) => {
  const url = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1000`;
  const res = await axios.get(url);
  return res.data.result;
};

export const fetchCfData = async (handle) => {
  try {
    const [ratingData, submissions] = await Promise.all([
      getUserRating(handle),
      getUserSubmissions(handle),
    ]);

    let curRating = 0;
    let maxRating = 0;
    let contestHistory = [];

    if (ratingData.length > 0) {
      curRating = ratingData.at(-1).newRating;
      maxRating = Math.max(...ratingData.map(r => r.newRating));

      contestHistory = ratingData.map(c => ({
        contestId: c.contestId,
        contestName: c.contestName,
        rank: c.rank,
        oldRating: c.oldRating,
        newRating: c.newRating,
        ratingUpdateTimeSeconds: c.ratingUpdateTimeSeconds,
        unsolvedCount: 0,
      }));
    }

    const accepted = submissions.filter(s => s.verdict === "OK");

    const submissionStats = accepted.map(sub => ({
      problemId: `${sub.problem.contestId}-${sub.problem.index}`,
      problemName: sub.problem.name,
      rating: sub.problem.rating || 0,
      verdict: sub.verdict,
      language: sub.programmingLanguage,
      tags: sub.problem.tags,
      timestamp: sub.creationTimeSeconds,
    }));

    const problemSummary = computeProblemSummary(submissionStats);

    return {
      curRating,
      maxRating,
      contestHistory,
      submissionStats,
      problemSummary,
      updatedAt: new Date(),
    };
  } catch (err) {
    console.error("CF API ERROR:", err.message);
    throw new Error("Failed to fetch Codeforces data");
  }
};
