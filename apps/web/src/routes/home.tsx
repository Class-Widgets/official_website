import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FloatingSidebar, type SidebarOccupyChange } from "../components/floating-sidebar";

gsap.registerPlugin(useGSAP);

const HOME_GLASS_GAP = 16;

function getGlassInset() {
  if (window.matchMedia("(min-width: 768px)").matches) return 20;
  if (window.matchMedia("(min-width: 640px)").matches) return 16;
  return 12;
}

const ambientClassName =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_58%_44%_at_14%_6%,rgb(142_196_224/0.58),transparent_58%),radial-gradient(ellipse_46%_40%_at_88%_94%,rgb(168_210_230/0.46),transparent_62%),radial-gradient(ellipse_30%_26%_at_74%_14%,rgb(255_255_255/0.62),transparent_68%)] transition-[background] duration-300 dark:bg-[radial-gradient(ellipse_58%_44%_at_14%_6%,rgb(62_118_158/0.38),transparent_58%),radial-gradient(ellipse_46%_40%_at_88%_94%,rgb(28_56_82/0.55),transparent_62%),radial-gradient(ellipse_30%_26%_at_74%_14%,rgb(255_255_255/0.07),transparent_68%)]";

const glassClassName =
  "pointer-events-none absolute top-3 right-3 bottom-3 left-[var(--sidebar-edge,0.75rem)] isolate overflow-hidden rounded-[28px] border border-white/44 bg-[linear-gradient(165deg,rgb(255_255_255/0.3)_0%,rgb(255_255_255/0.08)_44%,rgb(255_255_255/0.16)_100%)] shadow-[inset_0_1px_0_rgb(255_255_255/0.68),inset_1px_0_0_rgb(255_255_255/0.16),inset_0_-18px_36px_rgb(170_198_216/0.08),inset_0_0_0_1px_rgb(255_255_255/0.1),0_1px_1px_rgb(255_255_255/0.45),0_24px_56px_-12px_rgb(24_42_66/0.14),0_4px_12px_rgb(24_42_66/0.05)] backdrop-blur-[12px] backdrop-saturate-[1.4] transition-[background,border-color,box-shadow] duration-300 before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgb(255_255_255/0.32)_0%,transparent_30%),linear-gradient(118deg,rgb(255_255_255/0.16)_0%,transparent_36%)] before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:bg-[url(data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27160%27%20height=%27160%27%3E%3Cfilter%20id=%27n%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%27.8%27%20numOctaves=%274%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url(%23n)%27/%3E%3C/svg%3E)] after:bg-size-[180px_180px] after:opacity-5 after:mix-blend-overlay after:content-[''] sm:top-4 sm:right-4 sm:bottom-4 sm:left-[var(--sidebar-edge,1rem)] md:top-5 md:right-5 md:bottom-5 md:left-[var(--sidebar-edge,1.25rem)] md:rounded-[32px] dark:border-white/14 dark:bg-[linear-gradient(165deg,rgb(255_255_255/0.13)_0%,rgb(255_255_255/0.035)_46%,rgb(255_255_255/0.07)_100%)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.22),inset_1px_0_0_rgb(255_255_255/0.08),inset_0_-22px_40px_rgb(0_0_0/0.28),inset_0_0_0_1px_rgb(255_255_255/0.05),0_1px_1px_rgb(255_255_255/0.08),0_28px_60px_-12px_rgb(0_0_0/0.48),0_4px_14px_rgb(0_0_0/0.22)] dark:before:bg-[linear-gradient(180deg,rgb(255_255_255/0.12)_0%,transparent_32%),linear-gradient(118deg,rgb(255_255_255/0.07)_0%,transparent_38%)] dark:after:opacity-[0.07] dark:after:mix-blend-soft-light";

export default function Home() {
  const panelRef = useRef<HTMLDivElement>(null);
  const occupyRef = useRef({ edge: 0 });
  const occupyTweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    const inset = getGlassInset();
    occupyRef.current.edge = inset;
    panelRef.current?.style.setProperty("--sidebar-edge", `${inset}px`);

    return () => {
      occupyTweenRef.current?.kill();
    };
  }, { scope: panelRef });

  const handleOccupy = ({ occupiedRight, duration, delay = 0 }: SidebarOccupyChange) => {
    const edge = occupiedRight === 0 ? getGlassInset() : occupiedRight + HOME_GLASS_GAP;
    occupyTweenRef.current?.kill();

    if (duration === 0 && delay === 0) {
      occupyRef.current.edge = edge;
      panelRef.current?.style.setProperty("--sidebar-edge", `${edge}px`);
      return;
    }

    occupyTweenRef.current = gsap.to(occupyRef.current, {
      edge,
      delay,
      duration: duration === 0 ? 0 : Math.max(duration, 0.85),
      ease: duration === 0 ? "none" : "elastic.out(1, 0.68)",
      overwrite: true,
      onUpdate: () => {
        panelRef.current?.style.setProperty("--sidebar-edge", `${occupyRef.current.edge}px`);
      },
    });
  };

  return (
    <main className="relative isolate min-h-svh overflow-hidden bg-[linear-gradient(to_bottom,var(--home-bg-from),var(--home-bg-to))] transition-[background] duration-300">
      <div aria-hidden="true" className={ambientClassName} />
      <div aria-hidden="true" className={glassClassName} ref={panelRef} />
      <FloatingSidebar onOccupy={handleOccupy} />
    </main>
  );
}
