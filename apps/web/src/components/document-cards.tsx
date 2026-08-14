import { ArrowUpRight, FileText } from "lucide-react";

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

export function DocumentCards() {
  return (
    <section
      id="documents"
      className="mt-16 grid max-w-200 grid-cols-1 gap-4 sm:mt-28 sm:grid-cols-2"
      aria-label="文档下载"
    >
      {documents.map((document) => (
        <a
          className="group flex min-h-42.5 gap-4.5 rounded-3xl border border-white/90 bg-white/65 p-6 shadow-[0_20px_60px_rgb(23_47_75/0.05)] backdrop-blur-3xl transition duration-300 hover:-translate-y-1.5 hover:border-[rgb(30_110_255/0.35)] hover:shadow-[0_24px_64px_rgb(23_47_75/0.12)] dark:border-white/10 dark:bg-[#232a35]/60"
          href={document.href}
          download
          key={document.title}
        >
          <div className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-[rgb(30_110_255/0.1)] text-[#1e6eff]">
            <FileText size={21} strokeWidth={1.6} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <h2 className="mt-px text-base font-medium tracking-[-0.02em]">{document.title}</h2>
              <ArrowUpRight
                className="text-[#77808c] transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#1e6eff] dark:text-[#929aa6]"
                size={17}
                strokeWidth={1.7}
              />
            </div>
            <p className="my-3.5 mb-7 text-xs leading-[1.6] text-[#77808c] dark:text-[#929aa6]">{document.description}</p>
            <span className="text-[10px] tracking-[0.08em] text-[#77808c] dark:text-[#929aa6]">{document.meta}</span>
          </div>
        </a>
      ))}
    </section>
  );
}
