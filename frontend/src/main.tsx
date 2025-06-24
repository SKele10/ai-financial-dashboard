// main.tsx
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import './index.css'
import ChartsPage from "./pages/ChartsPage";
import PredictionPage from "./pages/PredictionPage";

const routes: RouteObject[] = [
  {
    element: <App />, 
    children: [
      { index: true, element: <HomePage />,  handle: { title: "Home" } },
      { path: "charts", element: <ChartsPage />, handle: { title: "Charts" } },
      { path: "predictions", element: <PredictionPage />, handle: { title: "Predictions" } },
    ],
  },
];

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
