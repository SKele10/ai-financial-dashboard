import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface BarChartProps {
  data: { [key: string]: string | number }[];
  xField: string;
  yFields: string[];
}

const COLORS = ['#6366F1', '#22D3EE', '#FBBF24', '#EF4444'];

const BarChartComponent: React.FC<BarChartProps> = ({ data, xField, yFields }) => {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          
          tick={{ fontSize: 12 }}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{ fontSize: 13 }}
          wrapperStyle={{ zIndex: 10 }}
          labelStyle={{ fontWeight: 'bold' }}
        />
        <Legend wrapperStyle={{ fontSize: 13 }} />
        {yFields.map((field, index) => (
          <Bar
            key={field}
            dataKey={field}
            fill={COLORS[index % COLORS.length]}
            radius={[6, 6, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
