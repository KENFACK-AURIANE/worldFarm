"use client";

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const AlertMerchant = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col sm:flex-row mx-4 items-center justify-between p-6 gap-4 
        bg-[#FFF0D9] border-[1.5px] border-[#F4A84D] rounded-[40px] 
        max-w-3xl  shadow-sm"
    >
      {/* Section Gauche : Icône et Texte */}
      <div className="flex  flex-row items-center justify-center gap-5">
        {/* Cercle de l'icône */}
        <div className="shrink-0 w-10 h-10 rounded-full bg-[#F4A84D] flex items-center justify-center">
          <AlertTriangle className="text-white  stroke-[2.5px]" />
        </div>

        {/* Contenu textuel */}
        <div className="flex flex-col space-y-1 ">
          <h3 className="text-[#BF5A2B] text-xl font-bold leading-tight">
            Numéro marchand requis
          </h3>
          <p className="text-[#BF5A2B]  opacity-90 leading-relaxed max-w-md">
            Configurez votre numéro marchand pour effectuer des retraits et recevoir vos paiements.
          </p>
        </div>

        {/* Section Droite : Bouton */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="bg-[#F4A84D] hover:bg-[#E2973C] text-white font-bold text-[14px] 
        px-2 py-4 rounded-xl w-22 transition-colors duration-200 
        shadow-inner active:shadow-none"
        onClick={() => console.log("Configuration...")}
      >
        Configurer
      </motion.button>
      </div>

      
    </motion.div>
  );
};

export default AlertMerchant;