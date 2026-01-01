import { useState, useEffect, useRef } from "react";
import Apple from "@/components/icon/Apple";
import Linux from "@/components/icon/Linux";
import Windows from "@/components/icon/Windows";
import logoImage from "@/assets/images/icons/favicon.svg";
import Switch from "@/components/ui/Switch";
import Version from "@/components/ui/Version";
import {detectPlatformFromUserAgent} from "plat.ts";
import type { Translations } from "@gudupao/astro-i18n";
import { createClientTranslator } from "@gudupao/astro-i18n/client";

interface ReleaseVersion {
  tag_name: string;
  published_at: string;
  prerelease: boolean;
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
}

const Download = ({ translations }: { translations: Translations }) => {
  const t = createClientTranslator(translations);
  const [activeTab, setActiveTab] = useState("windows");
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState({
    width: 0,
    left: 0,
    top: 0,
    height: 0
  });
  const tabsRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [useProxy, setUseProxy] = useState(true);
  const [latestVer, setLatestVer] = useState<string | null>(null);
  const [publishedDate, setPublishedDate] = useState<string | null>(null);
  const [prereleaseVer, setPrereleaseVer] = useState<string | null>(null);
  const [prereleaseDate, setPrereleaseDate] = useState<string | null>(null);
  const [prereleaseAssets, setPrereleaseAssets] = useState<Array<{name: string, browser_download_url: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<'stable' | 'prerelease'>('stable'); // 版本切换状态

  // 添加哈希值到平台ID的映射
  const hashToPlatform: Record<string, string> = {
    '#win': 'windows',
    '#macos': 'macos',
    '#linux': 'linux'
  };

  // 更新滑块位置
  const updateSliderPosition = (platformId: string) => {
    if (!tabsRef.current) return;
    
    const activeButton = tabsRef.current.querySelector(`button[data-platform="${platformId}"]`);
    if (!activeButton) return;
    
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = activeButton as HTMLButtonElement;
    setSliderPosition({
      left: offsetLeft,
      top: offsetTop,
      width: offsetWidth,
      height: offsetHeight
    });
  };

  // 监听URL哈希变化
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const platformId = hashToPlatform[hash];
      if (platformId) {
        setActiveTab(platformId);
      } else {
        // 没有URL标签时根据navigator.platform检测系统类型
        const detectedPlatform = detectPlatformFromUserAgent();
        setActiveTab(detectedPlatform);
      }
    };

    // 初始加载时检查哈希
    handleHashChange();

    // 添加哈希变化监听
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    setLoaded(true); // 组件挂载后触发动画
  }, []);

  // 初始化滑块位置
  useEffect(() => {
    updateSliderPosition(activeTab);
    const handleResize = () => updateSliderPosition(activeTab);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  // 获取release版本号
  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await fetch('https://ghfile.geekertao.top/https://api.github.com/repos/Class-Widgets/Class-Widgets/releases');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const releases: ReleaseVersion[] = await response.json();
        const latestStable = releases.find(release => !release.prerelease);
        if (latestStable) {
          setLatestVer(latestStable.tag_name);
          const date = new Date(latestStable.published_at);
          setPublishedDate(date.toLocaleDateString('zh-CN'));
        }
        const latestPrerelease = releases.find(release => release.prerelease);
        if (latestPrerelease && latestStable) {
          // 只有预发布版本比正式版本新时才显示
          const stableDate = new Date(latestStable.published_at);
          const prereleaseDate = new Date(latestPrerelease.published_at);
          if (prereleaseDate > stableDate) {
            setPrereleaseVer(latestPrerelease.tag_name);
            setPrereleaseDate(prereleaseDate.toLocaleDateString('zh-CN'));
            setPrereleaseAssets(latestPrerelease.assets);
          }
        }

      } catch (error) {
        console.error("获取releases失败:", error);
        // 失败时使用默认版本号和空日期
        setLatestVer('v1.2.0.1');
        setPublishedDate(null);
        setPrereleaseVer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);
  const parseAssetName = (assetName: string, platform: string, arch: string) => {
    // 匹配格式：ClassWidgets-{Platform}-{Arch}_{BuildNumber}.zip
    const pattern = new RegExp(`ClassWidgets-${platform}-${arch}(?:_\\d+)?\\.zip`, 'i');
    return pattern.test(assetName);
  };
  const generateDownloadData = () => {
    const currentVer = selectedVersion === 'prerelease' && prereleaseVer ? prereleaseVer : (latestVer || 'v1.1.7.1');
    if (selectedVersion === 'prerelease' && prereleaseAssets.length > 0) {
      return {
        macos: {
          title: t("download.macos.title"),
          description: t("download.macos.description"),
          downloads: [
            {
              name: currentVer,
              type: "Apple Silicon",
              url: getDownloadUrl(prereleaseAssets.find(asset => parseAssetName(asset.name, 'Macos', 'arm64'))?.browser_download_url ||
                `https://github.com/Class-Widgets/Class-Widgets/releases/download/${currentVer}/ClassWidgets-macOS-arm64.zip`)
            },
            {
              name: currentVer,
              type: "Intel",
              url: getDownloadUrl(prereleaseAssets.find(asset => parseAssetName(asset.name, 'Macos', 'x64'))?.browser_download_url ||
                `https://github.com/Class-Widgets/Class-Widgets/releases/download/${currentVer}/ClassWidgets-macOS-x64.zip`)
            }
          ]
        },
        windows: {
          title: t("download.windows.title"),
          description: t("download.windows.description"),
          downloads: [
            {
              name: currentVer,
              type: "x64",
              url: getDownloadUrl(prereleaseAssets.find(asset => parseAssetName(asset.name, 'Windows', 'x64'))?.browser_download_url ||
                `https://github.com/Class-Widgets/Class-Widgets/releases/download/${currentVer}/ClassWidgets-Windows-x64.zip`)
            },
            {
              name: currentVer,
              type: "x86",
              url: getDownloadUrl(prereleaseAssets.find(asset => parseAssetName(asset.name, 'Windows', 'x86'))?.browser_download_url ||
                `https://github.com/Class-Widgets/Class-Widgets/releases/download/${currentVer}/ClassWidgets-Windows-x86.zip`)
            }
          ]
        },
        linux: {
          title: t("download.linux.title"),
          description: t("download.linux.description"),
          downloads: [
            {
              name: currentVer,
              type: "Debian",
              url: getDownloadUrl(prereleaseAssets.find(asset => parseAssetName(asset.name, 'Linux', 'x64'))?.browser_download_url ||
                `https://github.com/Class-Widgets/Class-Widgets/releases/download/${currentVer}/ClassWidgets-Linux-x64.zip`)
            }
          ]
        }
      };
    }
    return {
      macos: {
        title: t("download.macos.title"),
        description: t("download.macos.description"),
        downloads: [
          {
            name: currentVer,
            type: "Apple Silicon",
            url: getDownloadUrl(`https://github.com/Class-Widgets/Class-Widgets/releases/download/${currentVer}/ClassWidgets-macOS-arm64.zip`)
          },
          {
            name: currentVer,
            type: "Intel",
            url: getDownloadUrl(`https://github.com/Class-Widgets/Class-Widgets/releases/download/${currentVer}/ClassWidgets-macOS-x64.zip`)
          }
        ]
      },
      windows: {
        title: t("download.windows.title"),
        description: t("download.windows.description"),
        downloads: [
          {
            name: currentVer,
            type: "x64",
            url: getDownloadUrl(`https://github.com/Class-Widgets/Class-Widgets/releases/download/${currentVer}/ClassWidgets-Windows-x64.zip`)
          },
          {
            name: currentVer,
            type: "x86",
            url: getDownloadUrl(`https://github.com/Class-Widgets/Class-Widgets/releases/download/${currentVer}/ClassWidgets-Windows-x86.zip`)
          }
        ]
      },
      linux: {
        title: t("download.linux.title"),
        description: t("download.linux.description"),
        downloads: [
          {
            name: currentVer,
            type: "Debian",
            url: getDownloadUrl(`https://github.com/Class-Widgets/Class-Widgets/releases/download/${currentVer}/ClassWidgets-Linux-x64.zip`)
          }
        ]
      }
    };
  };

  const platforms = [
    { id: "windows", name: "Windows", icon: Windows },
    { id: "macos", name: "macOS", icon: Apple },
    { id: "linux", name: "Linux", icon: Linux },
  ];

  // 根据activeTab更新activeIndex
  useEffect(() => {
    const index = platforms.findIndex(p => p.id === activeTab);
    setActiveIndex(index);
  }, [activeTab]);

  const ver = latestVer || 'v1.1.7.1'; // 使用最新版本号，如果未加载则使用默认值
  const proxy = 'https://ghfile.geekertao.top/';
  const getDownloadUrl = (baseUrl: string) => {
    return useProxy ? proxy + baseUrl : baseUrl;
  };

  const downloadData = generateDownloadData();

  const currentPlatform = downloadData[activeTab as keyof typeof downloadData];

  return (
    <div className={`min-h-screen bg-background text-foreground transition-all duration-700 ease-out ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="max-w-6xl mx-auto px-8 py-16 md:px-12 lg:px-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold mb-6 text-white" data-aos="fade-right">{t("download.title")}</h1>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed" data-aos="fade-right">
            <span dangerouslySetInnerHTML={{ __html: t("download.description") }} />
          </p><br/>

          {/* 版本选择卡片 */}
          <div className="flex flex-wrap gap-4 mb-8" data-aos="fade-right">
            {/* 正式版本卡片 */}
            <a
              onClick={(e) => {
                e.preventDefault();
                setSelectedVersion('stable');
              }}
              className={`cursor-pointer p-4 bg-white/5 rounded-lg shadow-md inline-flex items-center gap-4 border border-white/10 transition-all duration-300 ${
                selectedVersion === 'stable'
                  ? 'bg-white/10 border-white/30 shadow-lg'
                  : 'hover:bg-white/8'
              }`}
            >
              {loading ? (
                <span className="text-sm text-gray-400">{t("version.loading")}</span>
              ) : (
                <>
                  <img
                    src={logoImage.src}
                    alt="Class Widgets Logo"
                    className="size-12"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-semibold text-white">{t("version.latest")}: {latestVer || 'v1.1.7.1'}</span>
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                        {t("version.latest")}
                      </span>
                    </div>
                    {publishedDate && <span className="text-sm text-gray-400 block">{t("version.published")}: {publishedDate}</span>}
                  </div>
                </>
              )}
            </a>

            {/* 预发布版本卡片 */}
            {prereleaseVer && (
              <a
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedVersion('prerelease');
                }}
                className={`cursor-pointer p-4 bg-white/5 rounded-lg shadow-md inline-flex items-center gap-4 border border-white/10 transition-all duration-300 ${
                  selectedVersion === 'prerelease'
                    ? 'bg-white/10 border-white/30 shadow-lg'
                    : 'hover:bg-white/8'
                }`}
              >
                <>
                  <img
                    src={logoImage.src}
                    alt="Class Widgets Logo"
                    className="size-12"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-semibold text-white">{t("version.pre_release")}: {prereleaseVer}</span>
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
                        {t("version.pre_release")}
                      </span>
                    </div>
                    {prereleaseDate && <span className="text-sm text-gray-400 block">{t("version.published")}: {prereleaseDate}</span>}
                  </div>
                </>
              </a>
            )}
          </div>

          {/* Proxy Toggle */}
          <div className="mt-8 flex items-center" data-aos="fade-right">
            <Switch
              checked={useProxy}
              onChange={setUseProxy}
              className="mr-2"
            />
            <label htmlFor="useProxyToggle" className="text-gray-300">
              {t("download.use_proxy")}
            </label>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="mb-12" data-aos="zoom-in-right">
          <div ref={tabsRef} className="flex flex-wrap gap-2 bg-white/5 rounded-xl p-2 w-fit relative">
            {platforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <button
                  key={platform.id}
                  onClick={() => {
                    setActiveTab(platform.id);
                    // 使用replaceState更新URL哈希，避免产生历史记录
                    const hash = platform.id === 'windows' ? 'win' : platform.id;
                    history.replaceState(null, '', `#${hash}`);
                  }}
                  data-platform={platform.id}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 relative z-10 ${
                    activeTab === platform.id
                      ? "text-black"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <IconComponent className="size-5" />
                  <span className={`font-medium ${activeTab !== platform.id ? 'hidden md:block' : ''}`}>{platform.name}</span>
                </button>
              );
            })}
            <div
              className="absolute rounded-lg bg-white transition-all duration-300 z-0"
              style={{
                left: `${sliderPosition.left}px`,
                top: `${sliderPosition.top}px`,
                width: `${sliderPosition.width}px`,
                height: `${sliderPosition.height}px`
              }}
            />
          </div>
        </div>

        {/* Download Section - 改为滑动切换 */}
        <div className="bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10" data-aos="zoom-out-right">
          <div className="flex items-start justify-between">
            <div className="flex-1 overflow-hidden">
              {/* 滑动容器 */}
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {platforms.map(platform => {
                  const platformData = downloadData[platform.id as keyof typeof downloadData];
                  return (
                    <div key={platform.id} className="w-full flex-shrink-0">
                      <div className="flex items-center gap-3 mb-4">
                        <platform.icon className="size-8 text-white" />
                        <h2 className="text-3xl font-semibold text-white">{platformData.title}</h2>
                      </div>

                      <p className="text-gray-300 mb-8 whitespace-pre-line leading-relaxed">
                        {platformData.description}
                      </p>

                      {/* Download Options */}
                      <div className="space-y-4">
                        {loading ? (
                          <p className="text-gray-400">{t("download.loading")}</p>
                        ) : (
                          platformData.downloads.map((download, index) => (
                            <div key={index} className="flex flex-wrap items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                              <div className="flex items-center gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-medium text-white">{download.name}</span>
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                      download.type === "Beta"
                                        ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                                        : "bg-green-500/20 text-green-300 border border-green-500/30"
                                    }`}>
                                      {download.type}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <a
                                href={download.url}
                                className="flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 text-sm w-full mt-2 md:w-auto md:mt-0 md:px-6 md:py-2"
                              >
                                <svg className="size-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="flex-shrink-0">{t("download.download_button")}</span>
                              </a>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* App Icon */}
            <div className="ml-8 hidden lg:block">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 shadow-2xl border border-white/10">
                <img
                  src={logoImage.src}
                  alt="Class Widgets"
                  className="size-32 rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            <span dangerouslySetInnerHTML={{ __html: t('download.footer.help') }} />
          </p>
          <p className="text-sm text-gray-500">
            {t("download.footer.security")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Download;