import React from "react";

const TechStackIcon = ({ TechStackIcon, Language }) => {
  return (
    <div className="group p-6 border border-border bg-surface hover:border-accent hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col items-center justify-center gap-3 cursor-pointer">
      <img
        src={TechStackIcon}
        alt={`${Language} icon`}
        className="h-16 w-16 md:h-20 md:w-20 transition-transform duration-300 ease-out group-hover:scale-110"
      />
      <span className="text-muted font-medium text-sm md:text-base tracking-wide group-hover:text-foreground transition-colors duration-200">
        {Language}
      </span>
    </div>
  );
};

export default TechStackIcon;
