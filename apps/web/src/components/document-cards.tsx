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
    <section id="documents" className="document-grid" aria-label="文档下载">
      {documents.map((document) => (
        <a className="document-card" href={document.href} download key={document.title}>
          <div className="document-card-icon">
            <FileText size={21} strokeWidth={1.6} />
          </div>
          <div className="document-card-content">
            <div className="document-card-heading">
              <h2>{document.title}</h2>
              <ArrowUpRight size={17} strokeWidth={1.7} />
            </div>
            <p>{document.description}</p>
            <span>{document.meta}</span>
          </div>
        </a>
      ))}
    </section>
  );
}
