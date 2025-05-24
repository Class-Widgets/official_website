import { Button, TransparentButton } from "@/components/ui/Button";
import Apple from "@/components/icon/Apple";
import Windows from "@/components/icon/Windows";
import Ubuntu from "@/components/icon/Ubuntu";
import Logo from "@/assets/logo_square.png";

const Test = () => {
  return (
    <div className="w-full h-screen">
      <div className="relative h-full text-white bg-[url('/assets/banner.svg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center items-start px-4 sm:px-24 gap-8">
          <img
            src={Logo.src}
            alt="logo"
            className="size-36 lg:size-64 2xl:size-96"
          />
          <div className="flex flex-col gap-12">
            <div className="flex text-4xl md:text-5xl lg:text-6xl 2xl:text-8xl transition-all duration-500 ease-mobai-bounce flex-col gap-8 font-semibold">
              <h1>多样的桌面课表</h1>
              <h1>由我们定义的全新桌面形态</h1>
            </div>
            <div className="flex flex-row gap-8">
              <Button
                href="https://github.com/Class-Widgets/Class-Widgets/releases/latest/download/ClassWidgets-Windows-x64.zip"
                className="flex-row gap-2 items-center w-fit hidden lg:flex"
              >
                <Windows className="size-6" />
                <span className="text-2xl">下载 Class Widgets</span>
              </Button>
              <TransparentButton
                href="https://github.com/Class-Widgets/Class-Widgets/releases/latest/"
                className="flex-row gap-2 items-center w-fit hidden lg:flex"
              >
                <Apple className="size-6" />
                <Ubuntu className="size-6" />
                <span className="text-2xl">更多版本</span>
              </TransparentButton>
              <TransparentButton
                href="https://www.yuque.com/rinlit/class-widgets_help"
                className="flex-row gap-2 items-center w-fit flex"
              >
                <span className="text-2xl">文档</span>
              </TransparentButton>
              <TransparentButton
                href="https://www.yuque.com/rinlit/standards"
                className="flex flex-row gap-2 items-center w-fit"
              >
                <span className="text-2xl">社区</span>
              </TransparentButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
