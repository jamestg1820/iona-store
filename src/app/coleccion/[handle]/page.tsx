import { getCollectionProducts } from "@/lib/shopify";
import Link from "next/link";
import { ChevronRight, ShoppingCart } from "lucide-react";

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const { title, products } = await getCollectionProducts(handle);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-4 lg:px-8 border-b border-gray-100">
        <nav className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-black">Inicio</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium truncate">
            {title || handle.charAt(0).toUpperCase() + handle.slice(1)}
          </span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-2 uppercase">
          {title || handle.replace('-', ' ')}
        </h1>
        <p className="text-gray-500 mb-10">Explora todos los productos de esta categoría.</p>

        {products.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-2xl text-gray-600 font-bold mb-4">No se encontraron productos</h2>
            <p className="text-gray-500">Todavía no has agregado productos a la colección "{handle}" en Shopify.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-100 rounded-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col">
                <Link href={`/producto/${product.handle}`} className="flex flex-col flex-grow">
                  <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-[#B5BCE5] text-white text-[10px] font-bold px-2.5 py-1 z-10 tracking-wider">
                        {product.badge}
                      </div>
                    )}
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Hover Button (Visual only since card is a link) */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                      <div className="w-full bg-[#B5BCE5] text-white py-3 rounded font-bold hover:bg-[#a3aad3] transition-colors flex items-center justify-center shadow-lg">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        VER DETALLES
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-semibold text-gray-800 group-hover:text-[#B5BCE5] transition-colors mb-2 line-clamp-2 min-h-[48px]">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-3 mt-3">
                      <span className="font-black text-xl text-gray-900">${Number(product.price).toLocaleString('es-CO')}</span>
                      {product.originalPrice && (
                        <span className="text-sm font-medium text-gray-400 line-through">${Number(product.originalPrice).toLocaleString('es-CO')}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
