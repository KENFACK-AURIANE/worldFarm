/* eslint-disable @typescript-eslint/no-explicit-any */
export default function MenuItemShop({ icon, title, subtitle,icon2 }: any) {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-2xl flex justify-between items-center shadow">
      
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
        {icon2}
      </button>

      
    </div>
  );
}
