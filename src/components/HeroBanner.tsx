import Link from 'next/link';

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] bg-gray-100 overflow-hidden">
      {/* Background Image - Using a placeholder for now */}
      <div className="absolute inset-0">
        <img 
          src="/images/hero-banner.png" 
          alt="Nueva Colección Totto" 
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 h-full flex items-center">
        <div className="max-w-xl text-white">
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#e4d2ef] text-gray-800 text-xs font-bold tracking-widest mb-6">
            NUEVA COLECCIÓN
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading mb-6 leading-tight tracking-tight uppercase">
            FANS DE LA<br />PRACTICIDAD
          </h1>
          <p className="text-base md:text-lg mb-10 font-medium text-gray-200">
            Más funcionalidad, más color e innovación para ti. Descubre los nuevos diseños con múltiples compartimentos.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/coleccion/Catalogo" 
              className="bg-[#e4d2ef] text-gray-800 px-8 py-4 rounded-full font-bold hover:bg-black hover:text-white transition-colors text-center"
            >
              ¡COMPRAR AHORA!
            </Link>
            <Link 
              href="/morrales" 
              className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors text-center"
            >
              VER MORRALES
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
