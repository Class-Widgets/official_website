import { useState, useEffect } from "react";
import Win from "@/assets/screenshots/win.png";
import Linux from "@/assets/screenshots/linux.png";
import Win7 from "@/assets/screenshots/win7.png";
import Macos from "@/assets/screenshots/macos.png";
const Personalization = () => {
  const screenshots = [Win, Linux, Win7, Macos].map((it) => it.src);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % screenshots.length,
        );
        setIsTransitioning(false);
      }, 250);
    }, 3000);

    return () => clearInterval(interval);
  }, [screenshots.length]);

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div className="flex flex-col justify-center gap-8">
        <h1 className="flex flex-col gap-4 text-3xl font-semibold lg:text-4xl xl:gap-8 xl:text-5xl 2xl:flex-row">
          <span>
            <span className="bg-gradient-to-r from-[#ffc182] to-[#5d64e4] bg-clip-text text-transparent">
              近乎完美
            </span>
            的
          </span>
          <span>兼容性</span>
        </h1>
        <p className="text-xl leading-tight xl:text-2xl">
          Class Widgets 由 PyQt 构建，得以兼容 Windows、Linux、macOS
          三大主流操作系统
        </p>
      </div>
      <div className="aspect-video overflow-hidden rounded-lg bg-[#E8E7F2]">
        <img
          src={screenshots[currentImageIndex]}
          className={`ease-mobai-standard h-full w-full object-contain transition-opacity duration-500 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
    </div>
  );
};

export default Personalization;
