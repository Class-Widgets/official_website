export type Platform = "windows" | "macos" | "linux";

const RELEASE_DOWNLOAD =
  "https://github.com/RinLit-233-shiroko/Class-Widgets-2/releases/latest/download";
const RELEASES_PAGE =
  "https://github.com/RinLit-233-shiroko/Class-Widgets-2/releases/latest";

export const DOCS_URL = "https://class-widgets.github.io/cw-docs/";

type NavigatorUAData = {
  platform?: string;
};

function readPlatformSource(): string {
  const uaData =
    "userAgentData" in navigator
      ? (navigator.userAgentData as NavigatorUAData | undefined)
      : undefined;

  return `${uaData?.platform ?? ""} ${navigator.platform} ${navigator.userAgent}`.toLowerCase();
}

export function detectPlatform(): Platform {
  const source = readPlatformSource();

  if (source.includes("win")) return "windows";
  if (
    source.includes("mac") ||
    source.includes("iphone") ||
    source.includes("ipad") ||
    source.includes("ipod") ||
    source.includes("ios")
  ) {
    return "macos";
  }
  if (source.includes("linux") || source.includes("android") || source.includes("cros")) {
    return "linux";
  }

  return "windows";
}

function prefersAppleSilicon(): boolean {
  const source = readPlatformSource();
  if (/iphone|ipad|ipod|ios|arm|aarch64/.test(source)) return true;
  if (/intel|x86_64/.test(source)) return false;

  return true;
}

export function getDownloadHref(platform: Platform): string {
  if (platform === "windows") {
    return `${RELEASE_DOWNLOAD}/ClassWidgets-2-Windows.zip`;
  }

  if (platform === "macos") {
    const arch = prefersAppleSilicon() ? "ARM64" : "X64";
    return `${RELEASE_DOWNLOAD}/ClassWidgets-2-macOS-${arch}.dmg`;
  }

  return RELEASES_PAGE;
}

export const PLATFORM_LABEL: Record<Platform, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
};
