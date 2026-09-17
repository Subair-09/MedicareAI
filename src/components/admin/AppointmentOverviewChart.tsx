import React, { useState, useMemo } from 'react';
import { LineChart as ChartIcon } from 'lucide-react';
import { Appointment } from '../../types';

type TimeFilter = '7 Days' | '30 Days' | '3 Months';

interface ChartPoint {
  date: string;
  count: number;
}

interface AppointmentOverviewChartProps {
  appointments?: Appointment[];
}

export const AppointmentOverviewChart: React.FC<AppointmentOverviewChartProps> = ({
  appointments = [],
}) => {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('7 Days');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Helper to parse appointment date into Date object
  const parseApptDate = (dateStr: string): Date => {
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  // Dynamically compute chart points from real appointments
  const { data7Days, data30Days, data3Months } = useMemo(() => {
    // 1. Last 7 Days
    // Determine the reference date (latest appointment date or today)
    let refDate = new Date();
    if (appointments.length > 0) {
      const dates = appointments.map((a) => parseApptDate(a.date).getTime());
      const maxTime = Math.max(...dates);
      if (!isNaN(maxTime) && maxTime > 0) {
        refDate = new Date(maxTime);
      }
    }

    const d7: ChartPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(refDate);
      d.setDate(d.getDate() - i);
      const dayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const count = appointments.filter((a) => {
        const apptDate = parseApptDate(a.date);
        return (
          apptDate.getFullYear() === d.getFullYear() &&
          apptDate.getMonth() === d.getMonth() &&
          apptDate.getDate() === d.getDate()
        );
      }).length;

      d7.push({ date: dayLabel, count });
    }

    // 2. 30 Days (4 weekly buckets)
    const d30: ChartPoint[] = [
      { date: 'Week 1', count: 0 },
      { date: 'Week 2', count: 0 },
      { date: 'Week 3', count: 0 },
      { date: 'Week 4', count: 0 },
    ];

    appointments.forEach((a) => {
      const apptDate = parseApptDate(a.date);
      const diffDays = Math.floor((refDate.getTime() - apptDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 28) {
        if (diffDays <= 7) d30[3].count++;
        else if (diffDays <= 14) d30[2].count++;
        else if (diffDays <= 21) d30[1].count++;
        else d30[0].count++;
      }
    });

    // 3. 3 Months
    const d3m: ChartPoint[] = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date(refDate);
      d.setMonth(d.getMonth() - i);
      const monthLabel = d.toLocaleDateString('en-US', { month: 'long' });
      
      const count = appointments.filter((a) => {
        const apptDate = parseApptDate(a.date);
        return (
          apptDate.getFullYear() === d.getFullYear() &&
          apptDate.getMonth() === d.getMonth()
        );
      }).length;

      d3m.push({ date: monthLabel, count });
    }

    return { data7Days: d7, data30Days: d30, data3Months: d3m };
  }, [appointments]);

  const currentData =
    activeFilter === '7 Days'
      ? data7Days
      : activeFilter === '30 Days'
      ? data30Days
      : data3Months;

  // Chart dimensions in SVG viewBox coordinate space
  const width = 640;
  const height = 260;
  const paddingLeft = 36;
  const paddingRight = 24;
  const paddingTop = 28;
  const paddingBottom = 42;

  const maxDataCount = Math.max(...currentData.map((d) => d.count), 0);
  const yMax = maxDataCount <= 4 ? 4 : maxDataCount <= 8 ? 8 : maxDataCount <= 16 ? 16 : Math.ceil(maxDataCount * 1.25);
  const yTicks = [0, Math.round(yMax * 0.25), Math.round(yMax * 0.5), Math.round(yMax * 0.75), yMax];

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Calculate coordinates
  const points = currentData.map((d, index) => {
    const x =
      paddingLeft +
      (index / (currentData.length - 1 || 1)) * chartWidth;
    const y =
      paddingTop +
      chartHeight -
      ((d.count || 0) / yMax) * chartHeight;
    return { x, y, ...d };
  });

  // Generate smooth SVG Catmull-Rom or cubic bezier curve
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i !== pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = generateSmoothPath(points);

  // Area path closing at baseline
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${
          paddingTop + chartHeight
        } L ${points[0].x} ${paddingTop + chartHeight} Z`
      : '';

  const activePoint =
    hoveredIndex !== null && points[hoveredIndex]
      ? points[hoveredIndex]
      : points[points.length - 1] || points[0];

  return (
    <div className="bg-white rounded-[12px] border border-[#E1EDF9] p-5 sm:p-5.5 shadow-2xs text-left flex flex-col justify-between h-full">
      {/* Header with Title and Filter Tabs */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-[#EAF4FF] text-[#0878F9] flex items-center justify-center shrink-0">
            <ChartIcon className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-[15.5px] sm:text-[16px] font-bold text-[#102A52] tracking-tight">
              Appointment Overview
            </h2>
            <p className="text-[11.5px] text-[#5879A6] font-medium">
              Real-time trend analysis from registered visits
            </p>
          </div>
        </div>

        {/* Time Filters: 7 Days / 30 Days / 3 Months */}
        <div className="flex items-center gap-1 bg-[#F8FBFF] p-1 rounded-[10px] border border-[#E1EDF9]">
          {(['7 Days', '30 Days', '3 Months'] as TimeFilter[]).map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setActiveFilter(filter);
                  setHoveredIndex(null);
                }}
                className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-[7px] transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0878F9] text-white shadow-2xs'
                    : 'text-[#5879A6] hover:text-[#102A52] hover:bg-white'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Responsive Chart Container */}
      <div className="relative w-full aspect-[640/260] min-h-[200px] mt-1 select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Soft Blue Gradient for Area Under the Curve */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0878F9" stopOpacity="0.18" />
              <stop offset="85%" stopColor="#0878F9" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#0878F9" stopOpacity="0.00" />
            </linearGradient>

            {/* Drop shadow for pinned tooltip */}
            <filter id="tooltipShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#102A52" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Horizontal Grid Lines & Y-Axis Labels */}
          {yTicks.map((tick) => {
            const y = paddingTop + chartHeight - (tick / yMax) * chartHeight;
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#EDF4FB"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="11"
                  fontWeight="500"
                  fill="#94A3B8"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Primary Healthcare Blue Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#0878F9"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X-Axis Date Labels & Interactive Hover Columns */}
          {points.map((pt, idx) => (
            <g key={pt.date}>
              {/* X-Axis Label */}
              <text
                x={pt.x}
                y={height - 10}
                textAnchor="middle"
                fontSize="11"
                fontWeight="500"
                fill="#94A3B8"
              >
                {pt.date}
              </text>

              {/* Transparent Column for Easy Hover */}
              <rect
                x={pt.x - 20}
                y={paddingTop}
                width="40"
                height={chartHeight + 10}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
              />
            </g>
          ))}

          {/* Highlighted Active Data Point Dot */}
          {activePoint && (
            <g>
              {/* Outer soft glow ring */}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="7"
                fill="#0878F9"
                fillOpacity="0.2"
              />
              {/* Solid inner blue dot with white border */}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="4.5"
                fill="#0878F9"
                stroke="#FFFFFF"
                strokeWidth="2"
              />

              {/* Pinned Floating Tooltip */}
              <g transform={`translate(${activePoint.x}, ${activePoint.y - 48})`}>
                {/* Tooltip Background Card */}
                <rect
                  x="-55"
                  y="-12"
                  width="110"
                  height="42"
                  rx="8"
                  fill="#FFFFFF"
                  stroke="#E1EDF9"
                  strokeWidth="1"
                  filter="url(#tooltipShadow)"
                />

                {/* Small indicator pointer arrow below card */}
                <polygon
                  points="-5,30 5,30 0,35"
                  fill="#FFFFFF"
                  stroke="#E1EDF9"
                  strokeWidth="1"
                />
                {/* Hide top border overlap */}
                <line x1="-4" y1="29.5" x2="4" y2="29.5" stroke="#FFFFFF" strokeWidth="1.5" />

                {/* Tooltip Text: Date & Count */}
                <text
                  x="0"
                  y="2"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#5879A6"
                >
                  {activePoint.date}
                </text>
                <text
                  x="0"
                  y="18"
                  textAnchor="middle"
                  fontSize="11.5"
                  fontWeight="800"
                  fill="#102A52"
                >
                  {activePoint.count} appointments
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
