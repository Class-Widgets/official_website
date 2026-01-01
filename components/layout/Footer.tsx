import Apple from "../icon/Apple";
import Linux from "../icon/Linux";
import Windows from "../icon/Windows";
import { Button, TransparentButton } from "@/components/ui/Button";
import type { Translations } from "@gudupao/astro-i18n";
import logoImage from "@/assets/images/icons/favicon.svg";
import { createClientTranslator } from "@gudupao/astro-i18n/client";

const Footer = ({ translations }: { translations: Translations }) => {
  const t = createClientTranslator(translations);
  const getLocalizedPath = (path: string) => {
    if (translations && translations.lang) {
      return `/${translations.lang}${path}`;
    }
    return path;
  };
  const navItems = [
    { href: getLocalizedPath("/"), label: t("navs.home") },
    { href: getLocalizedPath("/download"), label: t("navs.download") },
    { href: "https://cwdocs.rinlit.cn/about/", label: t("navs.user_docs") },
    { href: "https://cwdocs.rinlit.cn/dev/", label: t("navs.dev_docs") },
  ];

  return (
    <footer className="bg-[#0A0B15] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Logo and description */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img
                src={logoImage.src}
                alt="Class Widgets Logo"
                className="h-10 w-10"
              />
              <span className="text-xl font-bold">Class Widgets</span>
            </div>
            <p className="text-[#87878A]">
              {t("footer.desc")}
            </p>
            <div className="flex gap-4">
              <a href="https://www.bilibili.com/video/BV1xwW9eyEGu/" className="text-[#87878A] hover:text-white transition-colors">
                {/* Bilibili */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1129 1024" version="1.1" fill="currentColor">
                  <path d="M234.909 9.656a80.468 80.468 0 0 1 68.398 0 167.374 167.374 0 0 1 41.843 30.578l160.937 140.82h115.07l160.936-140.82a168.983 168.983 0 0 1 41.843-30.578A80.468 80.468 0 0 1 930.96 76.445a80.468 80.468 0 0 1-17.703 53.914 449.818 449.818 0 0 1-35.406 32.187 232.553 232.553 0 0 1-22.531 18.508h100.585a170.593 170.593 0 0 1 118.289 53.109 171.397 171.397 0 0 1 53.914 118.288v462.693a325.897 325.897 0 0 1-4.024 70.007 178.64 178.64 0 0 1-80.468 112.656 173.007 173.007 0 0 1-92.539 25.75h-738.7a341.186 341.186 0 0 1-72.421-4.024A177.835 177.835 0 0 1 28.91 939.065a172.202 172.202 0 0 1-27.36-92.539V388.662a360.498 360.498 0 0 1 0-66.789A177.03 177.03 0 0 1 162.487 178.64h105.414c-16.899-12.07-31.383-26.555-46.672-39.43a80.468 80.468 0 0 1-25.75-65.984 80.468 80.468 0 0 1 39.43-63.57M216.4 321.873a80.468 80.468 0 0 0-63.57 57.937 108.632 108.632 0 0 0 0 30.578v380.615a80.468 80.468 0 0 0 55.523 80.469 106.218 106.218 0 0 0 34.601 5.632h654.208a80.468 80.468 0 0 0 76.444-47.476 112.656 112.656 0 0 0 8.047-53.109v-354.06a135.187 135.187 0 0 0 0-38.625 80.468 80.468 0 0 0-52.304-54.719 129.554 129.554 0 0 0-49.89-7.242H254.22a268.764 268.764 0 0 0-37.82 0z m0 0" fill="#20B0E3" p-id="1491"></path><path d="M348.369 447.404a80.468 80.468 0 0 1 55.523 18.507 80.468 80.468 0 0 1 28.164 59.547v80.468a80.468 80.468 0 0 1-16.094 51.5 80.468 80.468 0 0 1-131.968-9.656 104.609 104.609 0 0 1-10.46-54.719v-80.468a80.468 80.468 0 0 1 70.007-67.593z m416.02 0a80.468 80.468 0 0 1 86.102 75.64v80.468a94.148 94.148 0 0 1-12.07 53.11 80.468 80.468 0 0 1-132.773 0 95.757 95.757 0 0 1-12.875-57.133V519.02a80.468 80.468 0 0 1 70.007-70.812z m0 0" fill="#20B0E3" p-id="1492"></path>
                </svg>
              </a>
              <a href="https://qm.qq.com/q/LrSAgiQvu" className="text-[#87878A] hover:text-white transition-colors">
                {/* QQ */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024" version="1.1" fill="currentColor">
                  <path d="M512 0C229.224296 0 0 229.224296 0 512s229.224296 512 512 512 512-229.224296 512-512S794.775704 0 512 0zM801.261037 668.86163c-21.731556 18.640593-49.948444-61.345185-54.006519-49.038222-9.879704 29.923556-14.506667 49.929481-43.633778 82.507852-1.554963 1.744593 33.659259 14.468741 43.633778 41.642667 9.557333 26.017185 28.141037 67.26163-93.487407 80.213333-71.35763 7.585185-122.936889-38.020741-128.075852-37.584593-9.53837 0.83437-5.290667 0-15.530667 0-8.38163 0-8.931556 0.606815-16.820148 0-2.161778-0.170667-25.884444 37.584593-131.963259 37.584593-82.223407 0-103.518815-51.749926-86.983111-80.213333 16.535704-28.463407 44.126815-36.750222 40.239407-41.263407-19.152593-22.186667-32.350815-45.909333-40.239407-67.356444-1.953185-5.347556-3.584-10.543407-4.873481-15.530667-2.996148-11.45363-25.884444 67.204741-50.460444 49.038222-24.576-18.166519-22.376296-64.417185-6.46637-108.676741 16.042667-44.619852 56.471704-87.589926 56.926815-97.071407 1.611852-35.290074-3.489185-41.14963 0-50.422519 7.755852-20.764444 17.199407-12.8 17.199407-23.570963 0-135.736889 100.864-245.76 225.28-245.76s225.28 110.042074 225.28 245.76c0 5.195852 13.520593 0 19.986963 23.570963 1.327407 4.873481 2.23763 23.665778 0.663704 50.422519-0.739556 12.856889 34.266074 28.501333 52.375704 97.071407C828.434963 628.754963 810.30637 661.105778 801.261037 668.86163z" fill="#68A5E1" p-id="4481"></path>
                </svg>
              </a>
              <a href="https://discord.gg/xhZqhGuBxu" className="text-[#87878A] hover:text-white transition-colors">
                {/* Discord */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024" version="1.1" fill="currentColor">
                  <path d="M0 512a512 512 0 1 0 1024 0A512 512 0 1 0 0 512z" fill="#738BD8" p-id="5476"></path><path d="M190.915 234.305h642.169v477.288H190.915z" fill="#FFFFFF" p-id="5477"></path><path d="M698.157 932.274L157.288 862.85c-58.43-7.5-55.4-191.167-50.26-249.853l26.034-297.22c5.14-58.686 74.356-120.22 132.7-128.362l466.441-65.085c58.346-8.14 177.24 212.65 176.09 271.548l-8.677 445.108M512 300.373c-114.347 0-194.56 49.067-194.56 49.067 43.947-39.253 120.747-61.867 120.747-61.867l-7.254-7.253c-72.106 1.28-137.386 51.2-137.386 51.2-73.387 153.173-68.694 285.44-68.694 285.44 59.734 77.227 148.48 71.68 148.48 71.68l30.294-38.4c-53.334-11.52-87.04-58.88-87.04-58.88S396.8 645.973 512 645.973c115.2 0 195.413-54.613 195.413-54.613s-33.706 47.36-87.04 58.88l30.294 38.4s88.746 5.547 148.48-71.68c0 0 4.693-132.267-68.694-285.44 0 0-65.28-49.92-137.386-51.2l-7.254 7.253s76.8 22.614 120.747 61.867c0 0-80.213-49.067-194.56-49.067M423.68 462.08c27.733 0 50.347 24.32 49.92 54.187 0 29.44-22.187 54.186-49.92 54.186-27.307 0-49.493-24.746-49.493-54.186 0-29.867 21.76-54.187 49.493-54.187m177.92 0c27.733 0 49.92 24.32 49.92 54.187 0 29.44-22.187 54.186-49.92 54.186-27.307 0-49.493-24.746-49.493-54.186 0-29.867 21.76-54.187 49.493-54.187z" fill="#738BD8" p-id="5478"></path>
                </svg>
              </a>
              <a href="https://github.com/Class-Widgets" className="text-[#87878A] hover:text-white transition-colors">
                {/* GitHub */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">{t("footer.quick_links")}</h3>
            <ul className="space-y-4">
              {navItems.map((item) => (
            <li><a
              key={item.href}
              href={item.href}
              className="text-[#87878A] hover:text-white transition-colors"
            >
              {item.label}
            </a></li>
          ))}
            </ul>
          </div>

          {/* Platform Support */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">{t("footer.systems")}</h3>
            <div className="flex flex-wrap gap-4">
              <TransparentButton href="/download/#win" className="flex">
                <Windows className="h-6 w-6" />
                <span>Windows</span>
              </TransparentButton>
              <TransparentButton href="/download/#macos" className="flex">
                <Apple className="h-6 w-6" />
                <span>macOS</span>
              </TransparentButton>
              <TransparentButton href="/download/#linux" className="flex">
                <Linux className="h-6 w-6" />
                <span>Linux</span>
              </TransparentButton>
            </div>
          </div>

        </div>

        <div className="mt-16 border-t border-[#1A1B26] pt-8 text-center text-[#87878A]">
          <p>© {new Date().getFullYear()} Class Widgets. {t("footer.cr")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
