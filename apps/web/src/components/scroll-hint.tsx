import type { Ref } from "react";
import { ChevronDown } from "lucide-react";

export function ScrollHint({
  className,
  ref,
}: {
  className?: string;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      ref={ref}
    >
      <span>下滑了解更多</span>
      <ChevronDown
        className="motion-safe:animate-[hint-float_1.8s_ease-in-out_infinite]"
        size={14}
        strokeWidth={1.8}
      />
    </div>
  );
}
