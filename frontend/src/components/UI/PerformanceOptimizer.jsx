import React, { useEffect } from "react";

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Optimize scroll performance
    let ticking = false;

    const optimizeScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Use transform3d to enable hardware acceleration
          document.body.style.transform = "translateZ(0)";
          ticking = false;
        });
        ticking = true;
      }
    };

    // Optimize animation performance
    const optimizeAnimations = () => {
      // Enable hardware acceleration for common elements
      const animatedElements = document.querySelectorAll("[data-animate]");
      animatedElements.forEach((element) => {
        element.style.willChange = "transform, opacity";
        element.style.backfaceVisibility = "hidden";
        element.style.perspective = "1000px";
      });
    };

    // Optimize image loading
    const optimizeImages = () => {
      const images = document.querySelectorAll("img[data-src]");
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    };

    // Add event listeners
    window.addEventListener("scroll", optimizeScroll, { passive: true });

    // Run optimizations
    optimizeAnimations();
    optimizeImages();

    // Cleanup
    return () => {
      window.removeEventListener("scroll", optimizeScroll);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;
