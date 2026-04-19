"use client";
import { useState } from "react";

type ToggleProps = {
  value?: boolean;
  onChange?: (nextValue: boolean) => void;
};

export const Toggle = ({ value = false, onChange }: ToggleProps) => {
  const [enabled, setEnabled] = useState(value);

  const toggle = () => {
    setEnabled(!enabled);
    onChange?.(!enabled);
  };

  return (
    <div
      onClick={toggle}
      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition ${
        enabled ? "bg-green-500" : "bg-slate-300"
      }`}
    >
      {/* ... */}
    </div>
  );
};