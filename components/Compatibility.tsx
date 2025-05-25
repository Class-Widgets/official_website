import Linux from "@/assets/screenshots/linux.png";
import MacOS from "@/assets/screenshots/macos.png";
import Win7 from "@/assets/screenshots/win7.png";
import Win from "@/assets/screenshots/win.png";
import { useEffect, useState } from "react";
  
const Personalization = () => {
  const screenshots = [Win, Linux, Win7, MacOS].map((it) => it.src);

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
      <div className="order-2 aspect-video overflow-hidden rounded-lg bg-[#E8E7F2] lg:order-1">
        <img
          src={screenshots[currentImageIndex]}
          className={`ease-mobai-standard h-full w-full object-contain transition-opacity duration-500 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
      <div className="order-1 flex flex-col justify-center gap-8 lg:order-2 lg:items-end">
        <h1 className="ease-mobai-bounce flex flex-col gap-2 text-3xl font-semibold transition-all duration-500 lg:gap-4 lg:text-right lg:text-4xl xl:gap-8 xl:text-5xl">
          <span>
            <span className="bg-gradient-to-r from-[#ffc182] to-[#5d64e4] bg-clip-text text-transparent">
              近乎完美
            </span>
            的
          </span>
          <span>兼容性</span>
        </h1>
        <p className="text-lg leading-tight whitespace-pre-line lg:text-right xl:text-xl">
          {`Class Widgets 由 PyQt 构建\n得以兼容 Windows、Linux、MacOS 三大主流操作系统`}
        </p>
      </div>
    </div>
  );
};

export default Personalization;
