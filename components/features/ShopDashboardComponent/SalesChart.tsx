/* eslint-disable @typescript-eslint/no-explicit-any */
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function SalesChart({ salesData }: any) {
  // On prépare les données pour Recharts
  const data = salesData?.days?.map((d: any) => ({
    name: d.dayOfWeek.charAt(0), // 'L', 'M', 'M', etc.
    revenue: d.revenue
  })) || [];

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm mx-4 mt-6">
      {/* Header identique à l'image */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-[#1D267D] font-bold text-sm">
          <span className="text-lg">📈</span> VENTES - 7 DERNIERS JOURS
        </div>
        <button className="text-indigo-400 text-sm font-medium">Voir plus</button>
      </div>

      {/* Stats dynamiques */}
      <div className="flex gap-12 mb-4">
        <div>
          <p className="text-gray-400 text-xs mb-1">Total Semaine</p>
          <p className="text-4xl font-bold text-[#1D267D]">{salesData?.totalRevenue?.toLocaleString() || 0}</p>
        </div>
        <div className="border-l pl-12">
          <p className="text-gray-400 text-xs mb-1">Moyenne/Jour</p>
          <p className="text-4xl font-bold text-green-500">{salesData?.averageDaily?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* LA VRAIE COURBE DYNAMIQUE */}
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#9CA3AF', fontSize: 12}}
              dy={10}
            />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#1D267D" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#1D267D', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
