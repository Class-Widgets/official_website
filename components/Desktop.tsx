import Cw_Layout_1 from "@/assets/cw_layout_1.png";

const Desktop = () => {
  return (
    <div className="flex w-full flex-col items-center rounded-2xl border-2 border-[#303640] px-12">
      <div className="pb-16">
        <img src={Cw_Layout_1.src} />
        <p className="ease-mobai-bounce flex flex-row justify-center gap-2 text-lg font-semibold transition-all duration-500 md:text-3xl lg:gap-4 lg:text-4xl xl:gap-8 xl:text-5xl">
          <span className="bg-gradient-to-r from-[#82e6ff] to-[#165fe6] bg-clip-text text-transparent">
            向未来形态的课程表
          </span>
          <span>说你好</span>
        </p>
      </div>
    </div>
  );
};

export default Desktop;
