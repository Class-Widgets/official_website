import logoImage from "@/assets/images/icons/favicon.svg";
import type { Translations } from "@gudupao/astro-i18n";
import { createClientTranslator } from "@gudupao/astro-i18n/client";

interface VersionProps {
  latestVer: string | null;
  publishedDate: string | null;
  loading: boolean;
  size?: "auto"; // 新增 size 属性
  translations: Translations;
  isStable?: boolean;
}

const Version = ({ latestVer, publishedDate, loading, size, translations, isStable = true }: VersionProps) => {
  const t = createClientTranslator(translations);
  const containerClasses = size === "auto"
    ? "w-full h-full flex flex-col items-center justify-center p-4 bg-white/5 rounded-lg shadow-md border border-white/10"
    : "p-4 bg-white/5 rounded-lg shadow-md inline-flex items-center gap-4 border border-white/10";

  return (
    <a href="https://classwidgets.rinlit.cn/download/" target="_blank" rel="noopener noreferrer" className={containerClasses}>
      {loading ? (
        <span className="text-sm text-gray-400">{t("version.loading")}</span>
      ) : (
        <>
          <img
            src={logoImage.src}
            alt="Class Widgets Logo"
            className="size-12"
          />
          <div className={size === "auto" ? "text-center" : ""}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-semibold text-white">{t("version.latest")}: {latestVer}</span>
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                isStable
                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                  : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
              }`}>
                {isStable ? t("version.latest") : t("version.pre_release")}
              </span>
            </div>
            {publishedDate && <span className="text-sm text-gray-400 block">{t("version.published")}: {publishedDate}</span>}
          </div>
        </>
      )}
    </a>
  );
};

export default Version;