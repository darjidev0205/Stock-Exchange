import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

export default function CandlestickChart({ data, height = 400 }) {
  if (!data?.length) return <div className="h-64 flex items-center justify-center text-gray-500">Loading chart...</div>;

  const chartData = data.map((d) => ({
    ...d,
    body: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
    wick: [d.low, d.high],
    color: d.close >= d.open ? '#00e676' : '#ff5252',
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#64748b', fontSize: 11 }}
          tickFormatter={(v) => v.slice(5)}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={['auto', 'auto']}
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip
          contentStyle={{
            background: 'rgba(17, 24, 39, 0.95)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: '12px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#94a3b8' }}
        />
        <Bar dataKey="body" fill="#00e676" barSize={6} shape={(props) => {
          const { x, y, width, height, payload } = props;
          const color = payload.close >= payload.open ? '#00e676' : '#ff5252';
          return <rect x={x} y={y} width={width} height={Math.max(height, 1)} fill={color} rx={1} />;
        }} />
        <Line type="monotone" dataKey="close" stroke="#00d4ff" strokeWidth={1.5} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
