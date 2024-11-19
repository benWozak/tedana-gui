import "./App.css";
import { useState, useEffect } from "react";
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import LoadingAnimation from "./components/layout/LoadingAnimation";
import { invoke } from "@tauri-apps/api/tauri";

const Home = lazy(() => import("./views/Home"));
const Installation = lazy(() => import("./views/Installation"));
const EnvironmentSetup = lazy(() => import("./views/EnvironmentSetup"));
const ProcessSetup = lazy(() => import("./views/ProcessSetup"));
const ReportViewer = lazy(() => import("./views/ReportViewer"));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [tedanaStatus, setTedanaStatus] = useState<string>("Checking...");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const checkTedanaConnection = async () => {
      try {
        const pythonPath = localStorage.getItem("pythonPath");
        if (!pythonPath) {
          setTedanaStatus(
            "Python path not set. Please go to Setup to configure."
          );
          setIsConnected(false);
          return;
        }

        const result = await invoke("check_tedana_installation", {
          pythonPath: pythonPath,
        });
        setTedanaStatus("Connected: v" + result);
        setIsConnected(true);
      } catch (error) {
        console.error("Error checking tedana:", error);
        setTedanaStatus(
          "Not connected. Please check your installation and Python path."
        );
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkTedanaConnection();
  }, []);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingAnimation />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <Home tedanaStatus={tedanaStatus} isConnected={isConnected} />
              }
            />
            <Route path="installation" element={<Installation />} />
            <Route path="environment" element={<EnvironmentSetup />} />
            <Route path="process" element={<ProcessSetup />} />
            <Route path="results" element={<ReportViewer />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
