import Link from 'next/link';

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] bg-gray-100 overflow-hidden">
      {/* Background Image - Using a placeholder for now */}
      <div className="absolute inset-0">
        <img 
          src="/images/hero-banner-new.png" 
          alt="Nueva Colección Totto" 
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 h-full">
        {/* Badge - Arriba a la izquierda */}
        <div className="absolute top-6 left-4 lg:left-8">
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#e4d2ef] text-gray-800 text-[10px] md:text-xs font-bold tracking-widest shadow-sm">
            NUEVA COLECCIÓN
          </span>
        </div>

        {/* Desktop Text - Centro izquierda (Solo visible en computadoras) */}
        <div className="hidden md:flex h-full items-center">
          <div className="max-w-lg text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading mb-6 leading-tight tracking-tight uppercase drop-shadow-md">
              FANS DE LA<br />PRACTICIDAD
            </h1>
            <p className="text-sm md:text-base mb-10 font-medium text-gray-100 drop-shadow-sm max-w-sm">
              Más funcionalidad, más color e innovación para ti.
            </p>
          </div>
        </div>

        {/* Button - Abajo centrado */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full flex justify-center px-4">
          <Link 
            href="/coleccion/Catalogo" 
            className="bg-[#e4d2ef] text-gray-800 px-10 py-3.5 md:px-12 md:py-4 rounded-full font-bold hover:bg-black hover:text-white transition-all hover:scale-105 text-center text-sm md:text-base shadow-xl"
          >
            CATÁLOGO
          </Link>
        </div>
      </div>
    </div>
  );
}
