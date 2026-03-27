export default function AddressCard() {
  return (
    <div>
      <h2 className="font-semibold mb-2">📍 Adresse de livraison</h2>

      <div className="border-2 border-green-600 rounded-xl p-4 bg-white">
        <div className="flex justify-between items-center mb-2">
          <span className="bg-green-600 text-white text-xs px-3 py-1 rounded">
            Domicile
          </span>
          <button className="text-green-600">Changer</button>
        </div>

        <p className="font-semibold">Nom non renseigné</p>
        <hr className="my-2" />
        <p className="text-gray-600 text-sm">
          rue 1, rue 1, Douala, Littoral
        </p>
      </div>

      <div className="bg-green-100 text-green-700 mt-2 p-3 rounded-lg text-sm">
        🚚 Livraison estimée: 1-2 jours
      </div>
    </div>
  );
}