import { 
  Lightbulb, 
  Zap, 
  Truck, 
  Home, 
  Star, 
  
} from 'lucide-react';
export default function InstructionAddressCard() {
  return (
    <div className='mx-4 mt-5'>
      <div className=" bg-[#eef7f6] border border-teal-100 rounded-2xl p-5 shadow-sm ">
          <div className="flex flex-col gap-4">
            <div className='flex flex-row items-center gap-4'>
                <div className="bg-teal-100 p-3 rounded-full h-fit">
                    <Lightbulb className="text-teal-600" size={24} />
                </div>
                <h2 className="text-gray-800 font-bold mb-3">Gérez vos adresses de livraison</h2>
            </div>
            
            <div>
              
              <p className="text-sm text-gray-500 mb-4">Vos adresses enregistrées vous permettent de :</p>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-3"><Zap size={16} className="text-blue-500" /> Passer commande plus rapidement</li>
                <li className="flex items-center gap-3"><Truck size={16} className="text-blue-500" /> Éviter les erreurs de livraison</li>
                <li className="flex items-center gap-3"><Home size={16} className="text-blue-500" /> Alterner entre domicile et bureau</li>
                <li className="flex items-center gap-3"><Star size={16} className="text-blue-500" /> Définir une adresse par défaut</li>
              </ul>
            </div>
          </div>
        </div>
      
    </div>
  );
}