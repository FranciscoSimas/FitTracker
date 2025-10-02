import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const Switch = React.forwardRef<HTMLLabelElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, disabled = false, id, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
    };

    return (
      <label
        ref={ref}
        className={cn(
          "switch",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          id={id}
        />
        <span className="slider" />
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
