import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import coverImage from "../assets/home/cover.png";
import logoImage from "../assets/home/cw2_logo.png";
import { FloatingSidebar, type SidebarOccupyChange } from "../components/floating-sidebar";

gsap.registerPlugin(useGSAP);

const HOME_GLASS_GAP = 16;

function getGlassInset() {
  if (window.matchMedia("(min-width: 768px)").matches) return 20;
  if (window.matchMedia("(min-width: 640px)").matches) return 16;
  return 12;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const HERO_LIFT_SCALE = 0.82;

const ambientClassName =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_58%_44%_at_14%_6%,rgb(142_196_224/0.58),transparent_58%),radial-gradient(ellipse_46%_40%_at_88%_94%,rgb(168_210_230/0.46),transparent_62%),radial-gradient(ellipse_30%_26%_at_74%_14%,rgb(255_255_255/0.62),transparent_68%)] transition-[background] duration-300 dark:bg-[radial-gradient(ellipse_58%_44%_at_14%_6%,rgb(62_118_158/0.38),transparent_58%),radial-gradient(ellipse_46%_40%_at_88%_94%,rgb(28_56_82/0.55),transparent_62%),radial-gradient(ellipse_30%_26%_at_74%_14%,rgb(255_255_255/0.07),transparent_68%)]";

const glassFrameClassName =
  "pointer-events-none absolute top-3 right-3 bottom-3 left-[var(--sidebar-edge,0.75rem)] sm:top-4 sm:right-4 sm:bottom-4 sm:left-[var(--sidebar-edge,1rem)] md:top-5 md:right-5 md:bottom-5 md:left-[var(--sidebar-edge,1.25rem)]";

const glassClassName =
  "pointer-events-none absolute inset-0 isolate overflow-hidden rounded-[28px] border border-white/44 bg-[linear-gradient(165deg,rgb(255_255_255/0.3)_0%,rgb(255_255_255/0.08)_44%,rgb(255_255_255/0.16)_100%)] shadow-[inset_0_1px_0_rgb(255_255_255/0.68),inset_1px_0_0_rgb(255_255_255/0.16),inset_0_-18px_36px_rgb(170_198_216/0.08),inset_0_0_0_1px_rgb(255_255_255/0.1),0_1px_1px_rgb(255_255_255/0.45),0_24px_56px_-12px_rgb(24_42_66/0.14),0_4px_12px_rgb(24_42_66/0.05)] backdrop-blur-[12px] backdrop-saturate-[1.4] transition-[background,border-color,box-shadow] duration-300 before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgb(255_255_255/0.32)_0%,transparent_30%),linear-gradient(118deg,rgb(255_255_255/0.16)_0%,transparent_36%)] before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:bg-[url(data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27160%27%20height=%27160%27%3E%3Cfilter%20id=%27n%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%27.8%27%20numOctaves=%274%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url(%23n)%27/%3E%3C/svg%3E)] after:bg-size-[180px_180px] after:opacity-5 after:mix-blend-overlay after:content-[''] md:rounded-[32px] dark:border-white/14 dark:bg-[linear-gradient(165deg,rgb(255_255_255/0.13)_0%,rgb(255_255_255/0.035)_46%,rgb(255_255_255/0.07)_100%)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.22),inset_1px_0_0_rgb(255_255_255/0.08),inset_0_-22px_40px_rgb(0_0_0/0.28),inset_0_0_0_1px_rgb(255_255_255/0.05),0_1px_1px_rgb(255_255_255/0.08),0_28px_60px_-12px_rgb(0_0_0/0.48),0_4px_14px_rgb(0_0_0/0.22)] dark:before:bg-[linear-gradient(180deg,rgb(255_255_255/0.12)_0%,transparent_32%),linear-gradient(118deg,rgb(255_255_255/0.07)_0%,transparent_38%)] dark:after:opacity-[0.07] dark:after:mix-blend-soft-light";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const coverRef = useRef<HTMLImageElement>(null);
  const heroStackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const taglineSlotRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const occupyRef = useRef({ edge: 0 });
  const occupyTweenRef = useRef<gsap.core.Tween | null>(null);
  const introTlRef = useRef<gsap.core.Timeline | null>(null);

  const setSidebarEdge = (edge: number) => {
    mainRef.current?.style.setProperty("--sidebar-edge", `${edge}px`);
  };

  useGSAP(() => {
    const inset = getGlassInset();
    occupyRef.current.edge = inset;
    setSidebarEdge(inset);

    const brand = brandRef.current;
    const logo = logoRef.current;
    const title = titleRef.current;
    const cover = coverRef.current;
    const heroStack = heroStackRef.current;
    const stage = stageRef.current;
    const taglineSlot = taglineSlotRef.current;
    const tagline = taglineRef.current;
    if (!brand || !logo || !title || !cover || !heroStack || !stage || !taglineSlot || !tagline) {
      return () => {
        occupyTweenRef.current?.kill();
      };
    }

    const pinStackToTop = () => {
      const fromY = heroStack.offsetTop;
      gsap.set(stage, { justifyContent: "flex-start" });
      gsap.set(heroStack, { y: fromY, transformOrigin: "50% 0%" });
    };

    if (prefersReducedMotion()) {
      gsap.set(stage, { justifyContent: "flex-start" });
      gsap.set(heroStack, { scale: HERO_LIFT_SCALE, y: 0, transformOrigin: "50% 0%" });
      gsap.set(brand, { height: "auto", marginBottom: 12, overflow: "visible" });
      gsap.set(taglineSlot, { height: "auto", overflow: "visible" });
      gsap.set([logo, title, tagline], { autoAlpha: 1, scale: 1, x: 0, y: 0 });
      gsap.set(cover, { autoAlpha: 1, scale: 1, x: 0, y: 0 });
      return () => {
        occupyTweenRef.current?.kill();
      };
    }

    gsap.set(brand, { height: 0, marginBottom: 0, overflow: "hidden" });
    gsap.set(logo, { autoAlpha: 0, scale: 0.7, y: 20 });
    gsap.set(title, { autoAlpha: 0, x: -12 });
    gsap.set(cover, { autoAlpha: 0, scale: 0.72, y: 64 });
    gsap.set(heroStack, { scale: 1, y: 0, transformOrigin: "center center" });
    gsap.set(taglineSlot, { height: 0, overflow: "hidden" });
    gsap.set(tagline, { autoAlpha: 0, scale: 0.86, y: 16 });

    introTlRef.current = gsap.timeline({ defaults: { force3D: true } })
      .to(cover, {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        delay: 0.12,
        ease: "elastic.out(1, 0.68)",
      })
      .to(brand, {
        height: "auto",
        marginBottom: 12,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(brand, { overflow: "visible" });
        },
      }, "+=0.08")
      .to(logo, {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.85,
        ease: "elastic.out(1, 0.72)",
      }, "-=0.28")
      .to(title, {
        autoAlpha: 1,
        x: 0,
        duration: 0.38,
        ease: "power3.out",
      }, "-=0.58")
      .add(() => {
        pinStackToTop();
      })
      .to(heroStack, {
        scale: HERO_LIFT_SCALE,
        y: 0,
        duration: 0.7,
        ease: "power3.inOut",
      }, "+=0.1")
      .to(taglineSlot, {
        height: "auto",
        duration: 0.7,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(taglineSlot, { overflow: "visible" });
        },
      }, "<")
      .to(tagline, {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.7)",
      }, "-=0.22");

    return () => {
      introTlRef.current?.kill();
      occupyTweenRef.current?.kill();
    };
  }, { scope: mainRef });

  const handleOccupy = ({ occupiedRight, duration, delay = 0 }: SidebarOccupyChange) => {
    const edge = occupiedRight === 0 ? getGlassInset() : occupiedRight + HOME_GLASS_GAP;
    occupyTweenRef.current?.kill();

    if (duration === 0 && delay === 0) {
      occupyRef.current.edge = edge;
      setSidebarEdge(edge);
      return;
    }

    occupyTweenRef.current = gsap.to(occupyRef.current, {
      edge,
      delay,
      duration: duration === 0 ? 0 : Math.max(duration, 0.85),
      ease: duration === 0 ? "none" : "elastic.out(1, 0.68)",
      overwrite: true,
      onUpdate: () => {
        setSidebarEdge(occupyRef.current.edge);
      },
    });
  };

  return (
    <main
      className="relative isolate min-h-svh overflow-hidden bg-[linear-gradient(to_bottom,var(--home-bg-from),var(--home-bg-to))] transition-[background] duration-300"
      ref={mainRef}
    >
      <div aria-hidden="true" className={ambientClassName} />
      <div className={glassFrameClassName}>
        <div aria-hidden="true" className={glassClassName} />
        <div
          className="relative z-1 flex h-full flex-col items-center justify-center px-5 py-8 sm:px-10 sm:py-10 md:px-14 md:py-12"
          ref={stageRef}
        >
          <div
            className="flex origin-center flex-col items-center"
            ref={heroStackRef}
          >
            <div
              className="mb-0 flex h-0 shrink-0 items-center gap-[0.32em] overflow-hidden text-[clamp(1.65rem,3.5vw,2.35rem)]"
              ref={brandRef}
            >
              <img
                alt=""
                className="size-[0.78em] origin-center object-contain opacity-0"
                ref={logoRef}
                src={logoImage}
              />
              <h1
                className="origin-left text-[1em] leading-none font-semibold tracking-[-0.05em] text-[#17202b] whitespace-nowrap opacity-0 dark:text-white"
                ref={titleRef}
              >
                Class Widgets
              </h1>
            </div>
            <div
              className="flex h-0 items-center justify-center overflow-hidden"
              ref={taglineSlotRef}
            >
              <p
                className="origin-center py-3 text-center text-[clamp(2.55rem,6vw,4.15rem)] font-semibold tracking-[-0.06em] text-[#17202b] opacity-0 dark:text-white"
                ref={taglineRef}
              >
                课程表的终极形态
              </p>
            </div>
            <img
              alt="Class Widgets 2 组件预览"
              className="h-auto max-h-[min(56svh,620px)] w-full max-w-6xl origin-center object-contain opacity-0 drop-shadow-[0_28px_56px_rgb(24_42_66/0.22)] dark:drop-shadow-[0_32px_72px_rgb(0_0_0/0.55)]"
              ref={coverRef}
              src={coverImage}
            />
          </div>
        </div>
      </div>
      <FloatingSidebar onOccupy={handleOccupy} />
    </main>
  );
}
