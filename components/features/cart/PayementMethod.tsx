export default function PaymentMethod() {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">💳 Mode de paiement</h2>
        <button className="text-green-600">+ Ajouter</button>
      </div>

      <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-xl text-yellow-700">
        <p className="font-semibold">⚠️ Aucun moyen de paiement</p>
        <p className="text-sm">
          Ajoutez un compte Mobile Money pour continuer
        </p>
      </div>
    </div>
  );
}