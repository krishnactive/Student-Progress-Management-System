import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import dayjs from 'dayjs';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const timeFilters = {
  '30': 30 * 86400,
  '90': 90 * 86400,
  '365': 365 * 86400,
};

const ContestChart = ({ contests }) => {
  const [days, setDays] = useState('90');

  const now = Math.floor(Date.now() / 1000);
  const filtered = contests.filter(c => now - c.ratingUpdateTimeSeconds <= timeFilters[days]);

  const data = {
    labels: filtered.map(c => dayjs.unix(c.ratingUpdateTimeSeconds).format('MMM D, YYYY')),
    datasets: [
      {
        label: 'Rating',
        data: filtered.map(c => c.newRating),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        pointBackgroundColor: '#3b82f6',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">📈 Contest History</h2>
        <select
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="365">Last 365 Days</option>
        </select>
      </div>

      {filtered.length > 0 ? (
        <>
          <div className="w-full overflow-x-auto">
            <Line data={data} />
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b dark:border-gray-700 text-gray-600 dark:text-gray-300">
                  <th className="py-2 pr-4">Contest</th>
                  <th className="py-2 pr-4">Rank</th>
                  <th className="py-2 pr-4">Change</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, idx) => {
                  const change = c.newRating - c.oldRating;
                  const isPositive = change >= 0;
                  return (
                    <tr key={idx} className="border-b dark:border-gray-800">
                      <td className="py-2 pr-4 whitespace-nowrap text-gray-800 dark:text-gray-100">
                        {c.contestName}
                      </td>
                      <td className="py-2 pr-4 text-gray-700 dark:text-gray-300">{c.rank}</td>
                      <td className={`py-2 pr-4 font-medium flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <FaArrowUp className="inline" /> : <FaArrowDown className="inline" />}
                        {change}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-6">
          No contests in the last {days} days.
        </div>
      )}
    </div>
  );
};

export default ContestChart;
