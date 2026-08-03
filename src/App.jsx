import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import ContactPage from "./Pages/Contact";

const ProjectDetails = lazy(() => import("./components/ProjectDetail"));

const Footer = () => (
  <footer className="border-t border-border bg-background">
    <div className="mx-auto px-[5%] py-6 text-center">
      <span className="block text-sm text-muted">
        © {new Date().getFullYear()}{" "}
        <a
          href="#Home"
          className="text-foreground hover:text-accent transition-colors duration-200"
        >
          Domm™
        </a>
        . All Rights Reserved.
      </span>
    </div>
  </footer>
);

const LandingPage = () => (
  <>
    <Navbar />
    <AnimatedBackground />
    <Home />
    <About />
    <Portofolio />
    <ContactPage />
    <Footer />
  </>
);

const ProjectPageLayout = () => (
  <>
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-muted">
          Loading...
        </div>
      }
    >
      <ProjectDetails />
    </Suspense>
    <Footer />
  </>
);

function App() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    AOS.init({
      once: true,
      offset: 60,
      duration: 700,
      easing: "ease-out-cubic",
      disable: prefersReduced,
    });
  }, []);

  return (
    <BrowserRouter basename="/Portofolio_V3">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/project/:id" element={<ProjectPageLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
