export default function OrderSummary() {
  return (
    <div>
      <h2 className="font-semibold mb-2">📄 Résumé de la commande</h2>

      <div className="bg-white p-4 rounded-xl space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Total articles</span>
          <span>3000 FCFA</span>
        </div>

        <div className="flex justify-between">
          <span>Frais de livraison</span>
          <span>50 FCFA</span>
        </div>

        <hr />

        <div className="flex justify-between font-bold text-green-600 text-lg">
          <span>Total à payer</span>
          <span>3050 FCFA</span>
        </div>
      </div>

      <div className="mt-4 bg-white p-4 rounded-xl text-sm">
        <p className="font-semibold text-blue-600 mb-2">
          Protection des commandes WorldFarm Market
        </p>

        <ul className="space-y-1 text-gray-600">
          <li>Paiement sécurisé</li>
          <li> Suivi de livraison</li>
          <li>Protection remboursement</li>
          <li> Assistance 24h/24, 7j/7</li>
          <li> Confidentialité des données</li>
        </ul>
      </div>
    </div>
  );
}