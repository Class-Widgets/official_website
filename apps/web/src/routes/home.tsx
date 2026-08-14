import { ArrowUpRight } from "lucide-react";
import { DocumentCards } from "../components/document-cards";
import { FloatingSidebar } from "../components/floating-sidebar";

export default function Home() {
  return (
    <main className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden bg-[#f4f6f8] px-6 py-24 text-[#17202b] transition-colors duration-300 dark:bg-[#101318] dark:text-[#f1f5fa] sm:px-8 lg:px-[9vw]">
      <div className="pointer-events-none absolute -right-40 -top-96 -z-10 size-160 rounded-full bg-[rgb(116_177_255/0.2)] dark:bg-[rgb(47_91_151/0.18)]" />
      <div className="pointer-events-none absolute -bottom-96 left-[13%] -z-10 size-160 rounded-full bg-[rgb(183_222_255/0.16)] dark:bg-[rgb(47_83_122/0.14)]" />

      <section className="max-w-170">
        <p className="mb-8 flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.18em] text-[#1e6eff]">
          <span className="h-px w-6 bg-current" /> DOCUMENTATION · 2025
        </p>
        <h1 className="max-w-162.5 text-[clamp(3.4rem,7vw,7.2rem)] font-medium leading-[0.99] tracking-[-0.075em]">
          把复杂的事，<em className="text-[#1e6eff] not-italic">讲清楚。</em>
        </h1>
        <p className="my-8 max-w-85 text-[15px] leading-[1.8] text-[#77808c] dark:text-[#929aa6]">
          一份清晰、易读的资料库，帮你从第一次了解，到真正开始使用。
        </p>
        <a className="inline-flex items-center gap-2 border-b border-[#17202b] pb-1.5 text-[13px] transition-[gap,color] duration-300 hover:gap-3.5 hover:text-[#1e6eff] dark:border-[#f1f5fa]" href="#documents">
          查看全部文档 <ArrowUpRight size={16} strokeWidth={1.8} />
        </a>
      </section>

      <DocumentCards />
      <FloatingSidebar />
    </main>
  );
}
