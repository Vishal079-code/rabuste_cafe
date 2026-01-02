import { useEffect } from "react";

const StoryIntro = ({ onSelect }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        color: "#fff",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "24px",
      }}
    >
      <h2>Do you want to deep dive into the Robusta story?</h2>

      <button
        onClick={() => onSelect("deep")}
        style={{ padding: "12px 24px" }}
      >
        Deep Dive
      </button>

      <button
        onClick={() => onSelect("free")}
        style={{ padding: "12px 24px" }}
      >
        Explore Myself
      </button>
    </div>
  );
};

export default StoryIntro;
