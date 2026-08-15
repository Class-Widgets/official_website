import { useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { Download, FileText, Moon, Pin, PinOff, Sun } from "lucide-react";
import gsap from "gsap";
import { useTheme } from "../lib/theme";

gsap.registerPlugin(useGSAP);

const CARD_PAD = 12;
const ICON_SIZE = 48;
const CARD_WIDTH = ICON_SIZE + CARD_PAD * 2;
const LABEL_PAD_RIGHT = 14;
const COLLAPSED_BAR_LEFT = 6;
const COLLAPSED_CARD_LEFT = COLLAPSED_BAR_LEFT - CARD_WIDTH;
const EXPANDED_CARD_LEFT = 18;
const EXPANDED_BAR_LEFT = EXPANDED_CARD_LEFT + CARD_WIDTH;
const HANDLE_TRAVEL = EXPANDED_BAR_LEFT - COLLAPSED_BAR_LEFT;
const CARD_TRAVEL = EXPANDED_CARD_LEFT - COLLAPSED_CARD_LEFT;
const SIDEBAR_PINNED_KEY = "cw-sidebar-pinned";

export function getStoredSidebarPinned(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_PINNED_KEY) === "true";
  } catch {
    return false;
  }
}

export function getPinnedOccupiedRight() {
  return EXPANDED_CARD_LEFT + CARD_WIDTH;
}

function persistSidebarPinned(pinned: boolean) {
  try {
    localStorage.setItem(SIDEBAR_PINNED_KEY, String(pinned));
  } catch {
    // Private mode or blocked storage.
  }
}

export type SidebarOccupyChange = {
  occupiedRight: number;
  duration: number;
  delay?: number;
};

const itemClassName =
  "group pointer-events-auto relative z-10 flex h-12 min-w-12 items-center justify-center overflow-hidden rounded-full p-0 transition-colors duration-300";

const handleClassName =
  "pointer-events-none absolute top-1/2 z-8 h-28 w-1 -translate-y-1/2 rounded-full bg-linear-to-b from-[#6b8098] to-[#526174] shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_0_0_1px_rgb(82_97_116/0.18),0_2px_8px_rgb(8_14_23/0.14)] after:pointer-events-none after:absolute after:-inset-1.5 after:animate-pulse after:rounded-[inherit] after:shadow-[0_0_10px_rgb(82_97_116/0.2)] after:content-[''] motion-reduce:after:animate-none dark:from-white/90 dark:to-white/62 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.72),0_0_0_1px_rgb(255_255_255/0.36),0_2px_8px_rgb(0_0_0/0.18)] dark:after:shadow-[0_0_10px_rgb(255_255_255/0.16)]";

const glassClassName =
  "relative isolate flex h-full flex-col overflow-hidden rounded-[42px] border border-white/44 bg-[linear-gradient(165deg,rgb(248_253_255/0.42)_0%,rgb(220_238_245/0.34)_46%,rgb(248_253_255/0.22)_100%)] shadow-[inset_0_1px_0_rgb(255_255_255/0.7),inset_0_0_0_1px_rgb(255_255_255/0.1),0_8px_24px_-10px_rgb(24_42_66/0.08),0_2px_6px_rgb(24_42_66/0.03)] backdrop-blur-[22px] backdrop-saturate-[1.35] dark:border-white/14 dark:bg-[linear-gradient(165deg,rgb(21_29_38/0.62)_0%,rgb(11_20_28/0.48)_48%,rgb(21_29_38/0.55)_100%)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.14),inset_0_0_0_1px_rgb(255_255_255/0.05),0_10px_28px_-12px_rgb(0_0_0/0.22),0_2px_8px_rgb(0_0_0/0.1)]";

const selectedClassName =
  "bg-[#17202b]/8 text-[#2b9fd4] dark:bg-white/12 dark:text-[#7ecdee]";

const itemMutedClassName =
  "text-[#4a6d82] hover:bg-[#17202b]/8 hover:text-[#17202b] dark:text-white/48 dark:hover:bg-white/12 dark:hover:text-white/82";

const FINE_HOVER_QUERY = "(hover: hover) and (pointer: fine)";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function canHoverFine() {
  return window.matchMedia(FINE_HOVER_QUERY).matches;
}

function collapseLabels(labels: HTMLSpanElement[]) {
  gsap.killTweensOf(labels);
  gsap.to(labels, {
    width: 0,
    minWidth: 0,
    paddingRight: 0,
    autoAlpha: 0,
    duration: prefersReducedMotion() ? 0 : 0.22,
    stagger: { each: 0.03, from: "end" },
    ease: "power3.in",
    overwrite: true,
  });
}

function measureMaxLabelWidth(labels: HTMLSpanElement[]) {
  let maxWidth = 0;
  for (const label of labels) {
    gsap.set(label, { width: "auto", paddingRight: LABEL_PAD_RIGHT });
    maxWidth = Math.max(maxWidth, label.offsetWidth);
  }
  return maxWidth;
}

function SidebarItem({
  label,
  ariaLabel,
  className,
  children,
  href,
  onClick,
  pressed,
}: {
  label: string;
  ariaLabel: string;
  className: string;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  pressed?: boolean;
}) {
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!labelRef.current) return;
    gsap.set(labelRef.current, { width: 0, minWidth: 0, paddingRight: 0, autoAlpha: 0 });
  }, { scope: labelRef });

  const content = (
    <>
      <span className="grid size-12 shrink-0 place-items-center">{children}</span>
      <span
        className="inline-flex h-full min-w-0 shrink items-center overflow-hidden text-[13px] leading-none font-medium tracking-[-0.02em] whitespace-nowrap"
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
    <button aria-label={ariaLabel} aria-pressed={pressed} className={className} onClick={onClick} type="button">
      {content}
    </button>
  );
}

export function FloatingSidebar({
  onOccupy,
}: {
  onOccupy?: (change: SidebarOccupyChange) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const { isDark, toggleTheme } = useTheme();
  const [isPinned, setIsPinned] = useState(getStoredSidebarPinned);
  const [isOpen, setIsOpen] = useState(isPinned);
  const isHoveringRef = useRef(false);
  const isOpenRef = useRef(isPinned);
  const isPinnedRef = useRef(isPinned);
  const itemsExpandedRef = useRef(false);
  const sidebarTlRef = useRef<gsap.core.Timeline | null>(null);
  const onOccupyRef = useRef(onOccupy);
  const canHoverRef = useRef(canHoverFine());
  const animateSidebarRef = useRef<(expanded: boolean) => void>(() => {});
  const setItemsExpandedRef = useRef<(expanded: boolean) => void>(() => {});
  const [useHover, setUseHover] = useState(canHoverFine);

  const isOccupied = () => isHoveringRef.current || isPinnedRef.current;

  useEffect(() => {
    onOccupyRef.current = onOccupy;
  }, [onOccupy]);

  useEffect(() => {
    const media = window.matchMedia(FINE_HOVER_QUERY);
    const sync = () => {
      canHoverRef.current = media.matches;
      setUseHover(media.matches);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const emitOccupy = (glassWidth: number, duration: number, delay = 0) => {
    const instant = prefersReducedMotion();
    onOccupyRef.current?.({
      occupiedRight: isOccupied() ? EXPANDED_CARD_LEFT + glassWidth : 0,
      duration: instant ? 0 : duration,
      delay: instant ? 0 : delay,
    });
  };

  const getLabels = () => {
    if (!cardRef.current) return [];
    return [...cardRef.current.querySelectorAll("[data-sidebar-label]")] as HTMLSpanElement[];
  };

  useGSAP(() => {
    if (!handleRef.current || !cardRef.current || !glassRef.current) return;

    gsap.set(cardRef.current, { transformOrigin: "left center" });
    gsap.set(glassRef.current, { width: CARD_WIDTH });

    if (isPinnedRef.current) {
      gsap.set(handleRef.current, { x: HANDLE_TRAVEL, autoAlpha: 0 });
      gsap.set(cardRef.current, {
        x: CARD_TRAVEL,
        autoAlpha: 1,
        scale: 1,
      });
      emitOccupy(CARD_WIDTH, 0);
    } else {
      gsap.set(handleRef.current, { x: 0, autoAlpha: 1 });
      gsap.set(cardRef.current, {
        x: 0,
        autoAlpha: 0,
        scale: 0.94,
      });
    }

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

      const maxLabelWidth = measureMaxLabelWidth(labels);
      for (const label of labels) {
        gsap.set(label, { width: 0, minWidth: 0, paddingRight: 0, autoAlpha: 0 });
      }
      const glassWidth = CARD_PAD + ICON_SIZE + maxLabelWidth + CARD_PAD;

      gsap.to(labels, {
        width: maxLabelWidth,
        paddingRight: LABEL_PAD_RIGHT,
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
      emitOccupy(glassWidth, 0.5);
      return;
    }

    collapseLabels(labels);
    gsap.to(glassRef.current, {
      width: CARD_WIDTH,
      duration: instant ? 0 : 0.28,
      ease: "power3.in",
      overwrite: true,
    });
    if (isOccupied()) emitOccupy(CARD_WIDTH, 0.45);
  };

  useGSAP(() => {
    if (!itemsExpandedRef.current || !glassRef.current) return;

    const labels = getLabels();
    const maxLabelWidth = measureMaxLabelWidth(labels);
    gsap.set(labels, {
      width: maxLabelWidth,
      paddingRight: LABEL_PAD_RIGHT,
      autoAlpha: 1,
    });
    const glassWidth = CARD_PAD + ICON_SIZE + maxLabelWidth + CARD_PAD;
    gsap.set(glassRef.current, { width: glassWidth });
    if (isOccupied()) emitOccupy(glassWidth, 0);
  }, { dependencies: [isDark, isPinned], scope: rootRef });

  const animateSidebar = (expanded: boolean) => {
    if (!handleRef.current || !cardRef.current || !glassRef.current) return;
    if (expanded === isOpenRef.current) return;
    isOpenRef.current = expanded;
    setIsOpen(expanded);

    const instant = prefersReducedMotion();
    sidebarTlRef.current?.kill();
    gsap.killTweensOf([handleRef.current, cardRef.current]);

    if (expanded) {
      gsap.set(handleRef.current, { x: 0, autoAlpha: 1 });
      gsap.set(cardRef.current, { x: 0, autoAlpha: 0, scale: 0.94 });

      if (instant) {
        gsap.set(handleRef.current, { x: HANDLE_TRAVEL, autoAlpha: 0 });
        gsap.set(cardRef.current, { x: CARD_TRAVEL, autoAlpha: 1, scale: 1 });
        emitOccupy(CARD_WIDTH, 0);
        return;
      }

      emitOccupy(CARD_WIDTH, 0.55, 0.28);
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
    emitOccupy(CARD_WIDTH, instant ? 0 : 0.55);
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

  useEffect(() => {
    animateSidebarRef.current = animateSidebar;
    setItemsExpandedRef.current = setItemsExpanded;
  });

  const handleMouseEnter = () => {
    if (!canHoverRef.current) return;
    isHoveringRef.current = true;
    animateSidebar(true);
  };

  const handleMouseLeave = () => {
    if (!canHoverRef.current) return;
    isHoveringRef.current = false;
    if (isPinnedRef.current) {
      setItemsExpanded(false);
      return;
    }
    animateSidebar(false);
  };

  const toggleSidebar = () => {
    if (isOpenRef.current) {
      isHoveringRef.current = false;
      if (isPinnedRef.current) {
        setItemsExpanded(false);
        return;
      }
      animateSidebar(false);
      return;
    }

    isHoveringRef.current = true;
    animateSidebar(true);
  };

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (canHoverRef.current) return;
      if (!isOpenRef.current) return;
      if (rootRef.current?.contains(event.target as Node)) return;

      isHoveringRef.current = false;
      if (isPinnedRef.current) {
        setItemsExpandedRef.current(false);
        return;
      }
      animateSidebarRef.current(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const togglePinned = () => {
    const next = !isPinnedRef.current;
    isPinnedRef.current = next;
    setIsPinned(next);
    persistSidebarPinned(next);

    if (next) {
      animateSidebar(true);
      return;
    }

    if (!isHoveringRef.current) animateSidebar(false);
  };

  return (
    <div
      className={`fixed left-0 top-1/2 z-8 h-72 w-70 -translate-y-1/2${useHover ? "" : " pointer-events-none"}`}
      onMouseEnter={useHover ? handleMouseEnter : undefined}
      onMouseLeave={useHover ? handleMouseLeave : undefined}
      ref={rootRef}
    >
      <div
        className={handleClassName}
        style={{ left: `${COLLAPSED_BAR_LEFT}px` }}
        ref={handleRef}
      />
      {!useHover && !isOpen && (
        <button
          aria-expanded={false}
          aria-label="展开侧栏"
          className="pointer-events-auto absolute top-1/2 left-0 z-10 h-40 w-11 -translate-y-1/2 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b9fd4]/70"
          onClick={toggleSidebar}
          type="button"
        />
      )}
      <div
        className="pointer-events-none absolute top-0 z-9 flex h-72 flex-col items-start justify-center opacity-0"
        style={{ left: `${COLLAPSED_CARD_LEFT}px` }}
        ref={cardRef}
      >
        <div
          className={glassClassName}
          ref={glassRef}
        >
          <div
            className={`relative z-10 flex h-full w-full flex-col items-center justify-center gap-3 py-5${
              useHover || isOpen ? " pointer-events-auto" : " pointer-events-none"
            }`}
            onClick={() => {
              if (!canHoverRef.current) setItemsExpanded(true);
            }}
            onMouseEnter={useHover ? () => setItemsExpanded(true) : undefined}
            onMouseLeave={useHover ? () => setItemsExpanded(false) : undefined}
          >
            <SidebarItem
              ariaLabel="下载产品手册"
              className={`${itemClassName} ${selectedClassName}`}
              href="/docs/product-guide.pdf"
              label="产品手册"
            >
              <Download className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:scale-105" size={21} strokeWidth={1.7} />
            </SidebarItem>
            <SidebarItem
              ariaLabel="下载开发者文档"
              className={`${itemClassName} ${itemMutedClassName}`}
              href="/docs/developer-guide.pdf"
              label="开发者文档"
            >
              <FileText className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:scale-105" size={21} strokeWidth={1.7} />
            </SidebarItem>
            <SidebarItem
              ariaLabel={isDark ? "切换到浅色模式" : "切换到深色模式"}
              className={`${itemClassName} ${itemMutedClassName} cursor-pointer`}
              label={isDark ? "浅色模式" : "深色模式"}
              onClick={toggleTheme}
            >
              {isDark ? (
                <Moon className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-12 group-hover:scale-105" size={20} />
              ) : (
                <Sun className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 group-hover:scale-105" size={20} />
              )}
            </SidebarItem>
            <SidebarItem
              ariaLabel={isPinned ? "取消固定侧栏" : "固定侧栏"}
              className={`${itemClassName} cursor-pointer ${isPinned ? selectedClassName : itemMutedClassName}`}
              label={isPinned ? "取消固定" : "固定侧栏"}
              onClick={togglePinned}
              pressed={isPinned}
            >
              {isPinned ? (
                <PinOff className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-12 group-hover:scale-105" size={20} strokeWidth={1.7} />
              ) : (
                <Pin className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-12 group-hover:scale-105" size={20} strokeWidth={1.7} />
              )}
            </SidebarItem>
          </div>
        </div>
      </div>
    </div>
  );
}
