import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  data: { [key: string]: string | number }[];
  xField: string;
  yFields: string[];
}

const COLORS = ['#6366F1', '#22D3EE', '#FBBF24', '#EF4444', '#10B981', '#E879F9'];

const PieChartComponent: React.FC<Props> = ({ data, xField, yFields }) => {
  const dataKey = yFields[0];

  return (
    <ResponsiveContainer width="100%" height={360}>
      <PieChart>
        <Tooltip />
        <Legend />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
