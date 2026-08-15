import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import coverImage from "../assets/home/cover.png";
import logoImage from "../assets/home/cw2_logo.png";
import { FloatingSidebar, type SidebarOccupyChange } from "../components/floating-sidebar";
import { HeroActions } from "../components/hero-actions";

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

const HERO_LIFT_SCALE = 0.84;
const BRAND_GAP = 12;
const TAGLINE_GAP = 10;

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
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
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
    const tagline = taglineRef.current;
    const actions = actionsRef.current;
    if (!brand || !logo || !title || !cover || !heroStack || !stage || !tagline || !actions) {
      return () => {
        occupyTweenRef.current?.kill();
      };
    }

    let cancelled = false;

    gsap.set([logo, title, cover, tagline], { autoAlpha: 0, force3D: true });
    gsap.set(actions, { autoAlpha: 0, y: 16, force3D: true });

    const playIntro = () => {
      if (cancelled) return;

      const brandH = brand.offsetHeight;
      const taglineH = tagline.offsetHeight;
      const coverShift = taglineH + TAGLINE_GAP;
      const startY = -(brandH + BRAND_GAP) / 2;
      const taglineTop = brandH + BRAND_GAP;
      const liftY = () => {
        const pad = Number.parseFloat(getComputedStyle(stage).paddingTop) || 32;
        return pad - heroStack.offsetTop;
      };

      gsap.set(heroStack, { y: startY, scale: 1, transformOrigin: "50% 0%", force3D: true });
      gsap.set(tagline, { left: "50%", xPercent: -50, top: 0, y: taglineTop, scale: 0.96, force3D: true });
      gsap.set(cover, { y: 0, scale: 0.94, force3D: true });
      gsap.set(logo, { scale: 0.92 });

      if (prefersReducedMotion()) {
        gsap.set(heroStack, { y: liftY(), scale: HERO_LIFT_SCALE });
        gsap.set(cover, { y: coverShift, autoAlpha: 1, scale: 1 });
        gsap.set([logo, title, tagline], { autoAlpha: 1, scale: 1 });
        gsap.set(actions, { autoAlpha: 1, y: coverShift });
        return;
      }

      introTlRef.current = gsap.timeline({ defaults: { force3D: true, ease: "power3.out" } })
        .to(cover, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.5,
        })
        .to(heroStack, {
          y: 0,
          duration: 0.38,
          ease: "power3.inOut",
        }, "-=0.18")
        .to(logo, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.36,
        }, "<")
        .to(title, {
          autoAlpha: 1,
          duration: 0.24,
          ease: "power2.out",
        }, "<0.08")
        .to(heroStack, {
          scale: HERO_LIFT_SCALE,
          y: liftY(),
          duration: 0.42,
          ease: "power3.inOut",
        }, "+=0.04")
        .to(cover, {
          y: coverShift,
          duration: 0.34,
          ease: "power3.inOut",
        }, "-=0.08")
        .to(actions, {
          y: coverShift,
          duration: 0.34,
          ease: "power3.inOut",
        }, "<")
        .to(tagline, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.36,
        }, "-=0.22")
        .to(actions, {
          autoAlpha: 1,
          duration: 0.36,
        }, "-=0.22");
    };

    const startIntro = async () => {
      try {
        await cover.decode();
      } catch {
        // Keep going with current image metrics.
      }
      await document.fonts.ready;
      playIntro();
    };

    void startIntro();

    return () => {
      cancelled = true;
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
            className="relative flex w-full origin-top flex-col items-center will-change-transform"
            ref={heroStackRef}
          >
            <div
              className="mb-3 grid w-full grid-cols-[1fr_auto_1fr] items-center text-[clamp(1.65rem,3.5vw,2.35rem)]"
              ref={brandRef}
            >
              <div className="flex items-center justify-end pr-[0.32em]">
                <img
                  alt=""
                  className="size-[1.5em] origin-center object-contain opacity-0"
                  ref={logoRef}
                  src={logoImage}
                />
              </div>
              <h1
                className="origin-left text-[1em] leading-none font-semibold tracking-[-0.05em] text-[#17202b] whitespace-nowrap opacity-0 dark:text-white"
                ref={titleRef}
              >
                Class Widgets
              </h1>
              <div />
            </div>
            <p
              className="absolute top-0 left-1/2 py-3 text-center text-[clamp(2.55rem,6vw,4.15rem)] font-semibold tracking-[-0.06em] whitespace-nowrap text-[#17202b] opacity-0 will-change-transform dark:text-white"
              ref={taglineRef}
            >
              课程表的终极形态
            </p>
            <img
              alt="Class Widgets 2 组件预览"
              className="h-auto max-h-[min(56svh,620px)] w-full max-w-6xl origin-center object-contain opacity-0 will-change-transform drop-shadow-[0_28px_56px_rgb(24_42_66/0.22)] dark:drop-shadow-[0_32px_72px_rgb(0_0_0/0.55)]"
              ref={coverRef}
              src={coverImage}
            />
            <HeroActions
              className="z-2 mt-3 flex items-center justify-center gap-3 opacity-0"
              ref={actionsRef}
            />
          </div>
        </div>
      </div>
      <FloatingSidebar onOccupy={handleOccupy} />
    </main>
  );
}
