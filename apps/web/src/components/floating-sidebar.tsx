import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Download, FileText, Moon, Sun } from "lucide-react";
import gsap from "gsap";

const CARD_WIDTH = 68;
const COLLAPSED_BAR_LEFT = 6;
const COLLAPSED_CARD_LEFT = COLLAPSED_BAR_LEFT - CARD_WIDTH;
const EXPANDED_CARD_LEFT = 18;
const EXPANDED_BAR_LEFT = EXPANDED_CARD_LEFT + CARD_WIDTH;

export function FloatingSidebar() {
  const handleRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef(false);
  const animationIdRef = useRef(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useLayoutEffect(() => {
    if (!handleRef.current || !cardRef.current) return;

    gsap.set(handleRef.current, {
      left: `${COLLAPSED_BAR_LEFT}px`,
      opacity: 1,
    });
    gsap.set(cardRef.current, {
      left: `${COLLAPSED_CARD_LEFT}px`,
      opacity: 0,
    });
  }, []);

  const animateSidebar = (expanded: boolean) => {
    if (!handleRef.current || !cardRef.current) return;

    // 1. 忽略已经过期的鼠标状态，避免展开和收起互相抢动画。
    if (expanded !== isHoveringRef.current) return;

    const animationId = ++animationIdRef.current;
    gsap.killTweensOf([handleRef.current, cardRef.current]);
    if (expanded) {
      // 每次展开都从收起坐标重新开始，避免沿用上一次动画的终点。
      gsap.set(handleRef.current, {
        left: `${COLLAPSED_BAR_LEFT}px`,
        opacity: 1,
      });
      gsap.set(cardRef.current, {
        left: `${COLLAPSED_CARD_LEFT}px`,
        opacity: 0,
      });

      gsap.timeline({ defaults: { overwrite: true } })
        .to(handleRef.current, {
          left: `${EXPANDED_BAR_LEFT}px`,
          duration: 0.75,
          ease: "back.out(1.4)",
        })
        .to(cardRef.current, {
          left: `${EXPANDED_CARD_LEFT}px`,
          opacity: 1,
          duration: 0.56,
          ease: "power3.out",
        }, 0.46)
        // 2. 只有滑动动画仍是当前动画时才渐隐，收起动画会让序号失效。
        .call(() => {
          if (animationId === animationIdRef.current) {
            gsap.to(handleRef.current, {
              opacity: 0,
              duration: 0.36,
              ease: "power2.out",
              overwrite: true,
            });
          }
        });
    } else {
      // 3. 先完整收回卡片，再让白条在原位渐显。
      gsap.set(handleRef.current, {
        left: `${COLLAPSED_BAR_LEFT}px`,
        opacity: 0,
      });

      gsap.timeline({ defaults: { overwrite: true } })
        .to(cardRef.current, {
          left: `${COLLAPSED_CARD_LEFT}px`,
          opacity: 0,
          duration: 0.36,
          ease: "power3.in",
        })
        .to(handleRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
    }
  };

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    animateSidebar(true);
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    animateSidebar(false);
  };

  return (
    <div
      className="fixed left-0 top-1/2 z-8 h-83.75 w-70 -translate-y-1/2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute top-1/2 z-10 h-31 w-1.5 -translate-y-1/2 rounded-full bg-[#465366] opacity-100 shadow-[0_0_0_1px_rgb(70_83_102/0.24),0_2px_13px_rgb(25_35_50/0.24)] dark:bg-white dark:shadow-[0_0_0_1px_rgb(255_255_255/0.7),0_2px_13px_rgb(25_35_50/0.24)]"
        style={{ left: `${COLLAPSED_BAR_LEFT}px` }}
        ref={handleRef}
      />
      <div
        className="pointer-events-none absolute top-0 z-9 flex h-83.75 w-17 flex-col items-center justify-center gap-4 rounded-[38px] border border-white/90 bg-white/65 py-5 opacity-0 shadow-[0_20px_60px_rgb(23_47_75/0.12)] backdrop-blur-3xl dark:border-white/10 dark:bg-[#232a35]/70"
        style={{ left: `${COLLAPSED_CARD_LEFT}px` }}
        ref={cardRef}
      >
        <a
          aria-label="下载产品手册"
          className="pointer-events-auto grid size-12 place-items-center rounded-full bg-white/15 text-[#17202b] transition hover:scale-105 hover:bg-[#1e6eff]/10 hover:text-[#1e6eff] dark:text-[#f1f5fa]"
          href="/docs/product-guide.pdf"
          download
        >
          <Download size={21} strokeWidth={1.7} />
        </a>
        <a
          aria-label="下载开发者文档"
          className="pointer-events-auto grid size-12 place-items-center rounded-full text-[#77808c] transition hover:scale-105 hover:bg-[#1e6eff]/10 hover:text-[#1e6eff] dark:text-[#929aa6]"
          href="/docs/developer-guide.pdf"
          download
        >
          <FileText size={21} strokeWidth={1.7} />
        </a>
        <button
          aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
          className="pointer-events-auto grid size-12 cursor-pointer place-items-center rounded-full text-[#77808c] transition hover:scale-105 hover:bg-[#1e6eff]/10 hover:text-[#1e6eff] dark:text-[#929aa6]"
          onClick={() => setIsDark((current) => !current)}
          type="button"
        >
          {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </div>
  );
}
