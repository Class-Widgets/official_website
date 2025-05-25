import Theme_Plugin_1 from "@/assets/theme&plugin_1.png";

const Personalization = () => {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div className="flex flex-col justify-center gap-8">
        <h1 className="ease-mobai-bounce flex flex-col gap-2 text-3xl font-semibold transition-all duration-500 lg:gap-4 lg:text-4xl xl:gap-8 xl:text-5xl">
          <span className="bg-gradient-to-r from-[#8e82ff] to-[#16e647] bg-clip-text text-transparent">
            插件 & 主题
          </span>
          <span>极致自定义</span>
        </h1>
        <p className="text-lg leading-tight xl:text-xl">
          在 Class Widgets 中，提供了基于 Python
          的插件系统和插件广场；你可以在插件广场中安装您需要的插件。以及彰显个性的主题系统，让你搭建出独一无二的
          Class Widgets。
        </p>
      </div>
      <img
        src={Theme_Plugin_1.src}
        alt="theme&plugin"
        className="h-fit w-full"
      />
    </div>
  );
};

export default Personalization;
