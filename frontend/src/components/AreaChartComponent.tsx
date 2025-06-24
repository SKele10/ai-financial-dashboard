import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  data: { [key: string]: string | number }[];
  xField: string;
  yFields: string[];
}

const COLORS = ['#6366F1', '#22D3EE', '#FBBF24', '#EF4444'];

const AreaChartComponent: React.FC<Props> = ({ data, xField, yFields }) => (
  <ResponsiveContainer width="100%" height={360}>
    <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      {yFields.map((field, index) => (
        <Area key={field} type="monotone" dataKey={field} stroke={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} />
      ))}
    </AreaChart>
  </ResponsiveContainer>
);

export default AreaChartComponent;
