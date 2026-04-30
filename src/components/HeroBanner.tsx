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
        <div className="max-w-lg text-white">
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#e4d2ef] text-gray-800 text-xs font-bold tracking-widest mb-6">
            NUEVA COLECCIÓN
          </span>
          <h1 className="hidden md:block text-4xl md:text-5xl lg:text-6xl font-heading mb-6 leading-tight tracking-tight uppercase">
            FANS DE LA<br />PRACTICIDAD
          </h1>
          <p className="hidden md:block text-sm md:text-base mb-10 font-medium text-gray-200">
            Más funcionalidad, más color e innovación para ti. Descubre los nuevos diseños con múltiples compartimentos.
          </p>
          <div className="flex flex-col sm:flex-row">
            <Link 
              href="/coleccion/Catalogo" 
              className="bg-[#e4d2ef] text-gray-800 px-6 py-2.5 md:px-8 md:py-4 rounded-full font-bold hover:bg-black hover:text-white transition-colors text-center text-sm md:text-base shadow-lg"
            >
              CATÁLOGO
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
