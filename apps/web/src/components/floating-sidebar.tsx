import { useEffect, useRef, useState } from "react";
import { Download, Moon, Sun } from "lucide-react";
import gsap from "gsap";
import type { DocumentLink } from "./document-cards";

type FloatingSidebarProps = {
  documents: DocumentLink[];
};

export function FloatingSidebar({ documents }: FloatingSidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", isDark);
  }, [isDark]);

  const animateSidebar = (expanded: boolean) => {
    if (!sidebarRef.current) return;

    if (!contentRef.current) return;

    gsap.killTweensOf([sidebarRef.current, contentRef.current]);
    const timeline = gsap.timeline({ defaults: { overwrite: true } });

    if (expanded) {
      timeline
        .to(sidebarRef.current, {
          x: 0,
          duration: 0.58,
          ease: "expo.out",
        })
        .to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        }, "-=0.24");
    } else {
      timeline
        .to(contentRef.current, {
          opacity: 0,
          y: 8,
          duration: 0.16,
          ease: "power2.in",
        })
        .to(sidebarRef.current, {
          x: -280,
          duration: 0.52,
          ease: "expo.inOut",
        }, "-=0.02");
    }
  };

  return (
    <>
      <div
        className="sidebar-trigger"
        onMouseEnter={() => animateSidebar(true)}
        aria-hidden="true"
      />
      <aside
        className="floating-sidebar"
        ref={sidebarRef}
        onMouseEnter={() => animateSidebar(true)}
        onMouseLeave={() => animateSidebar(false)}
        aria-label="快捷操作"
      >
        <div className="sidebar-surface">
          <div className="sidebar-content" ref={contentRef}>
            <div className="sidebar-brand">cw<span>·</span></div>
            <div className="sidebar-rule" />
            <nav className="sidebar-nav">
              {documents.map((document) => (
                <a href={document.href} download key={document.title}>
                  <Download size={18} strokeWidth={1.7} />
                  <span>下载{document.title}</span>
                </a>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <span>主题</span>
              <button
                aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
                className="theme-toggle"
                onClick={() => setIsDark((current) => !current)}
                type="button"
              >
                {isDark ? <Moon size={15} /> : <Sun size={15} />}
              </button>
            </div>
          </div>
        </div>
        <div className="sidebar-handle" />
      </aside>
    </>
  );
}
