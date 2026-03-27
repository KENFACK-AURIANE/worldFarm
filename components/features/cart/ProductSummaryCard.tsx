export default function ProductSummaryCard() {
  return (
    <div>
      <h2 className="font-semibold mb-2">🛍️ Article</h2>

      <div className="bg-white p-3 rounded-xl shadow-sm flex gap-3 items-center">
        <img
          src="/phone.png"
          alt="product"
          className="w-16 h-16 rounded object-cover"
        />

        <div className="flex-1">
          <p className="font-semibold">Xiaomi 17 Pro Max</p>
          <p className="text-sm text-gray-500">Kai Shop ✔️</p>
          <p className="text-green-600 font-bold">1000 FCFA</p>
        </div>

        <p className="text-sm text-gray-500">Qté: 3</p>
      </div>
    </div>
  );
}