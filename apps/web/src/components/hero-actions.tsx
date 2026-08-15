import type { Ref } from "react";
import { BookOpen } from "lucide-react";
import { detectPlatform, DOCS_URL, getDownloadHref, PLATFORM_LABEL } from "../lib/platform";
import { OsLogo } from "./os-logo";

const actionBaseClassName =
  "pointer-events-auto inline-flex h-12 items-center gap-2.5 rounded-full px-5 text-[15px] font-medium tracking-[-0.02em] transition-[background,color,box-shadow,transform] duration-300";

const downloadClassName =
  `${actionBaseClassName} border border-white/50 bg-linear-to-b from-white/70 to-[#dceef5]/50 text-[#17202b] shadow-[inset_0_1px_0_rgb(255_255_255/0.75),0_8px_20px_rgb(90_148_180/0.12)] backdrop-blur-md backdrop-saturate-[1.35] hover:-translate-y-0.5 hover:text-[#3a8fb8] dark:border-white/14 dark:from-white/16 dark:to-[#151d26]/60 dark:text-white dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_8px_20px_rgb(0_0_0/0.24)] dark:hover:text-white`;

const docsClassName =
  `${actionBaseClassName} border border-white/40 bg-white/18 text-[#2a3a48] shadow-[inset_0_1px_0_rgb(255_255_255/0.45)] backdrop-blur-md hover:-translate-y-0.5 hover:bg-white/28 hover:text-[#17202b] dark:border-white/12 dark:bg-white/6 dark:text-white/78 dark:hover:bg-white/10 dark:hover:text-white`;

export function HeroActions({
  className,
  ref,
}: {
  className?: string;
  ref?: Ref<HTMLDivElement>;
}) {
  const platform = detectPlatform();
  const platformLabel = PLATFORM_LABEL[platform];

  return (
    <div className={className} ref={ref}>
      <a
        aria-label={`下载 ${platformLabel} 版`}
        className={downloadClassName}
        href={getDownloadHref(platform)}
      >
        <OsLogo platform={platform} />
        下载
      </a>
      <a
        aria-label="查看文档"
        className={docsClassName}
        href={DOCS_URL}
        rel="noreferrer"
        target="_blank"
      >
        <BookOpen size={18} strokeWidth={1.7} />
        查看文档
      </a>
    </div>
  );
}
