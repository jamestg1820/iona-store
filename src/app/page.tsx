import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCarousel from "@/components/ProductCarousel";
import { getProducts, getCollectionProducts } from "@/lib/shopify";

export default async function Home() {
  const shopifyProducts = await getProducts();
  const recommendedResults = await getCollectionProducts('recomendados-para-ti');
  const recommendedProducts = recommendedResults.products;

  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <ProductCarousel title="NUEVA COLECCIÓN" products={shopifyProducts.length > 0 ? shopifyProducts : undefined} />
      
      {/* Banner Secundario */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="relative w-full h-[300px] md:h-[400px] bg-[#1E1E1E] rounded-xl overflow-hidden flex items-center justify-center shadow-lg">
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=1200&q=80" alt="Viaja Ligero" className="w-full h-full object-cover opacity-60" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="relative z-10 text-center text-white px-4 mt-16 md:mt-0">
              <h2 className="text-4xl md:text-5xl font-heading mb-4 tracking-tight text-white">VIAJA LIGERO</h2>
              <p className="text-lg md:text-xl mb-8 max-w-lg mx-auto text-gray-200 font-medium">Equipaje ideal para todo tipo de viaje con el diseño, innovación y durabilidad de IONA.</p>
              <a href="/viaje" className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors inline-block text-sm shadow-md">
                VER MALETAS DE VIAJE
              </a>
            </div>
          </div>
        </div>
      </section>

      <ProductCarousel 
        title="RECOMENDADOS PARA TI" 
        products={recommendedProducts.length > 0 ? recommendedProducts : undefined} 
      />
    </>
  );
}
