import ThemePlugin from "@/assets/theme&plugin_1.png";

const Personalization = () => {
  return (
    <div className="flex flex-col lg:grid grid-cols-2 gap-12">
      <div className="flex flex-col gap-8 justify-center">
        <h1 className="flex text-3xl lg:text-4xl xl:text-5xl font-semibold flex-col 2xl:flex-row gap-4 xl:gap-8">
          <span className="bg-gradient-to-r from-[#8e82ff] to-[#16e647] bg-clip-text text-transparent">
            插件 & 主题
          </span>
          <span>极致自定义</span>
        </h1>
        <p className="text-xl xl:text-2xl leading-tight">
          在 Class Widgets 中，提供了基于 Python
          的插件系统和插件广场；你可以在插件广场中安装您需要的插件。以及彰显个性的主题系统，让你搭建出独一无二的
          Class Widgets。
        </p>
      </div>
      <img src={ThemePlugin.src} alt="theme&plugin" className="w-full h-fit" />
    </div>
  );
};

export default Personalization;
