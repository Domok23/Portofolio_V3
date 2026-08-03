import React, { memo } from "react";
import { Github, Linkedin, Mail, ExternalLink, Instagram } from "lucide-react";

const TECH_STACK = ["Laravel", "TypeScript", "JavaScript", "Angular"];
const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/Domok23" },
  {
    icon: Linkedin,
    link: "https://www.linkedin.com/in/wahyu-oktavian-975185178/",
  },
  { icon: Instagram, link: "https://www.instagram.com/whyuoktvn__/" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const Home = () => {
  return (
    <section id="Home" className="min-h-screen bg-background overflow-hidden">
      <div className="container mx-auto px-[5%] sm:px-6 lg:px-12 min-h-screen flex flex-col justify-center pt-24 md:pt-32 pb-12">
        <div className="max-w-3xl space-y-6" data-aos="fade-up">
          <p className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground">
            Domm
          </p>
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
            Software Engineer
            <span className="block text-muted font-normal mt-2 text-xl sm:text-2xl">
              & IT Support
            </span>
          </h1>
          <p className="text-lg text-muted max-w-xl leading-relaxed">
            I build and maintain web applications, and keep systems running day
            to day — bridging software delivery with reliable IT support.
          </p>
          <div className="flex flex-wrap gap-2">
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-sm border border-border text-foreground transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="flex flex-row gap-3">
            <a
              href="#Portofolio"
              className={`inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-on-accent text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all duration-200 cursor-pointer ${focusRing}`}
            >
              Projects <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="#Contact"
              className={`inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground text-sm font-medium hover:border-accent hover:text-accent active:scale-[0.98] transition-all duration-200 cursor-pointer ${focusRing}`}
            >
              Contact <Mail className="w-4 h-4" />
            </a>
          </div>
          <div className="hidden sm:flex gap-2 pt-2">
            {SOCIAL_LINKS.map(({ icon: Icon, link }) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2.5 border border-border text-muted hover:text-accent hover:border-accent hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer ${focusRing}`}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Home);
