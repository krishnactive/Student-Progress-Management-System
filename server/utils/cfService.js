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

const getUserInfo = async (handle) => {
  const url = `https://codeforces.com/api/user.info?handles=${handle}`;
  const res = await axios.get(url);
  return res.data.result[0];
};

export const fetchCfData = async (handle) => {
  try {
    const [ratingData, submissions, userInfo] = await Promise.all([
      getUserRating(handle),
      getUserSubmissions(handle),
      getUserInfo(handle),
    ]);

    // Ratings
    const curRating = userInfo.rating ?? 0;
    const maxRating = userInfo.maxRating ?? 0;

    // Contest history
    const contestHistory = ratingData.map((c) => ({
      contestId: c.contestId,
      contestName: c.contestName,
      rank: c.rank,
      oldRating: c.oldRating,
      newRating: c.newRating,
      ratingUpdateTimeSeconds: c.ratingUpdateTimeSeconds,
      unsolvedCount: 0,
    }));

    // Submissions - only accepted ones
    const accepted = submissions.filter((s) => s.verdict === 'OK');

    const submissionStats = accepted.map((sub) => ({
      problemId: `${sub.problem.contestId}-${sub.problem.index}`,
      problemName: sub.problem.name,
      rating: sub.problem.rating || 0,
      verdict: sub.verdict,
      language: sub.programmingLanguage,
      tags: sub.problem.tags,
      timestamp: sub.creationTimeSeconds,
    }));

    const problemSummary = computeProblemSummary(submissionStats);

    // Extracted profile data
    const profile = {
      avatar: userInfo.avatar || 'https://userpic.codeforces.org/no-avatar.jpg',
      rank: userInfo.rank || '',
      maxRank: userInfo.maxRank || '',
      cfName: `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim(),
    };

    return {
      curRating,
      maxRating,
      contestHistory,
      submissionStats,
      problemSummary,
      updatedAt: new Date(),
      ...profile,
    };
  } catch (err) {
    console.error('CF API ERROR:', err.message);
    throw new Error('Failed to fetch Codeforces data');
  }
};
