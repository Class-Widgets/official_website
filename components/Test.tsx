import { Block } from "@/components/ui/Block";

const Test = () => {
  return (
    <div className="max-w-8xl mx-auto flex flex-col gap-12">
      <div className="grid gap-16 md:grid-cols-2">
        <Block
          title="高度的自定义设置"
          content="致力于提供高度的自定义选项，使每位用户能构建出独一无二的桌面课表。"
        />
        <Block
          title="增强的通知系统"
          content="提供了强大的通知系统，能够在上下课等时间点推出提醒；此外，插件也可调用通知接口，使其更加实用。"
        />
        <Block
          title="浮窗"
          content="全新隐藏方式——浮窗，能够让 Class Widgets 的重要信息浓缩为一块浮动的窗口，更轻巧便捷。尽量减小其对教学工作的干扰。"
        />
        <Block
          title="Fluent Design"
          content="Class Widgets 采用了由微软推出的 Fluent Design 设计语言，使界面更加简洁、舒适和流畅，且使用了 QFluentWidgets UI库。"
        />
      </div>
    </div>
  );
};

export default Test;
