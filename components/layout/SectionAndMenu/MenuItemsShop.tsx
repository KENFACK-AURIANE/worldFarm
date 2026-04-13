/* eslint-disable @typescript-eslint/no-explicit-any */
export default function MenuItemShop({ icon, title, subtitle,icon2 }: any) {
  return (
    <div className="bg-vendor-accent/10 text-white p-6 rounded-lg flex justify-between items-center shadow">
      
      <div className="flex items-center gap-3">
        <div className="bg-vendor-accent text-white p-4 rounded-lg">
          {icon}
        </div>

        <div>
          <p className="text-xl text-vendor-primary font-medium">{title}</p>
          <p className="text-sm text-gray-700">{subtitle}</p>
        </div>
      </div>

      <button className="text-gray-400">
        {icon2}
      </button>

      
    </div>
  );
}
