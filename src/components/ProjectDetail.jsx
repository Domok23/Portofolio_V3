import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Code2,
  Star,
  ChevronRight,
  Layers,
  Layout,
  Globe,
  Package,
  Cpu,
  Code,
} from "lucide-react";
import Swal from "sweetalert2";
import { db, doc, getDoc } from "../firebase";
import { getAccentColor } from "../theme";

const TECH_ICONS = {
  React: Globe,
  Tailwind: Layout,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  default: Package,
};

const TechBadge = ({ tech }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS.default;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 border border-border bg-surface text-foreground transition-colors duration-200 hover:border-accent">
      <Icon className="w-4 h-4 text-accent" />
      <span className="text-sm font-medium">{tech}</span>
    </div>
  );
};

const FeatureItem = ({ feature }) => (
  <li className="flex items-start gap-3 p-3 border border-transparent hover:border-border transition-colors duration-200">
    <span className="mt-2 w-1.5 h-1.5 bg-accent shrink-0" />
    <span className="text-sm md:text-base text-muted">{feature}</span>
  </li>
);

const ProjectStats = ({ project }) => {
  const techStackCount = project?.TechStack?.length || 0;
  const featuresCount = project?.Features?.length || 0;

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      <div className="flex items-center gap-3 bg-surface p-3 border border-border">
        <div className="p-2 border border-border">
          <Code2 className="text-accent w-5 h-5" strokeWidth={1.5} />
        </div>
        <div>
          <div className="text-xl font-heading font-semibold text-foreground">
            {techStackCount}
          </div>
          <div className="text-xs text-muted">Total Teknologi</div>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-surface p-3 border border-border">
        <div className="p-2 border border-border">
          <Layers className="text-accent w-5 h-5" strokeWidth={1.5} />
        </div>
        <div>
          <div className="text-xl font-heading font-semibold text-foreground">
            {featuresCount}
          </div>
          <div className="text-xs text-muted">Fitur Utama</div>
        </div>
      </div>
    </div>
  );
};

const handleGithubClick = (githubLink) => {
  if (githubLink === "Private") {
    Swal.fire({
      icon: "info",
      title: "Source Code Private",
      text: "Maaf, source code untuk proyek ini bersifat privat.",
      confirmButtonText: "Mengerti",
      confirmButtonColor: getAccentColor(),
      background: "var(--color-surface)",
      color: "var(--color-foreground)",
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

  useEffect(() => {
    let cancelled = false;

    const enhance = (data) => ({
      ...data,
      Features: data.Features || [],
      TechStack: data.TechStack || [],
      Github: data.Github || "https://github.com/Domok23",
    });

    const loadProject = async () => {
      window.scrollTo(0, 0);
      setProject(null);
      setNotFound(false);

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
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <h2 className="text-xl md:text-3xl font-heading font-semibold text-foreground">
            Project not found
          </h2>
          <p className="text-muted text-sm md:text-base">
            This project may have been removed or the link is invalid.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer"
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto border-2 border-border border-t-accent rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-heading font-semibold text-foreground">
            Loading Project...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-[2%] sm:px-0 relative overflow-hidden">
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-muted">
              <span>Projects</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-foreground truncate">{project.Title}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-6 md:space-y-10">
              <div className="space-y-4">
                <h1 className="font-heading text-3xl md:text-6xl font-semibold text-foreground leading-tight">
                  {project.Title}
                </h1>
                <div className="h-0.5 w-16 md:w-24 bg-accent" />
              </div>

              <p className="text-base md:text-lg text-muted leading-relaxed">
                {project.Description}
              </p>

              <ProjectStats project={project} />

              <div className="flex flex-wrap gap-3 md:gap-4">
                {project.Link ? (
                  <a
                    href={project.Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-on-accent text-sm font-medium hover:opacity-90 transition-opacity duration-200 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                ) : null}

                {project.Github ? (
                  <a
                    href={project.Github === "Private" ? undefined : project.Github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground text-sm font-medium hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer"
                    onClick={(e) =>
                      !handleGithubClick(project.Github) && e.preventDefault()
                    }
                  >
                    <Github className="w-4 h-4" />
                    <span>Github</span>
                  </a>
                ) : null}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-accent" />
                  Technologies Used
                </h3>
                {project.TechStack.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {project.TechStack.map((tech, index) => (
                      <TechBadge key={index} tech={tech} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted">No technologies added.</p>
                )}
              </div>
            </div>

            <div className="space-y-6 md:space-y-10">
              <div className="overflow-hidden border border-border bg-surface">
                <img
                  src={project.Img}
                  alt={project.Title}
                  className="w-full object-cover"
                />
              </div>

              <div className="bg-surface border border-border p-8 space-y-6">
                <h3 className="text-xl font-heading font-semibold text-foreground flex items-center gap-3">
                  <Star className="w-5 h-5 text-accent" />
                  Key Features
                </h3>
                {project.Features.length > 0 ? (
                  <ul className="list-none space-y-1">
                    {project.Features.map((feature, index) => (
                      <FeatureItem key={index} feature={feature} />
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No features added.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
