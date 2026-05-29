import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#00d4ff', '#0099cc', '#00e676', '#ff5252', '#ffa726', '#ab47bc', '#26c6da'];

export default function PortfolioPieChart({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return <div className="h-48 flex items-center justify-center text-gray-500 text-sm">No holdings yet</div>;
  }

  const chartData = Object.entries(data).map(([name, value]) => ({ name, value: +value.toFixed(2) }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'rgba(17, 24, 39, 0.95)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: '12px',
            fontSize: '12px',
          }}
          formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
