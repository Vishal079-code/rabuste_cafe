import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/WhyRobusta.css";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    title: "Strength with clarity",
    body: "Robusta carries thicker crema, higher caffeine, and a textured body that stands up in milk or tonic.",
  },
  {
    title: "Flavor that holds art",
    body: "Deep cacao, burnt caramel, and spice give a canvas for playful ingredients without losing coffee.",
  },
  {
    title: "Philosophy",
    body: "We celebrate overlooked origins. Boldness is the point, not a side note.",
  },
];

const WhyRobusta = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".section-kicker", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(".section-title", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(".card", {
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".grid",
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert(); // 🔑 prevents GSAP breaking navbar
  }, []);

  return (
    <section id="why" ref={sectionRef}>
      <p className="section-kicker">Why Robusta</p>
      <h2 className="section-title">Because loud coffee can still feel cozy.</h2>

      <div className="grid three">
        {pillars.map((p) => (
          <div className="card" key={p.title}>
            <h3>{p.title}</h3>
            <p className="muted">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyRobusta;

