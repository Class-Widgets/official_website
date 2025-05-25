import Apple from "@/components/icon/Apple";
import Ubuntu from "@/components/icon/Ubuntu";
import Windows from "@/components/icon/Windows";
import Logo from "@/assets/logo_square.png";
import { Button, TransparentButton } from "@/components/ui/Button";

const Test = () => {
  return (
    <div className="h-screen w-full">
      <div className="relative h-full bg-[url('/assets/banner.svg')] bg-cover bg-center bg-no-repeat text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="ease-mobai-bounce max-w-8xl relative z-10 mx-auto flex h-full flex-col items-start justify-center gap-4 px-8 transition-all duration-500 md:gap-8 md:px-12 lg:px-16 xl:px-24">
          <img
            src={Logo.src}
            alt="logo"
            className="ease-mobai-bounce size-24 transition-all duration-500 lg:size-32 xl:size-48"
          />
          <div className="ease-mobai-bounce flex flex-col gap-4 transition-all duration-500 md:gap-8">
            <div className="ease-mobai-bounce gap-4 text-3xl leading-snug font-semibold whitespace-pre-line transition-all duration-500 lg:text-4xl xl:text-5xl">
              <h1>{`多样的桌面课表\n由我们定义的全新桌面形态`}</h1>
            </div>
            <div className="ease-mobai-bounce flex flex-row gap-4 transition-all duration-500 md:gap-8">
              <Button
                href="https://github.com/Class-Widgets/Class-Widgets/releases/latest/download/ClassWidgets-Windows-x64.zip"
                className="hidden w-fit flex-row items-center gap-2 lg:flex"
              >
                <Windows className="size-6" />
                <span className="text-lg lg:text-xl">下载 Class Widgets</span>
              </Button>
              <TransparentButton
                href="https://github.com/Class-Widgets/Class-Widgets/releases/latest/"
                className="hidden w-fit flex-row items-center gap-2 lg:flex"
              >
                <Apple className="size-6" />
                <Ubuntu className="size-6" />
                <span className="text-lg lg:text-xl">更多版本</span>
              </TransparentButton>
              <TransparentButton
                href="https://www.yuque.com/rinlit/class-widgets_help"
                className="flex w-fit flex-row items-center gap-2"
              >
                <span className="text-lg lg:text-xl">文档</span>
              </TransparentButton>
              <TransparentButton
                href="https://www.yuque.com/rinlit/standards"
                className="flex w-fit flex-row items-center gap-2"
              >
                <span className="text-lg lg:text-xl">社区</span>
              </TransparentButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
