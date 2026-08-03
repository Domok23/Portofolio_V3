const TechStackIcon = ({ TechStackIcon, Language }) => {
  return (
    <div className="group p-6 border border-border bg-surface cyber-chamfer cyber-hover-glitch hover:border-accent hover:shadow-neon hover:-translate-y-px transition-all duration-150 flex flex-col items-center justify-center gap-3 cursor-pointer">
      <img
        src={TechStackIcon}
        alt={`${Language} icon`}
        className="h-16 w-16 md:h-20 md:w-20 transition-transform duration-150 group-hover:scale-110"
      />
      <span className="font-label text-muted text-sm md:text-base uppercase tracking-wider group-hover:text-accent transition-colors duration-150">
        {Language}
      </span>
    </div>
  );
};

export default TechStackIcon;
