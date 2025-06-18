import { HeatmapRect } from '@visx/heatmap';
import { scaleLinear, scaleBand } from '@visx/scale';
import { Group } from '@visx/group';
import dayjs from 'dayjs';
// import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

const CELL_SIZE = 12;
const CELL_GAP = 2;

const HeatmapCalendar = ({ data, width = 800, height = 120 }) => {
  const days = Array.from({ length: 7 }, (_, i) => i);
  const weeks = Array.from({ length: 53 }, (_, i) => i);

  const xScale = scaleBand({
    domain: weeks.map(String),
    range: [0, weeks.length * (CELL_SIZE + CELL_GAP)],
    padding: 0.05,
  });

  const yScale = scaleBand({
    domain: days.map(String),
    range: [0, days.length * (CELL_SIZE + CELL_GAP)],
    padding: 0.05,
  });

  // Convert raw submission dates into a grid map
  const dateMap = new Map();
  data.forEach(d => {
    const date = dayjs(d.date);
    const week = date.week();
    const day = date.day();
    const key = `${week}-${day}`;
    dateMap.set(key, (dateMap.get(key) || 0) + 1);
  });

  const getColor = (count) => {
    if (count >= 3) return '#166534'; // dark green
    if (count >= 2) return '#22c55e'; // medium green
    if (count >= 1) return '#bbf7d0'; // light green
    return '#e5e7eb'; // gray
  };

  return (
    <svg width={width} height={height}>
      <Group top={20} left={20}>
        {weeks.map((w, wi) =>
          days.map((d, di) => {
            const key = `${w}-${d}`;
            const count = dateMap.get(key) || 0;
            return (
              <rect
                key={key}
                x={xScale(String(wi))}
                y={yScale(String(d))}
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill={getColor(count)}
              />
            );
          })
        )}
      </Group>
    </svg>
  );
};

export default HeatmapCalendar;
