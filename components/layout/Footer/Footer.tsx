import Link from 'next/link';
import { Facebook, Twitter, Instagram, Smartphone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-dark text-text-primary border-t border-border mt-10 w-full">
      <div className="container mx-auto px-6 py-12">
        {/* Grille principale */}
        <div className="max-w-full grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Colonne 1 : Logo & Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary-dark">WorldFarm</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Votre marché agricole en ligne. <br />
              Produits frais, directs du producteur.
            </p>
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <h3 className="font-semibold mb-4 uppercase text-xs tracking-wider">Navigation</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/client/acceuil" className="hover:text-primary-dark transition-colors">Accueil</Link></li>
              <li><Link href="/client/categories" className="hover:text-primary-dark transition-colors">Catégories</Link></li>
              <li><Link href="/client/boutiques" className="hover:text-primary-dark transition-colors">Boutiques</Link></li>
              <li><Link href="/client/espaceVendeur" className="hover:text-primary-dark transition-colors">Devenir vendeur</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Aide */}
          <div>
            <h3 className="font-semibold mb-4 uppercase text-xs tracking-wider">Aide</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/faq" className="hover:text-primary-dark transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary-dark transition-colors">Contact</Link></li>
              <li><Link href="/cgv" className="hover:text-primary-dark transition-colors">CGV</Link></li>
              <li><Link href="/livraison" className="hover:text-primary-dark transition-colors">Livraison</Link></li>
            </ul>
          </div>

          {/* Colonne 4 : Réseaux & Paiements */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4 uppercase text-xs tracking-wider">Suivez-nous</h3>
              <div className="flex gap-4">
                <Link href="#" className="p-2 bg-white rounded-full shadow-sm hover:text-blue-600 transition-all"><Facebook size={18}/></Link>
                <Link href="#" className="p-2 bg-white rounded-full shadow-sm hover:text-sky-400 transition-all"><Twitter size={18}/></Link>
                <Link href="#" className="p-2 bg-white rounded-full shadow-sm hover:text-pink-600 transition-all"><Instagram size={18}/></Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 uppercase text-xs tracking-wider text-text-hint">Paiements sécurisés</h3>
              <div className="flex gap-2 font-bold text-xs">
                <span className="px-2 py-1 bg-white border border-border rounded text-[#ffcc00]">MTN</span>
                <span className="px-2 py-1 bg-white border border-border rounded text-[#ff6600]">ORANGE</span>
              </div>
            </div>
          </div>

        </div>

        {/* Barre de Copyright */}
        <div className="pt-8 border-t border-border text-center text-xs text-text-hint">
          <p>© {currentYear} WorldFarm. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
