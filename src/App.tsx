import "./App.css";
import { useState, useEffect } from "react";
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import LoadingAnimation from "./components/layout/LoadingAnimation";

const Home = lazy(() => import("./views/Home"));
const Installation = lazy(() => import("./views/Installation"));
const Setup = lazy(() => import("./views/Setup"));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingAnimation />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="installation" element={<Installation />} />
            <Route path="setup" element={<Setup />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
