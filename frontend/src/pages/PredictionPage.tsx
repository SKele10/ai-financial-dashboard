import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import PredictionChartComponent from "../components/PredictionChartComponent";

const products = ["Paseo", "Carretera", "Montana", "Amarilla", "VTT", "Velo"];
const durations = ["3 months", "6 months", "1 year"];
const metrics = ["Profit", "Sales", "Units Sold"];

const PredictionPage = () => {
  const [product, setProduct] = useState("Paseo");
  const [duration, setDuration] = useState("6 months");
  const [targetMetric, setTargetMetric] = useState("Profit");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState("");

  const handlePredict = async () => {
    setLoading(true);
    setData([]);
    setInsight("");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/predict/performance",
        {
          product,
          duration,
          target_metric: targetMetric,
        }
      );

      setData(res.data.forecast);
      setInsight(res.data.insight); // ← NEW
    } catch (err) {
      console.error("Prediction Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-xl font-bold">📈 Product Performance Forecast</h2>

      <div className="flex flex-wrap items-center gap-4">
        <Select value={product} onValueChange={setProduct}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        <Select value={targetMetric} onValueChange={setTargetMetric}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            {metrics.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {durations.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handlePredict} disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </Button>
      </div>

      <div className="mt-6 rounded-xl bg-muted/30 p-6 shadow-md min-h-[440px]">
        <h3 className="text-lg font-semibold mb-4 text-center">
          {product} - {targetMetric} Forecast
        </h3>
        {!loading && data.length > 0 ? (
          <PredictionChartComponent data={data} />
        ) : (
          <p className="text-center text-muted-foreground">
            No data yet. Run prediction.
          </p>
        )}
        {loading && (
          <div className="flex items-center justify-center h-24">
            <span >Getting your chart</span>
          </div>
        )}
        {insight && (
          <div className="text-sm bg-muted rounded-md p-4 mb-4 text-muted-foreground border border-border shadow-sm">
            <p className="font-medium mb-1">🧠 Insight</p>
            <p>{insight}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;
