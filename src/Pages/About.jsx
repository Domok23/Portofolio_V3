import { memo } from "react";
import { FileText, Code, Award, Globe, ArrowUpRight } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import MotionSection from "../components/MotionSection";

const Header = memo(function Header() {
  return (
    <MotionSection className="text-center lg:mb-8 mb-2 px-[5%]">
      <h2 className="font-heading text-4xl md:text-5xl font-semibold uppercase tracking-wide text-foreground">
        About Me
      </h2>
      <p className="mt-2 font-label uppercase tracking-[0.15em] text-muted max-w-2xl mx-auto text-sm sm:text-base">
        Transforming ideas into digital experiences
      </p>
    </MotionSection>
  );
});

const ProfileImage = memo(function ProfileImage() {
  return (
    <MotionSection delay={0.15} className="flex justify-end items-center sm:p-12 sm:py-0 p-0 py-2">
      <Card
        variant="holographic"
        className="w-72 h-72 sm:w-80 sm:h-80 overflow-hidden p-0 cyber-hover-glitch"
      >
        <img
          src="https://domok23.github.io/profile/images/bg_1a.png"
          alt="Profile"
          className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-105"
          loading="lazy"
        />
      </Card>
    </MotionSection>
  );
});

const StatCard = memo(function StatCard({
  icon: Icon,
  value,
  label,
  description,
  delay,
}) {
  return (
    <MotionSection delay={delay} className="relative group">
      <Card
        hoverEffect
        className="p-6 h-full flex flex-col justify-between cyber-hover-glitch"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 flex items-center justify-center border border-border transition-colors duration-150 group-hover:border-accent group-hover:shadow-neon-sm">
            <Icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
          </div>
          <span className="text-4xl font-heading font-semibold text-foreground">
            {value}
          </span>
        </div>
        <div>
          <p className="font-label text-sm uppercase tracking-wider text-muted mb-2">
            {label}
          </p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted tracking-wide">{description}</p>
            <ArrowUpRight
              className="w-4 h-4 text-muted shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </Card>
    </MotionSection>
  );
});

const AboutPage = () => {
  const statsData = [
    {
      icon: Code,
      value: 68,
      label: "Total Projects",
      description: "Innovative web solutions crafted",
      delay: 0,
    },
    {
      icon: Award,
      value: 4,
      label: "Certificates",
      description: "Professional skills validated",
      delay: 0.08,
    },
    {
      icon: Globe,
      value: 3,
      label: "Years of Experience",
      description: "Continuous learning journey",
      delay: 0.16,
    },
  ];

  return (
    <div
      className="h-auto pb-[10%] bg-background text-foreground overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 cyber-grid"
      id="About"
    >
      <Header />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <MotionSection>
            <Card variant="terminal" className="space-y-6 p-6 text-center lg:text-left">
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase tracking-wide text-foreground">
                <span className="text-muted">&gt; Hello, I&apos;m</span>
                <span className="block mt-2 text-accent cyber-glitch">
                  Wahyu Oktavian
                </span>
              </h2>

              <p className="text-base sm:text-lg text-muted leading-relaxed tracking-wide text-justify pb-4 sm:pb-0">
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
                <Button variant="glitch" className="w-full lg:w-auto">
                  <FileText className="w-4 h-4" strokeWidth={1.5} /> View CV
                </Button>
                </a>
                <a href="#Portofolio" className="w-full lg:w-auto">
                  <Button variant="outline" className="w-full lg:w-auto cyber-hover-glitch">
                    <Code className="w-4 h-4" strokeWidth={1.5} /> View Projects
                  </Button>
                </a>
              </div>
            </Card>
          </MotionSection>

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
