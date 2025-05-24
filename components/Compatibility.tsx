import { useState, useEffect } from "react";

const Personalization = () => {
  const screenshots = [
    "/assets/screenshots/win.png",
    "/assets/screenshots/linux.png",
    "/assets/screenshots/win7.png",
    "/assets/screenshots/macos.png",
  ];

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
    <div className="grid grid-cols-2 gap-12">
      <div className="flex flex-col gap-8 justify-center">
        <h1 className="text-5xl xl:text-6xl font-semibold flex flex-col 2xl:flex-row gap-4 xl:gap-8">
          <span>
            <span className="bg-gradient-to-r from-[#ffc182] to-[#5d64e4] bg-clip-text text-transparent">
              近乎完美
            </span>
            的
          </span>
          <span>兼容性</span>
        </h1>
        <p className="text-2xl xl:text-3xl leading-tight">
          Class Widgets 由 PyQt 构建，得以兼容 Windows、Linux、macOS
          三大主流操作系统
        </p>
      </div>
      <div className="aspect-video bg-[#E8E7F2] rounded-lg overflow-hidden">
        <img
          src={screenshots[currentImageIndex]}
          className={`w-full h-full object-contain transition-opacity ease-mobai-standard duration-500 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
    </div>
  );
};

export default Personalization;
