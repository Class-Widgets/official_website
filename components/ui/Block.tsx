export const Block = ({
  title,
  content,
}: {
  title?: string;
  content?: string;
}) => {
  return (
    <div className="flex flex-col gap-8 bg-[#11121C]">
      <h1 className="ease-mobai-bounce flex flex-col gap-2 text-3xl font-semibold transition-all duration-500 lg:gap-4 lg:text-4xl xl:gap-8 xl:text-5xl">
        <span>{title}</span>
      </h1>
      <p className="text-lg leading-tight xl:text-xl">{content}</p>
    </div>
  );
};
