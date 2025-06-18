import { useState, useMemo } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Bar } from 'react-chartjs-2';
import 'react-calendar-heatmap/dist/styles.css';
import dayjs from 'dayjs';
import HeatmapCalendar from './HeatmapCalendar'

const ProblemSummary = ({ summary, submissions }) => {
  const [days, setDays] = useState('30');

  const filtered = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    const duration = parseInt(days) * 86400;
    return submissions.filter(s => now - s.timestamp <= duration);
  }, [days, submissions]);

  const barBuckets = {};
  filtered.forEach((s) => {
    const r = s.rating || 0;
    const bucket = Math.floor(r / 100) * 100;
    barBuckets[bucket] = (barBuckets[bucket] || 0) + 1;
  });

  const barData = {
    labels: Object.keys(barBuckets),
    datasets: [
      {
        label: 'Problems Solved',
        data: Object.values(barBuckets),
        backgroundColor: '#10b981',
      },
    ],
  };

  const heatmapData = filtered.map(s => ({
    date: dayjs.unix(s.timestamp).format('YYYY-MM-DD'),
    count: 1,
  }));

  const dateRangeStart = dayjs().subtract(parseInt(days), 'day').toDate();
  const dateRangeEnd = dayjs().toDate();

  const mostDifficult = filtered.reduce((a, b) => (b.rating > (a?.rating || 0) ? b : a), null);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">🧠 Problem Summary</h2>
        <select
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="border rounded px-2 py-1 dark:bg-gray-800"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>

      <div className="text-sm space-y-1 mb-4">
        <p><strong>Total Solved:</strong> {filtered.length}</p>
        <p><strong>Average Per Day:</strong> {(filtered.length / parseInt(days)).toFixed(2)}</p>
        <p><strong>Average Rating:</strong> {filtered.length ? Math.round(filtered.reduce((sum, s) => sum + (s.rating || 0), 0) / filtered.length) : 0}</p>
        <p><strong>Most Difficult Solved:</strong> {mostDifficult?.problemName || 'N/A'} ({mostDifficult?.rating || '-'})</p>
      </div>

      <div className="mb-6">
        <Bar data={barData} />
      </div>

      <CalendarHeatmap
        startDate={dateRangeStart}
        endDate={dateRangeEnd}
        values={heatmapData}
        classForValue={(value) => {
          if (!value) return 'color-empty';
          if (value.count >= 3) return 'color-github-4';
          if (value.count >= 2) return 'color-github-3';
          return 'color-github-2';
        }}
        tooltipDataAttrs={(value) =>
          value.date ? { 'data-tip': `${value.date} – ${value.count} solved` } : {}
        }
        showWeekdayLabels
      />
      {/* <HeatmapCalendar data={heatmapData} /> */}

    </div>
  );
};

export default ProblemSummary;
