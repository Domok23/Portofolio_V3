import { memo } from "react";
import { Github, Linkedin, Mail, ExternalLink, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import TypeCycle from "../components/TypeCycle";

const TECH_STACK = ["Laravel", "TypeScript", "JavaScript", "Angular"];
const ROLE_LINES = ["& IT Support", "Full-Stack Builder", "Systems Keeper"];
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
    <section
      id="Home"
      className="min-h-screen bg-background cyber-grid overflow-hidden"
    >
      <div className="container mx-auto px-[5%] sm:px-6 lg:px-12 min-h-screen flex flex-col justify-center pt-24 md:pt-32 pb-12">
        <div className="max-w-3xl space-y-6">
          <motion.p
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-5xl sm:text-6xl lg:text-8xl font-black uppercase tracking-widest text-accent cyber-glitch"
          >
            Domm
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold uppercase tracking-wide text-foreground"
          >
            Software Engineer
            <span className="block text-muted font-normal mt-2 text-xl sm:text-2xl min-h-[2.5rem]">
              <TypeCycle
                lines={ROLE_LINES}
                className="text-muted"
                cursorClassName="text-accent ml-0.5"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base sm:text-lg text-muted max-w-xl leading-relaxed tracking-wide"
          >
            I build and maintain web applications, and keep systems running day
            to day — bridging software delivery with reliable IT support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.55 }}
            className="flex flex-wrap gap-2"
          >
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="cyber-hover-glitch px-3 py-1.5 font-label text-sm uppercase tracking-wider border border-border text-foreground transition-all duration-150 hover:border-accent hover:text-accent hover:shadow-neon-sm"
              >
                {tech}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.7 }}
            className="flex flex-row flex-wrap gap-3"
          >
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
            <Button variant="glitch" href="#Portofolio">
              Projects <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
            </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" href="#Contact" className="cyber-hover-glitch">
              Contact <Mail className="w-4 h-4" strokeWidth={1.5} />
            </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="hidden sm:flex gap-2 pt-2"
          >
            {SOCIAL_LINKS.map(({ icon: Icon, link }) => (
              <motion.a
                key={link}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.94 }}
                className={`cyber-hover-glitch p-2.5 min-h-11 min-w-11 inline-flex items-center justify-center border border-border text-muted hover:text-accent hover:border-accent hover:shadow-neon-sm cursor-pointer cyber-chamfer-sm ${focusRing}`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(Home);
