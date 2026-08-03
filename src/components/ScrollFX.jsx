import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Light parallax on background blobs only — no section blur/scale. */
export default function ScrollFX() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-cyber-parallax]").forEach((el) => {
        const speed = Number(el.getAttribute("data-cyber-parallax")) || 40;
        gsap.fromTo(
          el,
          { y: 0 },
          {
            y: speed,
            ease: "none",
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
            },
          }
        );
      });
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return null;
}
