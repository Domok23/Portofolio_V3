import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import Card from "./ui/Card";

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
    <Card hoverEffect className="group relative w-full overflow-hidden cyber-hover-glitch">
      <div className="p-5">
        <div className="overflow-hidden border border-border">
          <img
            src={Img}
            alt={Title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        <div className="mt-4 space-y-3">
          <h3 className="text-xl font-heading font-semibold uppercase tracking-wide text-foreground transition-colors duration-150 group-hover:text-accent">
            {Title}
          </h3>

          <p className="text-muted text-sm leading-relaxed tracking-wide line-clamp-2">
            {Description}
          </p>

          <div className="pt-4 flex items-center justify-between">
            {ProjectLink ? (
              <a
                href={ProjectLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLiveDemo}
                className="inline-flex items-center space-x-2 font-label text-sm uppercase tracking-wider text-accent hover:gap-3 gap-2 transition-all duration-150 cursor-pointer"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
              </a>
            ) : (
              <span className="font-label text-muted text-sm uppercase">
                Demo Not Available
              </span>
            )}

            {id ? (
              <Link
                to={`/project/${id}`}
                onClick={handleDetails}
                className="inline-flex items-center space-x-2 min-h-11 px-4 py-2 border border-border font-label text-sm uppercase tracking-wider text-foreground hover:border-accent hover:text-accent hover:shadow-neon-sm hover:gap-3 gap-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring cyber-chamfer-sm cursor-pointer"
              >
                <span>Details</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </Link>
            ) : (
              <span className="font-label text-muted text-sm uppercase">
                Details Not Available
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CardProject;
