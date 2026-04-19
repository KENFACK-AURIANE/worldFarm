import { ReceiptText } from "lucide-react";

export default function EmptyOrders() {
  return <div className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm border border-gray-100 mx-4 mt-6">
        <ReceiptText size={48} className="text-gray-300 mb-4" strokeWidth={1.5} />
        <h3 className="text-gray-700 font-semibold text-lg">Aucune commande récente</h3>
        <p className="text-gray-400 text-sm text-center">Vos commandes apparaîtront ici</p>
      </div>
}