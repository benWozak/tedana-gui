import "./App.css";
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";

const Home = lazy(() => import("./views/Home"));
const Installation = lazy(() => import("./views/Installation"));
const Setup = lazy(() => import("./views/Setup"));

// TODO: update Loading fallback
const Loading = () => (
  <div className="mx-auto h-svh">
    <div className="flex flex-col justify-center items-center h-5/6">
      <h1 className="text-3xl font-bold">Loading...</h1>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
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
