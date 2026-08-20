import React, { useEffect } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portfolio from "./Pages/Portofolio";
import ContactPage from "./Pages/Contact";
import ProjectDetails from "./components/ProjectDetail";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./Pages/Admin/Login";
import Dashboard from "./Pages/Admin/Dashboard";
import { trackPageView } from "./utils/analytics";

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const fullPath = location.pathname + (location.hash || "");
    trackPageView(fullPath);
  }, [location]);

  return null;
};

const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    const rawPath = location.pathname.replace(/^\/+/, "");
    const targetId = rawPath || (location.hash ? location.hash.replace(/^#+/, "") : null);

    if (targetId) {
      const resolvedId = targetId.toLowerCase() === "portofolio" ? "Portfolio" : targetId;
      const element = document.getElementById(resolvedId) || document.querySelector(`#${resolvedId}`);
      if (element) {
        setTimeout(() => {
          const top = element.offsetTop - 80;
          window.scrollTo({
            top: Math.max(0, top),
            behavior: "smooth",
          });
        }, 150);
      }
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <AnimatedBackground />
      <Home />
      <About />
      <Portfolio />
      <ContactPage />
      <footer>
        <center>
          <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
          <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
            © 2025{" "}
            <a href="" className="hover:underline">
              Domm™
            </a>
            . All Rights Reserved.
          </span>
        </center>
      </footer>
    </>
  );
};

const ProjectPageLayout = () => (
  <>
    <ProjectDetails />
    <footer>
      <center>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
          © 2025{" "}
          <a href="" className="hover:underline">
            Domm™
          </a>
          . All Rights Reserved.
        </span>
      </center>
    </footer>
  </>
);

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <RouteTracker />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/project/:id" element={<ProjectPageLayout />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Catch-all fallback route to prevent blank page on hash/direct section navigation */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
