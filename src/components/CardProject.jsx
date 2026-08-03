import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      e.preventDefault();
      alert("Live demo link is not available");
    }
  };

  const handleDetails = (e) => {
    if (!id) {
      e.preventDefault();
      alert("Project details are not available");
    }
  };

  return (
    <div className="group relative w-full bg-surface border border-border overflow-hidden transition-all duration-300 ease-out hover:border-accent hover:-translate-y-1">
      <div className="p-5">
        <div className="overflow-hidden border border-border">
          <img
            src={Img}
            alt={Title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        <div className="mt-4 space-y-3">
          <h3 className="text-xl font-heading font-semibold text-foreground transition-colors duration-200 group-hover:text-accent">
            {Title}
          </h3>

          <p className="text-muted text-sm leading-relaxed line-clamp-2">
            {Description}
          </p>

          <div className="pt-4 flex items-center justify-between">
            {ProjectLink ? (
              <a
                href={ProjectLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLiveDemo}
                className="inline-flex items-center space-x-2 text-accent hover:gap-3 gap-2 transition-all duration-200 cursor-pointer"
              >
                <span className="text-sm font-medium">Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <span className="text-muted text-sm">Demo Not Available</span>
            )}

            {id ? (
              <Link
                to={`/project/${id}`}
                onClick={handleDetails}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-border text-foreground hover:border-accent hover:text-accent hover:gap-3 gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                <span className="text-sm font-medium">Details</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <span className="text-muted text-sm">Details Not Available</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProject;
