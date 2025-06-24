import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, BarChart3, LineChart, Brain } from "lucide-react"
import { useNavigate } from "react-router-dom"

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="py-8 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          🔍 AI-Powered Financial Insights Dashboard
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Transform raw business data into actionable charts, forecasts, and insights using MongoDB, Prophet, and LLaMA-3.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Button size="lg" onClick={() => navigate("/charts")}>
            Explore Charts
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/predictions")}>
            Predict Performance
          </Button>
        </div>
      </section>

      <section className="bg-muted/30 py-8 px-4">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
          <Card className="shadow-md">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <BarChart3 className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">No-Code Chart Generation</h3>
              <p className="text-sm text-muted-foreground">
                Ask in plain English, get instant MongoDB-powered charts using LLaMA-generated queries.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <LineChart className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Time-Series Forecasting</h3>
              <p className="text-sm text-muted-foreground">
                Forecast product performance using Prophet models with interactive visualizations.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Brain className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Business Insights</h3>
              <p className="text-sm text-muted-foreground">
                Instantly summarize trends and next steps with LLaMA-3 powered insights.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="py-8 text-center text-muted-foreground text-sm">
        Built with ❤️ using React, FastAPI, MongoDB, Prophet & Replicate LLaMA-3
      </footer>
    </div>
  )
}

export default HomePage
