import React from "react";
import {
  Linkedin,
  Github,
  Instagram,
  Youtube,
  ExternalLink,
} from "lucide-react";

const socialLinks = [
  {
    name: "GitHub",
    displayName: "GitHub",
    subText: "@Domok23",
    icon: Github,
    url: "https://github.com/Domok23",
    isPrimary: true,
  },
  {
    name: "LinkedIn",
    displayName: "Let's Connect",
    subText: "on LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/wahyu-oktavian-975185178/",
    isPrimary: true,
  },
  {
    name: "Instagram",
    displayName: "Instagram",
    subText: "@whyuoktvn__",
    icon: Instagram,
    url: "https://www.instagram.com/whyuoktvn__",
  },
  {
    name: "YouTube",
    displayName: "Youtube",
    subText: "Wahyu Doom",
    icon: Youtube,
    url: "https://www.youtube.com/@wahyudoom7917",
  },
  {
    name: "TikTok",
    displayName: "Tiktok",
    subText: "@wahyu_domm",
    icon: ({ className, ...props }) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        {...props}
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.18 8.18 0 0 0 4.76 1.52V6.79a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
    url: "https://tiktok.com/@wahyu_domm",
  },
];

const LinkCard = ({ link, large = false }) => (
  <a
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    className={`group relative flex items-center ${
      large ? "justify-between p-4" : "gap-3 p-4"
    } border border-border bg-background hover:border-accent transition-colors duration-200 cursor-pointer`}
  >
    <div className="relative flex items-center gap-4">
      <div className="p-2 border border-border text-foreground">
        <link.icon className={large ? "w-6 h-6" : "w-5 h-5"} />
      </div>

      <div className="flex flex-col min-w-0">
        <span
          className={`${
            large ? "text-lg" : "text-sm"
          } font-heading font-semibold text-foreground tracking-tight leading-none`}
        >
          {link.displayName}
        </span>
        <span
          className={`${large ? "text-sm" : "text-xs"} text-muted truncate`}
        >
          {link.subText}
        </span>
      </div>
    </div>

    <ExternalLink
      className={`${
        large ? "w-5 h-5" : "w-4 h-4 ml-auto"
      } text-muted group-hover:text-accent transition-colors duration-200`}
    />
  </a>
);

const SocialLinks = () => {
  const primaryLinks = socialLinks.filter((link) => link.isPrimary);
  const otherLinks = socialLinks.filter((link) => !link.isPrimary);

  return (
    <div className="w-full">
      <h3 className="text-xl font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
        <span className="inline-block w-8 h-0.5 bg-accent"></span>
        Connect With Me
      </h3>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {primaryLinks.map((link) => (
            <LinkCard key={link.name} link={link} large />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {otherLinks.map((link) => (
            <LinkCard key={link.name} link={link} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
