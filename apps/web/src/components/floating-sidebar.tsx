import { useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { Download, FileText, Moon, Sun } from "lucide-react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const CARD_WIDTH = 74;
const CARD_PAD = 12;
const ICON_SIZE = 48;
const COLLAPSED_BAR_LEFT = 6;
const COLLAPSED_CARD_LEFT = COLLAPSED_BAR_LEFT - CARD_WIDTH;
const EXPANDED_CARD_LEFT = 18;
const EXPANDED_BAR_LEFT = EXPANDED_CARD_LEFT + CARD_WIDTH;
const HANDLE_TRAVEL = EXPANDED_BAR_LEFT - COLLAPSED_BAR_LEFT;
const CARD_TRAVEL = EXPANDED_CARD_LEFT - COLLAPSED_CARD_LEFT;

const itemClassName =
  "group pointer-events-auto relative z-10 flex h-12 w-max min-w-12 items-center overflow-hidden rounded-full transition-colors duration-300";

const handleClassName =
  "pointer-events-none absolute top-1/2 z-8 h-28 w-1 -translate-y-1/2 rounded-full bg-linear-to-b from-[#6b8098] to-[#526174] shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_0_0_1px_rgb(82_97_116/0.22),0_4px_18px_rgb(8_14_23/0.3)] after:pointer-events-none after:absolute after:-inset-1.5 after:animate-pulse after:rounded-[inherit] after:shadow-[0_0_18px_rgb(82_97_116/0.42)] after:content-[''] motion-reduce:after:animate-none dark:from-white/90 dark:to-white/62 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.72),0_0_0_1px_rgb(255_255_255/0.42),0_4px_18px_rgb(0_0_0/0.34)] dark:after:shadow-[0_0_18px_rgb(255_255_255/0.32)]";

const glassClassName =
  "pointer-events-none absolute inset-y-0 left-0 isolate overflow-hidden rounded-[42px] border border-white/40 bg-[linear-gradient(165deg,rgb(255_255_255/0.3)_0%,rgb(255_255_255/0.1)_46%,rgb(255_255_255/0.16)_100%)] shadow-[inset_0_1px_0_rgb(255_255_255/0.58),inset_0_-10px_18px_rgb(255_255_255/0.04),0_14px_40px_rgb(20_32_52/0.1),0_2px_6px_rgb(20_32_52/0.04)] backdrop-blur-[22px] backdrop-saturate-[1.55] dark:border-white/14 dark:bg-[linear-gradient(165deg,rgb(255_255_255/0.14)_0%,rgb(255_255_255/0.05)_48%,rgb(255_255_255/0.08)_100%)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.18),inset_0_-10px_18px_rgb(0_0_0/0.16),0_14px_40px_rgb(0_0_0/0.34)]";

const chipClassName =
  "border border-white/45 bg-linear-to-b from-white/42 to-white/20 shadow-[inset_0_1px_0_rgb(255_255_255/0.55),0_6px_16px_rgb(30_50_80/0.08)] backdrop-blur-md backdrop-saturate-[1.35] dark:border-white/12 dark:from-white/16 dark:to-white/7 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_6px_16px_rgb(0_0_0/0.22)]";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function collapseLabels(labels: HTMLSpanElement[]) {
  gsap.killTweensOf(labels);
  gsap.to(labels, {
    width: 0,
    paddingRight: 0,
    autoAlpha: 0,
    duration: prefersReducedMotion() ? 0 : 0.22,
    stagger: { each: 0.03, from: "end" },
    ease: "power3.in",
    overwrite: true,
  });
}

function SidebarItem({
  label,
  ariaLabel,
  className,
  children,
  href,
  onClick,
}: {
  label: string;
  ariaLabel: string;
  className: string;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!labelRef.current) return;
    gsap.set(labelRef.current, { width: 0, paddingRight: 0, autoAlpha: 0 });
  }, { scope: labelRef });

  const content = (
    <>
      <span className="grid size-12 shrink-0 place-items-center">{children}</span>
      <span
        className="inline-block overflow-hidden text-[13px] font-medium tracking-[-0.02em] whitespace-nowrap"
        data-sidebar-label="true"
        ref={labelRef}
      >
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <a aria-label={ariaLabel} className={className} download href={href}>
        {content}
      </a>
    );
  }

  return (
    <button aria-label={ariaLabel} className={className} onClick={onClick} type="button">
      {content}
    </button>
  );
}

export function FloatingSidebar() {
  const rootRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef(false);
  const itemsExpandedRef = useRef(false);
  const sidebarTlRef = useRef<gsap.core.Timeline | null>(null);
  const [isDark, setIsDark] = useState(false);

  const getLabels = () => {
    if (!cardRef.current) return [];
    return [...cardRef.current.querySelectorAll("[data-sidebar-label]")] as HTMLSpanElement[];
  };

  useGSAP(() => {
    if (!handleRef.current || !cardRef.current || !glassRef.current) return;

    gsap.set(handleRef.current, { x: 0, autoAlpha: 1 });
    gsap.set(cardRef.current, {
      x: 0,
      autoAlpha: 0,
      scale: 0.94,
      transformOrigin: "left center",
    });
    gsap.set(glassRef.current, { width: CARD_WIDTH });

    return () => {
      sidebarTlRef.current?.kill();
    };
  }, { scope: rootRef });

  const setItemsExpanded = (expanded: boolean) => {
    if (!glassRef.current) return;
    if (itemsExpandedRef.current === expanded) return;
    itemsExpandedRef.current = expanded;

    const labels = getLabels();
    const instant = prefersReducedMotion();
    gsap.killTweensOf([glassRef.current, ...labels]);

    if (expanded) {
      if (handleRef.current) {
        gsap.to(handleRef.current, {
          autoAlpha: 0,
          duration: instant ? 0 : 0.14,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      const widths = labels.map((label) => {
        gsap.set(label, { width: "auto", paddingRight: 14, autoAlpha: 0 });
        const width = label.offsetWidth;
        gsap.set(label, { width: 0, paddingRight: 0, autoAlpha: 0 });
        return width;
      });
      const glassWidth = CARD_PAD + ICON_SIZE + Math.max(0, ...widths) + CARD_PAD;

      gsap.to(labels, {
        width: (index: number) => widths[index] ?? 0,
        paddingRight: 14,
        autoAlpha: 1,
        duration: instant ? 0 : 0.4,
        stagger: instant ? 0 : 0.045,
        ease: "power3.out",
        overwrite: true,
      });
      gsap.to(glassRef.current, {
        width: glassWidth,
        duration: instant ? 0 : 0.42,
        ease: "power3.out",
        overwrite: true,
      });
      return;
    }

    collapseLabels(labels);
    gsap.to(glassRef.current, {
      width: CARD_WIDTH,
      duration: instant ? 0 : 0.28,
      ease: "power3.in",
      overwrite: true,
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useGSAP(() => {
    if (!itemsExpandedRef.current || !glassRef.current) return;

    const labels = getLabels();
    let maxLabelWidth = 0;
    for (const label of labels) {
      gsap.set(label, { width: "auto", paddingRight: 14, autoAlpha: 1 });
      maxLabelWidth = Math.max(maxLabelWidth, label.offsetWidth);
    }
    gsap.set(glassRef.current, { width: CARD_PAD + ICON_SIZE + maxLabelWidth + CARD_PAD });
  }, { dependencies: [isDark], scope: rootRef });

  const animateSidebar = (expanded: boolean) => {
    if (!handleRef.current || !cardRef.current || !glassRef.current) return;
    if (expanded !== isHoveringRef.current) return;

    const instant = prefersReducedMotion();
    sidebarTlRef.current?.kill();
    gsap.killTweensOf([handleRef.current, cardRef.current]);

    if (expanded) {
      gsap.set(handleRef.current, { x: 0, autoAlpha: 1 });
      gsap.set(cardRef.current, { x: 0, autoAlpha: 0, scale: 0.94 });

      if (instant) {
        gsap.set(handleRef.current, { x: HANDLE_TRAVEL, autoAlpha: 0 });
        gsap.set(cardRef.current, { x: CARD_TRAVEL, autoAlpha: 1, scale: 1 });
        return;
      }

      sidebarTlRef.current = gsap.timeline({ defaults: { overwrite: true, force3D: true } })
        .to(handleRef.current, {
          x: HANDLE_TRAVEL,
          duration: 0.68,
          ease: "power4.out",
        })
        .to(cardRef.current, {
          x: CARD_TRAVEL,
          autoAlpha: 1,
          scale: 1,
          duration: 0.52,
          ease: "power3.out",
        }, 0.36)
        .to(handleRef.current, {
          autoAlpha: 0,
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
        }, 0.42);
      return;
    }

    setItemsExpanded(false);
    gsap.set(handleRef.current, { x: 0, autoAlpha: 0 });

    if (instant) {
      gsap.set(cardRef.current, { x: 0, autoAlpha: 0, scale: 0.94 });
      gsap.set(handleRef.current, { autoAlpha: 1 });
      return;
    }

    sidebarTlRef.current = gsap.timeline({ defaults: { overwrite: true, force3D: true } })
      .to(cardRef.current, {
        x: 0,
        autoAlpha: 0,
        scale: 0.96,
        duration: 0.32,
        ease: "power3.in",
      })
      .to(handleRef.current, {
        autoAlpha: 1,
        duration: 0.28,
        ease: "power2.out",
      });
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
      className="fixed left-0 top-1/2 z-8 h-56 w-70 -translate-y-1/2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={rootRef}
    >
      <div
        className={handleClassName}
        style={{ left: `${COLLAPSED_BAR_LEFT}px` }}
        ref={handleRef}
      />
      <div
        className="pointer-events-none absolute top-0 z-9 flex h-56 flex-col items-start justify-center opacity-0"
        style={{ left: `${COLLAPSED_CARD_LEFT}px` }}
        ref={cardRef}
      >
        <div
          className={glassClassName}
          aria-hidden="true"
          ref={glassRef}
        />
        <div
          className="pointer-events-auto relative z-10 flex h-full flex-col items-start justify-center gap-3 py-5 pr-3 pl-3"
          onMouseEnter={() => setItemsExpanded(true)}
          onMouseLeave={() => setItemsExpanded(false)}
        >
          <SidebarItem
            ariaLabel="下载产品手册"
            className={`${chipClassName} ${itemClassName} text-[#17202b] hover:bg-white/40 hover:text-[#1e6eff] dark:text-white/82 dark:hover:bg-white/14 dark:hover:text-white`}
            href="/docs/product-guide.pdf"
            label="产品手册"
          >
            <Download className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:scale-105" size={21} strokeWidth={1.7} />
          </SidebarItem>
          <SidebarItem
            ariaLabel="下载开发者文档"
            className={`${itemClassName} text-[#536171] hover:bg-white/30 hover:text-[#17202b] dark:text-white/48 dark:hover:bg-white/8 dark:hover:text-white/82`}
            href="/docs/developer-guide.pdf"
            label="开发者文档"
          >
            <FileText className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:scale-105" size={21} strokeWidth={1.7} />
          </SidebarItem>
          <SidebarItem
            ariaLabel={isDark ? "切换到浅色模式" : "切换到深色模式"}
            className={`${itemClassName} cursor-pointer text-[#536171] hover:bg-white/30 hover:text-[#17202b] dark:text-white/48 dark:hover:bg-white/8 dark:hover:text-white/82`}
            label={isDark ? "浅色模式" : "深色模式"}
            onClick={() => setIsDark((current) => !current)}
          >
            {isDark ? (
              <Moon className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-12 group-hover:scale-105" size={20} />
            ) : (
              <Sun className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 group-hover:scale-105" size={20} />
            )}
          </SidebarItem>
        </div>
      </div>
    </div>
  );
}
