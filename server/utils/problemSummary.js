import dayjs from 'dayjs';

export const computeProblemSummary = (submissions = []) => {
  if (submissions.length === 0) return getDefaultSummary();

  const today = dayjs();

  const validSolved = submissions.filter(p => p.rating && p.timestamp);
  const totalSolved = validSolved.length;

  if (totalSolved === 0) return getDefaultSummary();

  // === Average Rating ===
  const ratings = validSolved.map(p => p.rating);
  const avgRating = Math.round(ratings.reduce((sum, r) => sum + r, 0) / ratings.length);

  // === Most Difficult Problem ===
  const mostDifficult = validSolved.reduce((max, curr) =>
    !max || curr.rating > max.rating ? curr : max, null);

  // === Activity Metrics ===
  const earliestTimestamp = Math.min(...validSolved.map(p => p.timestamp));
  const firstSubmissionDate = dayjs.unix(earliestTimestamp);
  const daysActive = Math.max(1, today.diff(firstSubmissionDate, 'day'));
  const avgPerDay = +(totalSolved / daysActive).toFixed(2);

  // === Rating Buckets ===
  const bucketCounts = {};
  for (let i = 800; i <= 3500; i += 200) {
    const label = `${i}-${i + 199}`;
    bucketCounts[label] = 0;
  }
  for (const r of ratings) {
    const bucket = `${Math.floor(r / 200) * 200}-${Math.floor(r / 200) * 200 + 199}`;
    if (bucketCounts[bucket] !== undefined) bucketCounts[bucket]++;
  }

  // === Heatmap Data ===
  const heatmapMap = {};
  for (const p of validSolved) {
    const date = dayjs.unix(p.timestamp).format('YYYY-MM-DD');
    heatmapMap[date] = (heatmapMap[date] || 0) + 1;
  }

  const heatmapData = Object.entries(heatmapMap).map(([date, count]) => ({ date, count }));

  return {
    totalSolved,
    avgRating,
    avgPerDay,
    mostDifficultSolved: mostDifficult && {
      name: mostDifficult.problemName,
      rating: mostDifficult.rating,
      tags: mostDifficult.tags || []
    },
    bucketCounts,
    heatmapData
  };
};

// Default summary for fallback
function getDefaultSummary() {
  const emptyBuckets = {};
  for (let i = 800; i <= 3500; i += 200) {
    emptyBuckets[`${i}-${i + 199}`] = 0;
  }

  return {
    totalSolved: 0,
    avgRating: 0,
    avgPerDay: 0,
    mostDifficultSolved: null,
    bucketCounts: emptyBuckets,
    heatmapData: []
  };
}
