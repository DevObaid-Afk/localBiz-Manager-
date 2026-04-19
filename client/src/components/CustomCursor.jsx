import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px), (pointer: coarse)");

    const handleMediaChange = () => {
      const nextEnabled = !mediaQuery.matches;
      setEnabled(nextEnabled);
      document.documentElement.classList.toggle("custom-cursor-enabled", nextEnabled);
    };

    const handleMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    handleMediaChange();
    window.addEventListener("mousemove", handleMove);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      mediaQuery.removeEventListener("change", handleMediaChange);
      document.documentElement.classList.remove("custom-cursor-enabled");
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[80] h-8 w-8 rounded-full border border-brand-300 bg-brand-100/40 mix-blend-multiply backdrop-blur-sm dark:border-brand-700 dark:bg-brand-900/30"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        opacity: 1,
        scale: 1,
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 24,
        mass: 0.5,
      }}
    />
  );
}
