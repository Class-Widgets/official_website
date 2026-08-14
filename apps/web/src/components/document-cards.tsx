import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, FileText } from "lucide-react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export type DocumentLink = {
  title: string;
  description: string;
  meta: string;
  href: string;
};

export const documents: DocumentLink[] = [
  {
    title: "产品手册",
    description: "快速了解产品能力与使用方式",
    meta: "PDF · 2.4 MB",
    href: "/docs/product-guide.pdf",
  },
  {
    title: "开发者文档",
    description: "接口、组件与集成指南",
    meta: "PDF · 4.8 MB",
    href: "/docs/developer-guide.pdf",
  },
];

function DocumentCard({ document, index }: { document: DocumentLink; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  useGSAP((_, contextSafeFn) => {
    const card = cardRef.current;
    if (!card || !contextSafeFn) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(card, { autoAlpha: 1, y: 0 });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(card, {
        y: 28,
        autoAlpha: 0,
        duration: 0.72,
        delay: 0.08 + index * 0.1,
        ease: "power3.out",
      });

      const onEnter = contextSafeFn(() => {
        gsap.to(card, { y: -8, duration: 0.48, ease: "power3.out", overwrite: "auto" });
        if (iconRef.current) {
          gsap.to(iconRef.current, { scale: 1.08, duration: 0.42, ease: "power3.out", overwrite: "auto" });
        }
        if (arrowRef.current) {
          gsap.to(arrowRef.current, { x: 3, y: -3, duration: 0.38, ease: "power3.out", overwrite: "auto" });
        }
      });

      const onLeave = contextSafeFn(() => {
        gsap.to(card, { y: 0, duration: 0.42, ease: "power3.out", overwrite: "auto" });
        if (iconRef.current) {
          gsap.to(iconRef.current, { scale: 1, duration: 0.36, ease: "power2.out", overwrite: "auto" });
        }
        if (arrowRef.current) {
          gsap.to(arrowRef.current, { x: 0, y: 0, duration: 0.36, ease: "power2.out", overwrite: "auto" });
        }
      });

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      card.addEventListener("focus", onEnter);
      card.addEventListener("blur", onLeave);

      return () => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
        card.removeEventListener("focus", onEnter);
        card.removeEventListener("blur", onLeave);
      };
    });

    return () => mm.revert();
  }, { scope: cardRef, dependencies: [index] });

  return (
    <a
      className="doc-card group flex min-h-42.5 gap-4.5 rounded-3xl p-6"
      href={document.href}
      download
      ref={cardRef}
    >
      <div
        className="doc-card-icon grid size-10 shrink-0 place-items-center rounded-[13px] text-[#1e6eff]"
        ref={iconRef}
      >
        <FileText size={21} strokeWidth={1.6} />
      </div>
      <div className="relative z-10 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h2 className="mt-px text-base font-medium tracking-[-0.02em]">{document.title}</h2>
          <ArrowUpRight
            className="text-[#77808c] transition-colors duration-300 group-hover:text-[#1e6eff] dark:text-[#929aa6]"
            size={17}
            strokeWidth={1.7}
            ref={arrowRef}
          />
        </div>
        <p className="my-3.5 mb-7 text-xs leading-[1.6] text-[#77808c] dark:text-[#929aa6]">{document.description}</p>
        <span className="text-[10px] tracking-[0.08em] text-[#77808c] dark:text-[#929aa6]">{document.meta}</span>
      </div>
    </a>
  );
}

export function DocumentCards() {
  return (
    <section
      id="documents"
      className="mt-16 grid max-w-200 grid-cols-1 gap-4 sm:mt-28 sm:grid-cols-2"
      aria-label="文档下载"
    >
      {documents.map((document, index) => (
        <DocumentCard document={document} index={index} key={document.title} />
      ))}
    </section>
  );
}
