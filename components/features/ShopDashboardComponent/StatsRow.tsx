/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export default function StatsRow({ data }: { data: any }) {
  return (
    <div className="mx-4 mt-4 grid grid-cols-4 gap-2">
      <Stat label="Ventes" value={data.stats.todaySales} />
      <Stat label="Attente" value={data.stats.pendingOrders} />
      <Stat label="Produits" value={data.stats.activeProducts} />
      <Stat label="Reels" value={data.stats.reels} />
    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="bg-white p-3 rounded-xl text-center">
      <p className="font-bold">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}