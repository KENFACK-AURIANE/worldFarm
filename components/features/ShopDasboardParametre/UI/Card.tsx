// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { PropsWithChildren } from "react";
export const Card = ({ children }: PropsWithChildren) => (

  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
    {children}
  </div>
);