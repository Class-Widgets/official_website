import { ArrowUpRight } from "lucide-react";
import { DocumentCards, documents } from "../components/document-cards";
import { FloatingSidebar } from "../components/floating-sidebar";

export default function Home() {
  return (
    <main className="landing-page">
      <div className="ambient-glow ambient-glow-one" />
      <div className="ambient-glow ambient-glow-two" />

      <section className="hero-copy">
        <p className="eyebrow"><span /> DOCUMENTATION · 2025</p>
        <h1>把复杂的事，<em>讲清楚。</em></h1>
        <p className="hero-description">
          一份清晰、易读的资料库，帮你从第一次了解，到真正开始使用。
        </p>
        <a className="hero-link" href="#documents">
          查看全部文档 <ArrowUpRight size={16} strokeWidth={1.8} />
        </a>
      </section>

      <DocumentCards />
      <FloatingSidebar documents={documents} />
    </main>
  );
}
