import { useId, useState } from 'react';
import cn from '../../lib/cn';
import { SERIES_COLOURS } from '../../lib/chartColours';
import './charts.css';

/**
 * Charts are hand-rolled SVG rather than a charting library.
 *
 * Three chart types did not justify the dependency, and drawing them here
 * means they inherit the design tokens directly — including dark mode, which
 * most libraries need to be re-themed for.
 */

/* ==========================================================================
   Line chart
   ========================================================================== */

export function LineChart({ data, height = 200, label = 'Trend', valueSuffix = '' }) {
    const gradientId = useId();
    const [hovered, setHovered] = useState(null);

    if (!data || data.length === 0) {
        return <ChartEmpty label="No data for this period" />;
    }

    const width = 600;
    const padding = { top: 16, right: 12, bottom: 28, left: 34 };
    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    const max = Math.max(...data.map((d) => d.value), 1);
    // Round the axis up to something readable rather than the raw maximum.
    const ceiling = niceCeiling(max);

    const x = (index) =>
        padding.left +
        (data.length === 1 ? plotW / 2 : (index / (data.length - 1)) * plotW);
    const y = (value) => padding.top + plotH - (value / ceiling) * plotH;

    const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.value)}`).join(' ');
    const area = `${line} L ${x(data.length - 1)} ${padding.top + plotH} L ${x(0)} ${padding.top + plotH} Z`;

    const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(ceiling * t));

    return (
        <div className="chart">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="chart__svg"
                role="img"
                aria-label={`${label}: ${data.map((d) => `${d.label} ${d.value}`).join(', ')}`}
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--brand-500)" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="var(--brand-500)" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {ticks.map((tick) => (
                    <g key={tick}>
                        <line
                            x1={padding.left}
                            x2={width - padding.right}
                            y1={y(tick)}
                            y2={y(tick)}
                            className="chart__grid"
                        />
                        <text x={padding.left - 8} y={y(tick) + 3} className="chart__axis" textAnchor="end">
                            {tick}
                        </text>
                    </g>
                ))}

                <path d={area} fill={`url(#${gradientId})`} />
                <path d={line} className="chart__line" />

                {data.map((point, index) => (
                    <g key={point.label}>
                        <circle
                            cx={x(index)}
                            cy={y(point.value)}
                            r={hovered === index ? 5 : 3.5}
                            className="chart__point"
                        />
                        {/* Generous invisible hit area — the visible dot is too
                            small to be a reliable hover target. */}
                        <rect
                            x={x(index) - plotW / (data.length * 2 || 1)}
                            y={padding.top}
                            width={plotW / (data.length || 1)}
                            height={plotH}
                            fill="transparent"
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                        />
                    </g>
                ))}

                {data.map((point, index) => (
                    <text
                        key={`${point.label}-label`}
                        x={x(index)}
                        y={height - 8}
                        className="chart__axis"
                        textAnchor="middle"
                    >
                        {point.short ?? point.label}
                    </text>
                ))}
            </svg>

            {hovered !== null && (
                <div
                    className="chart__tooltip"
                    style={{
                        left: `${(x(hovered) / width) * 100}%`,
                        top: `${(y(data[hovered].value) / height) * 100}%`,
                    }}
                >
                    <strong>{data[hovered].label}</strong>
                    <span>
                        {data[hovered].value}
                        {valueSuffix}
                    </span>
                </div>
            )}
        </div>
    );
}

/* ==========================================================================
   Donut
   ========================================================================== */

export function DonutChart({ data, total, centreLabel = 'Total', size = 168 }) {
    const [hovered, setHovered] = useState(null);

    const sum = total ?? data.reduce((acc, d) => acc + d.value, 0);

    if (!data.length || sum === 0) {
        return <ChartEmpty label="Nothing to break down yet" />;
    }

    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    // Each arc's start is the sum of the arcs before it. Derived rather than
    // accumulated in a counter — reassigning a variable while rendering is not
    // safe under concurrent React. The series is a handful of entries, so the
    // repeated sums cost nothing.
    const dashes = data.map((slice) => (slice.value / sum) * circumference);

    const slices = data.map((slice, index) => ({
        ...slice,
        dash: dashes[index],
        offset: dashes.slice(0, index).reduce((total, dash) => total + dash, 0),
        color: slice.color ?? SERIES_COLOURS[index % SERIES_COLOURS.length],
    }));

    return (
        <div className="donut">
            <div className="donut__ring" style={{ width: size, height: size }}>
                <svg viewBox="0 0 160 160" role="img" aria-label={`${centreLabel}: ${sum}`}>
                    <circle cx="80" cy="80" r={radius} className="donut__track" />

                    {slices.map((slice, index) => (
                        <circle
                            key={slice.label}
                            cx="80"
                            cy="80"
                            r={radius}
                            className={cn('donut__slice', hovered === index && 'is-hovered')}
                            stroke={slice.color}
                            strokeDasharray={`${slice.dash} ${circumference - slice.dash}`}
                            strokeDashoffset={-slice.offset}
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                        />
                    ))}
                </svg>

                <div className="donut__centre">
                    <strong>{hovered === null ? sum : data[hovered].value}</strong>
                    <span>{hovered === null ? centreLabel : data[hovered].label}</span>
                </div>
            </div>

            <ul className="donut__legend">
                {slices.map((slice, index) => (
                    <li
                        key={slice.label}
                        className={cn(hovered === index && 'is-hovered')}
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        <span
                            className="donut__dot"
                            style={{ background: slice.color }}
                        />
                        <span className="donut__name">{slice.label}</span>
                        <strong className="donut__value">
                            {slice.value}
                            <small>{Math.round((slice.value / sum) * 100)}%</small>
                        </strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* ==========================================================================
   Shared
   ========================================================================== */

function ChartEmpty({ label }) {
    return <div className="chart chart--empty">{label}</div>;
}

/** Rounds an axis maximum up to a readable step (10, 25, 50, 100…). */
function niceCeiling(value) {
    if (value <= 5) return 5;
    const magnitude = 10 ** Math.floor(Math.log10(value));
    const normalised = value / magnitude;
    const step = normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 5 ? 5 : 10;
    return step * magnitude;
}
