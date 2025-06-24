/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import axios from "axios";
import BarChartComponent from "../components/BarChartComponent";
import PieChartComponent from "../components/PieChartComponent";
import AreaChartComponent from "../components/AreaChartComponent";
import LineChartComponent from "../components/LineChartComponent";

const ChartsPage = () => {
  const [data, setData] = useState([]);
  const [xField, setXField] = useState("");
  const [yFields, setYFields] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/generate-chart", {
        query,
        chartType,
      });

      const result = res.data;
      setData(result.data);
      setXField(result.xField);
      setYFields(result.yFields);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border p-4 text-sm text-muted-foreground bg-muted/40">
        <p className="font-semibold text-black mb-1">
          📊 Available Data for Demo
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <b>Years:</b> 2013, 2014
          </li>
          <li>
            <b>Countries:</b> Canada, France, Germany, Mexico, United States of
            America
          </li>
          <li>
            <b>Segments:</b> Channel Partners, Enterprise, Government,
            Midmarket, Small Business
          </li>
          <li>
            <b>Products:</b> Carretera, Montana, Paseo, VTT, Amarilla, Velo
          </li>
          <li>
            <b>Metrics:</b> COGS, Profit, Sales, Units Sold, Gross Sales,
            Discounts, Discount Band, Manufacturing Price, Sale Price
          </li>
        </ul>
        <p className="mt-2">
          Try asking things like: <i>"Total profit by country in 2014"</i> or{" "}
          <i>"Compare Sales and Profit for all Products"</i>.
        </p>
      </div>

      {/* Top row: Inputs */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="e.g. Total profit by country in 2016"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />

        <Separator orientation="vertical" className="h-6" />

        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar</SelectItem>
            <SelectItem value="line">Line</SelectItem>
            <SelectItem value="area">Area</SelectItem>
            <SelectItem value="pie">Pie</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>

      <div className="w-full min-h-[440px] bg-muted/30 rounded-2xl shadow-md p-6">
        {chartType === "bar" && (
          <>
            <h2 className="text-lg font-semibold text-center mb-4">
              Bar Chart
            </h2>
            <BarChartComponent data={data} xField={xField} yFields={yFields} />
          </>
        )}

        {chartType === "line" && (
          <>
            <h2 className="text-lg font-semibold text-center mb-4">
              Line Chart
            </h2>
            <LineChartComponent data={data} xField={xField} yFields={yFields} />
          </>
        )}

        {chartType === "area" && (
          <>
            <h2 className="text-lg font-semibold text-center mb-4">
              Area Chart
            </h2>
            <AreaChartComponent data={data} xField={xField} yFields={yFields} />
          </>
        )}

        {chartType === "pie" && yFields.length === 1 && (
          <>
            <h2 className="text-lg font-semibold text-center mb-4">
              Pie Chart
            </h2>
            <PieChartComponent data={data} xField={xField} yFields={yFields} />
          </>
        )}

        {chartType === "pie" && yFields.length > 1 && (
          <p className="text-center text-sm text-red-500">
            Pie chart supports only one metric at a time.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChartsPage;
