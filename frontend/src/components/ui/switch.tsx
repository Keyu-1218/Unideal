import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

function Switch({
  disabled,
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      disabled={disabled}
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[28px] w-[68px] items-center rounded-full border border-transparent shadow-xs outline-none transition-colors",
        "px-[4px]",
        "data-[state=unchecked]:bg-[#EBEBEB] data-[state=checked]:bg-[#719781]",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        aria-disabled={disabled}
        data-slot="switch-thumb"
        className={cn(
          "size-5",
          "rounded-full bg-[#d9d9d9] shadow-sm transition-transform duration-200 ease-out",
          "pointer-events-none",
          "data-[state=unchecked]:translate-x-0",
          "data-[state=checked]:translate-x-[40px]"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
