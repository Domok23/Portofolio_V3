import React, { useEffect, useState, useCallback } from "react";
import { db, collection } from "../firebase";
import { getDocs } from "firebase/firestore";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes } from "lucide-react";

// Separate ShowMore/ShowLess button component
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    type="button"
    onClick={onClick}
    className="px-3 py-1.5 text-sm font-medium border border-border text-foreground hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer inline-flex items-center gap-2"
  >
    {isShowingMore ? "See Less" : "See More"}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline
        points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}
      ></polyline>
    </svg>
  </button>
);

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>{children}</Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const techStacks = [
  { icon: 'html.svg', language: 'HTML' },
  { icon: 'css.svg', language: 'CSS' },
  { icon: 'javascript.svg', language: 'JavaScript' },
  { icon: 'typescript.svg', language: 'TypeScript' },
  { icon: 'php.svg', language: 'PHP' },
  { icon: 'python.svg', language: 'Python' },
  { icon: 'angular.svg', language: 'Angular' },
  { icon: 'tailwind.svg', language: 'Tailwind' },
  { icon: 'git.svg', language: 'GIT' },
  { icon: 'mysql2.svg', language: 'MySQL' },
  { icon: 'bootstrap.svg', language: 'Bootstrap' },
  { icon: 'laravel.svg', language: 'Laravel' },
  { icon: 'codeigniter.svg', language: 'Codeigniter' },
  { icon: 'nodejs.svg', language: 'Node JS' },
  { icon: 'laragon.svg', language: 'Laragon' },
  { icon: 'wordpress.svg', language: 'WordPress' },
  { icon: 'figma.svg', language: 'Figma' },
  { icon: 'c.svg', language: 'C++' },
];

export default function FullWidthTabs() {
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
  );
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const fetchData = useCallback(async () => {
    const cachedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const cachedCertificates = JSON.parse(
      localStorage.getItem("certificates") || "[]"
    );
    if (cachedProjects.length) setProjects(cachedProjects);
    if (cachedCertificates.length) setCertificates(cachedCertificates);

    try {
      const projectCollection = collection(db, "projects");
      const certificateCollection = collection(db, "certificates");

      const [projectSnapshot, certificateSnapshot] = await Promise.all([
        getDocs(projectCollection),
        getDocs(certificateCollection),
      ]);

      const projectData = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        TechStack: doc.data().TechStack || [],
      }));

      const certificateData = certificateSnapshot.docs.map((doc) => doc.data());

      setProjects(projectData);
      setCertificates(certificateData);

      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("certificates", JSON.stringify(certificateData));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === 'projects') {
      setShowAllProjects(prev => !prev);
    } else {
      setShowAllCertificates(prev => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

  return (
    <div
      className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-background"
      id="Portofolio"
    >
      <div
        className="text-center pb-10"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h2 className="font-heading text-3xl md:text-5xl font-semibold text-foreground text-center mx-auto">
          Portfolio Showcase
        </h2>
        <p className="text-muted max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through projects, certifications, and technical
          expertise. Each section represents a milestone in my continuous
          learning path.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 0,
            position: "relative",
            overflow: "hidden",
          }}
          className="md:px-4"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            variant="fullWidth"
            TabIndicatorProps={{
              style: { backgroundColor: "var(--color-accent)" },
            }}
            sx={{
              minHeight: "70px",
              color: "var(--color-foreground)",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "var(--color-muted)",
                textTransform: "none",
                transition: "color 0.2s ease-out",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: 0,
                "&:hover": {
                  color: "var(--color-foreground)",
                  backgroundColor: "transparent",
                },
                "&.Mui-selected": {
                  color: "var(--color-accent)",
                  background: "transparent",
                  boxShadow: "none",
                  "& .lucide": {
                    color: "var(--color-accent)",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: "2px",
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Projects"
              {...a11yProps(0)}
            />
            <Tab
              icon={<Award className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Certificates"
              {...a11yProps(1)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Tech Stack"
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0}>
            <div className="container mx-auto flex justify-center items-center pt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    className="animate-fade-up"
                    style={{ animationDelay: `${(index % 6) * 60}ms` }}
                  >
                    <CardProject
                      Img={project.Img}
                      Title={project.Title}
                      Description={project.Description}
                      Link={project.Link}
                      id={project.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('projects')}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={1}>
            <div className="container mx-auto flex justify-center items-center pt-1">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
                {displayedCertificates.map((certificate, index) => (
                  <div
                    key={index}
                    className="animate-fade-up"
                    style={{ animationDelay: `${(index % 6) * 60}ms` }}
                  >
                    <Certificate ImgSertif={certificate.Img} />
                  </div>
                ))}
              </div>
            </div>
            {certificates.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('certificates')}
                  isShowingMore={showAllCertificates}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={2}>
            <div className="container mx-auto flex justify-center items-center pt-1 pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    className="animate-fade-up"
                    style={{ animationDelay: `${(index % 6) * 40}ms` }}
                  >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
      </Box>
    </div>
  );
}