import { ChevronRight } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function MenuItem({ icon, title, subtitle }: any) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
      
      <div className="flex items-center gap-3">
        <div className="bg-green-100 text-green-600 p-2 rounded-xl">
          {icon}
        </div>

        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>

      <button className="text-gray-400">
        <ChevronRight />
      </button>
    </div>
  );
}