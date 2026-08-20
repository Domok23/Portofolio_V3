import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, Github, Code2, Star,
  ChevronRight, ChevronLeft, Image as ImageIcon, Maximize2, Layers, Layout, Globe, Package, Cpu, Code,
  Database, Server, Terminal, Flame, Smartphone, Cloud, FileCode, Wrench
} from "lucide-react";
import Swal from 'sweetalert2';
import { db, doc, getDoc } from "../firebase";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const TECH_ICONS_MAP = {
  // Languages
  javascript: Code,
  js: Code,
  typescript: Code,
  ts: Code,
  html: FileCode,
  html5: FileCode,
  css: Layout,
  css3: Layout,
  python: Code,
  php: Server,
  java: Code,

  // Frameworks & Libraries
  react: Globe,
  reactjs: Globe,
  nextjs: Globe,
  vue: Globe,
  vuejs: Globe,
  angular: Globe,
  laravel: Server,
  express: Cpu,
  expressjs: Cpu,
  nodejs: Server,
  node: Server,
  tailwind: Layout,
  tailwindcss: Layout,
  bootstrap: Layout,

  // Databases
  mysql: Database,
  postgresql: Database,
  postgres: Database,
  mongodb: Database,
  mongo: Database,
  firebase: Flame,
  firestore: Flame,
  supabase: Database,
  sql: Database,

  // Tools & Others
  git: Terminal,
  github: Github,
  docker: Cloud,
  aws: Cloud,
};

const getTechIcon = (techName) => {
  if (!techName) return Package;
  const key = techName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return TECH_ICONS_MAP[key] || Package;
};

const TechBadge = ({ tech }) => {
  const Icon = getTechIcon(tech);
  
  return (
    <div className="group relative overflow-hidden px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
      <div className="relative flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
        <span className="text-xs md:text-sm font-medium text-blue-300/90 group-hover:text-blue-200 transition-colors">
          {tech}
        </span>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature }) => {
  return (
    <li className="group flex items-start space-x-3 p-2.5 md:p-3.5 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10">
      <div className="relative mt-2">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        <div className="relative w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 group-hover:scale-125 transition-transform duration-300" />
      </div>
      <span className="text-sm md:text-base text-gray-300 group-hover:text-white transition-colors">
        {feature}
      </span>
    </li>
  );
};

const ProjectStats = ({ project }) => {
  const techStackCount = project?.TechStack?.length || 0;
  const featuresCount = project?.Features?.length || 0;

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-[#0a0a1a] rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 opacity-50 blur-2xl z-0" />

      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white/5 p-2 md:p-3 rounded-lg border border-blue-500/20 transition-all duration-300 hover:scale-105 hover:border-blue-500/50 hover:shadow-lg">
        <div className="bg-blue-500/20 p-1.5 md:p-2 rounded-full">
          <Code2 className="text-blue-300 w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-blue-200">{techStackCount}</div>
          <div className="text-[10px] md:text-xs text-gray-400">Total Teknologi</div>
        </div>
      </div>

      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white/5 p-2 md:p-3 rounded-lg border border-purple-500/20 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 hover:shadow-lg">
        <div className="bg-purple-500/20 p-1.5 md:p-2 rounded-full">
          <Layers className="text-purple-300 w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-purple-200">{featuresCount}</div>
          <div className="text-[10px] md:text-xs text-gray-400">Fitur Utama</div>
        </div>
      </div>
    </div>
  );
};

const handleGithubClick = (githubLink) => {
  if (githubLink === 'Private') {
    Swal.fire({
      icon: 'info',
      title: 'Source Code Private',
      text: 'Maaf, source code untuk proyek ini bersifat privat.',
      confirmButtonText: 'Mengerti',
      confirmButtonColor: '#3085d6',
      background: '#030014',
      color: '#ffffff'
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const enhance = (data) => {
      const rawImages = Array.isArray(data.Images) && data.Images.length > 0
        ? data.Images
        : (data.Img ? [data.Img] : []);
      return {
        ...data,
        Features: data.Features || [],
        TechStack: data.TechStack || [],
        Github: data.Github || "https://github.com/Domok23",
        Images: rawImages,
        Img: data.Img || (rawImages[0] || ""),
      };
    };

    const loadProject = async () => {
      window.scrollTo(0, 0);
      setProject(null);
      setNotFound(false);
      setIsImageLoaded(false);
      setSelectedImageIndex(0);

      if (!id) {
        setNotFound(true);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "projects", id));
        if (cancelled) return;

        if (snap.exists()) {
          const data = enhance({ id: snap.id, ...snap.data() });
          setProject(data);

          const stored = JSON.parse(localStorage.getItem("projects") || "[]");
          const next = stored.filter((p) => String(p.id) !== String(snap.id));
          next.push(data);
          localStorage.setItem("projects", JSON.stringify(next));
          return;
        }

        setNotFound(true);
      } catch (error) {
        console.error("Error fetching project:", error);
        if (cancelled) return;

        const stored = JSON.parse(localStorage.getItem("projects") || "[]");
        const cached = stored.find((p) => String(p.id) === String(id));
        if (cached) {
          setProject(enhance(cached));
        } else {
          setNotFound(true);
        }
      }
    };

    loadProject();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <h2 className="text-xl md:text-3xl font-bold text-white">Project not found</h2>
          <p className="text-gray-400 text-sm md:text-base">This project may have been removed or the link is invalid.</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/90 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to portfolio
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-white">Loading Project...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] px-[2%] sm:px-0 relative overflow-hidden">
      {/* Background animations remain unchanged */}
      <div className="fixed inset-0">
        <div className="absolute -inset-[10px] opacity-20">
          <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12 animate-fadeIn">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center space-x-1.5 md:space-x-2 px-3 md:px-5 py-2 md:py-2.5 bg-white/5 backdrop-blur-xl rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-white/50">
              <span>Projects</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-white/90 truncate">{project.Title}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-6 md:space-y-10 animate-slideInLeft">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                  {project.Title}
                </h1>
                <div className="relative h-1 w-16 md:w-24">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm" />
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-base md:text-lg text-gray-300/90 leading-relaxed">
                  {project.Description}
                </p>
              </div>

              <ProjectStats project={project} />

              <div className="flex flex-wrap gap-3 md:gap-4">
                {/* Action buttons */}
                <a
                  href={project.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 text-blue-300 rounded-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                >
                  <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-blue-600/10 to-purple-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                  <ExternalLink className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                  <span className="relative font-medium">Live Demo</span>
                </a>

                <a
                  href={project.Github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 text-purple-300 rounded-xl transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                  onClick={(e) => !handleGithubClick(project.Github) && e.preventDefault()}
                >
                  <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-purple-600/10 to-pink-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                  <Github className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                  <span className="relative font-medium">Github</span>
                </a>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h3 className="text-lg md:text-xl font-semibold text-white/90 mt-[3rem] md:mt-0 flex items-center gap-2 md:gap-3">
                  <Code2 className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  Technologies Used
                </h3>
                {project.TechStack.length > 0 ? (
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {project.TechStack.map((tech, index) => (
                      <TechBadge key={index} tech={tech} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-gray-400 opacity-50">No technologies added.</p>
                )}
              </div>
            </div>

            <div className="space-y-6 md:space-y-10 animate-slideInRight">
              {/* Image Gallery / Carousel */}
              {(() => {
                const projectImages = Array.isArray(project.Images) && project.Images.length > 0
                  ? project.Images
                  : (project.Img ? [project.Img] : []);
                const currentImage = projectImages[selectedImageIndex] || project.Img;
                const hasMultiple = projectImages.length > 1;

                const handlePrev = (e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
                };

                const handleNext = (e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) => (prev + 1) % projectImages.length);
                };

                return (
                  <div className="space-y-3">
                    {/* Main Image Showcase */}
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group bg-black/40">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                      
                      {/* Fullscreen Button */}
                      <button
                        type="button"
                        onClick={() => setIsLightboxOpen(true)}
                        className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-[11px] font-medium text-white/95 flex items-center gap-1.5 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                        title="View Fullscreen & Zoom"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Fullscreen</span>
                      </button>

                      {/* Active Image (Click to open Fullscreen) */}
                      <div 
                        onClick={() => setIsLightboxOpen(true)}
                        className="relative w-full aspect-video sm:aspect-[16/10] overflow-hidden flex items-center justify-center bg-black/60 cursor-zoom-in"
                        title="Click to view image fullscreen"
                      >
                        <img
                          key={currentImage}
                          src={currentImage}
                          alt={`${project.Title} - photo ${selectedImageIndex + 1}`}
                          className="w-full h-full object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
                          onLoad={() => setIsImageLoaded(true)}
                        />
                      </div>

                      {/* Photo Counter Badge */}
                      {hasMultiple && (
                        <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white/90 flex items-center gap-1.5 shadow-lg">
                          <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                          <span>{selectedImageIndex + 1} / {projectImages.length}</span>
                        </div>
                      )}

                      {/* Navigation Arrows for Carousel */}
                      {hasMultiple && (
                        <>
                          <button
                            type="button"
                            onClick={handlePrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white/80 hover:text-white transition-all duration-200 opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95"
                            title="Previous image"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={handleNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white/80 hover:text-white transition-all duration-200 opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95"
                            title="Next image"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      {/* Carousel Indicator Dots */}
                      {hasMultiple && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                          {projectImages.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedImageIndex(idx)}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                selectedImageIndex === idx
                                  ? "w-5 bg-gradient-to-r from-blue-400 to-purple-400"
                                  : "w-1.5 bg-white/40 hover:bg-white/70"
                              }`}
                              title={`Go to photo ${idx + 1}`}
                            />
                          ))}
                        </div>
                      )}

                      <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-2xl pointer-events-none" />
                    </div>

                    {/* Thumbnail Strip */}
                    {hasMultiple && (
                      <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-1 px-0.5 scrollbar-thin scrollbar-thumb-white/10">
                        {projectImages.map((imgUrl, idx) => {
                          const isActive = selectedImageIndex === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedImageIndex(idx)}
                              className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 shrink-0 w-20 h-14 sm:w-24 sm:h-16 ${
                                isActive
                                  ? "border-blue-500 ring-2 ring-blue-500/40 scale-105 shadow-lg shadow-blue-500/20"
                                  : "border-white/10 hover:border-white/30 opacity-60 hover:opacity-100"
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Lightbox Component for Fullscreen & Zoom */}
                    <Lightbox
                      open={isLightboxOpen}
                      close={() => setIsLightboxOpen(false)}
                      index={selectedImageIndex}
                      slides={projectImages.map((src) => ({ src }))}
                      plugins={[Zoom, Fullscreen, Thumbnails]}
                      on={{
                        view: ({ index }) => setSelectedImageIndex(index),
                      }}
                    />
                  </div>
                );
              })()}

              {/* Fitur Utama */}
              <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-6 hover:border-white/20 transition-colors duration-300 group">
                <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
                  Key Features
                </h3>
                {project.Features.length > 0 ? (
                  <ul className="list-none space-y-2">
                    {project.Features.map((feature, index) => (
                      <FeatureItem key={index} feature={feature} />
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 opacity-50">No features added.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.7s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.7s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;
