import dayjs from 'dayjs';

export const computeProblemSummary = (submissions) => {
  if (!submissions || submissions.length === 0) return {};

  const today = dayjs();
  const solved = submissions.filter(p => p.rating && p.timestamp);
  const totalSolved = solved.length;

  const ratings = solved.map(p => p.rating);
  const avgRating = ratings.length
    ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length)
    : 0;

  const mostDifficult = solved.reduce((max, curr) =>
    !max || curr.rating > max.rating ? curr : max, null);

  const firstSubmissionDate = dayjs.unix(Math.min(...solved.map(p => p.timestamp)));
  const daysActive = Math.max(1, today.diff(firstSubmissionDate, 'day'));

  const avgPerDay = +(totalSolved / daysActive).toFixed(2);

  // Bucket counts
  const buckets = {};
  for (let i = 800; i <= 3500; i += 200) {
    buckets[`${i}-${i + 199}`] = 0;
  }

  ratings.forEach(rating => {
    const bucketStart = Math.floor(rating / 200) * 200;
    const key = `${bucketStart}-${bucketStart + 199}`;
    if (buckets[key] !== undefined) {
      buckets[key]++;
    }
  });

  // Heatmap data
  const heatmapMap = {};
  solved.forEach(p => {
    const date = dayjs.unix(p.timestamp).format("YYYY-MM-DD");
    heatmapMap[date] = (heatmapMap[date] || 0) + 1;
  });

  const heatmapData = Object.entries(heatmapMap).map(([date, count]) => ({ date, count }));

  return {
    mostDifficultSolved: mostDifficult ? {
      name: mostDifficult.problemName,
      rating: mostDifficult.rating,
      tags: mostDifficult.tags
    } : null,
    totalSolved,
    avgRating,
    avgPerDay,
    bucketCounts: buckets,
    heatmapData
  };
};
