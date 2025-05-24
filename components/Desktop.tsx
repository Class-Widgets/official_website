import CwLayout from "/assets/cw_layout_1.png";

const Desktop = () => {
  return (
    <div className="flex flex-row gap-12">
      <div className="w-full rounded-2xl flex flex-col justify-between items-center">
        <img src={CwLayout.src} />
      </div>
    </div>
  );
};

export default Desktop;
