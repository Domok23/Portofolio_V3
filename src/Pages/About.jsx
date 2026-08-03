import React, { memo } from "react";
import { FileText, Code, Award, Globe, ArrowUpRight } from "lucide-react";

const Header = memo(() => (
  <div className="text-center lg:mb-8 mb-2 px-[5%]">
    <h2
      className="font-heading text-4xl md:text-5xl font-semibold text-foreground"
      data-aos="fade-up"
      data-aos-duration="600"
    >
      About Me
    </h2>
    <p
      className="mt-2 text-muted max-w-2xl mx-auto text-base sm:text-lg"
      data-aos="fade-up"
      data-aos-duration="800"
    >
      Transforming ideas into digital experiences
    </p>
  </div>
));

const ProfileImage = memo(() => (
  <div className="flex justify-end items-center sm:p-12 sm:py-0 p-0 py-2">
    <div data-aos="fade-up" data-aos-duration="1000">
      <div className="w-72 h-72 sm:w-80 sm:h-80 overflow-hidden border border-border bg-surface transition-transform duration-500 ease-out hover:scale-[1.02]">
        <img
          src="https://domok23.github.io/profile/images/bg_1a.png"
          alt="Profile"
          className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
          loading="lazy"
        />
      </div>
    </div>
  </div>
));

const StatCard = memo(({ icon: Icon, value, label, description, animation }) => (
  <div data-aos={animation} data-aos-duration={700} className="relative group">
    <div className="bg-surface border border-border p-6 h-full flex flex-col justify-between transition-all duration-300 ease-out hover:border-accent hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 flex items-center justify-center border border-border transition-colors duration-200 group-hover:border-accent">
          <Icon className="w-6 h-6 text-accent" />
        </div>
        <span className="text-4xl font-heading font-semibold text-foreground">
          {value}
        </span>
      </div>
      <div>
        <p className="text-sm uppercase tracking-wider text-muted mb-2">{label}</p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted">{description}</p>
          <ArrowUpRight className="w-4 h-4 text-muted shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </div>
  </div>
));

const AboutPage = () => {
  const statsData = [
    {
      icon: Code,
      value: 68,
      label: "Total Projects",
      description: "Innovative web solutions crafted",
      animation: "fade-up",
    },
    {
      icon: Award,
      value: 4,
      label: "Certificates",
      description: "Professional skills validated",
      animation: "fade-up",
    },
    {
      icon: Globe,
      value: 3,
      label: "Years of Experience",
      description: "Continuous learning journey",
      animation: "fade-up",
    },
  ];

  return (
    <div
      className="h-auto pb-[10%] bg-background text-foreground overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10"
      id="About"
    >
      <Header />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <span className="text-muted">Hello, I&apos;m</span>
              <span className="block mt-2">Wahyu Oktavian</span>
            </h2>

            <p
              className="text-base sm:text-lg text-muted leading-relaxed text-justify pb-4 sm:pb-0"
              data-aos="fade-up"
              data-aos-duration="1200"
            >
              I am a Software Engineer and IT Support professional with 3 years
              of hands-on experience. I design and ship web applications
              (Laravel, JavaScript/TypeScript, Angular), then support the same
              systems in production — troubleshooting, maintenance, and user
              enablement. I look for a team where I can own features end to end
              and keep infrastructure reliable.
            </p>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 w-full">
              <a
                href="https://drive.google.com/file/d/1OaHN3hVqncJR9-7HXDh2qLbWGYN6Nabp/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full lg:w-auto"
              >
                <button
                  type="button"
                  data-aos="fade-up"
                  data-aos-duration="800"
                  className="w-full lg:w-auto px-5 py-2.5 bg-accent text-on-accent text-sm font-medium transition-opacity duration-200 hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> View CV
                </button>
              </a>
              <a href="#Portofolio" className="w-full lg:w-auto">
                <button
                  type="button"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  className="w-full lg:w-auto px-5 py-2.5 border border-border text-foreground text-sm font-medium transition-colors duration-200 hover:border-accent hover:text-accent flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Code className="w-4 h-4" /> View Projects
                </button>
              </a>
            </div>
          </div>

          <ProfileImage />
        </div>

        <a href="#Portofolio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 cursor-pointer">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </a>
      </div>
    </div>
  );
};

export default memo(AboutPage);
