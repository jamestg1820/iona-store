import { getCollectionProducts } from "@/lib/shopify";
import Link from "next/link";
import { ChevronRight, ShoppingCart } from "lucide-react";

export default async function CollectionPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ handle: string }>,
  searchParams: Promise<{ page?: string }>
}) {
  const { handle } = await params;
  const { page } = await searchParams;
  const { title, products } = await getCollectionProducts(handle);

  const currentPage = parseInt(page || '1');
  const productsPerPage = 8;
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

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
        <h1 className="text-4xl md:text-5xl font-heading tracking-tight text-gray-900 mb-2 uppercase">
          {title || handle.replace('-', ' ')}
        </h1>
        <p className="text-gray-500 mb-10">Explora todos los productos de esta categoría.</p>

        {currentProducts.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-2xl text-gray-600 font-bold mb-4">No se encontraron productos</h2>
            <p className="text-gray-500">Todavía no has agregado productos a la colección "{handle}" en Shopify.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {currentProducts.map((product: any) => (
                <div key={product.id} className="bg-white border border-gray-100 rounded-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col">
                  <Link href={`/producto/${product.handle}`} className="flex flex-col flex-grow">
                    <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                      {product.badge && (
                        <div className="absolute top-2 left-2 bg-[#e4d2ef] text-gray-800 text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2.5 md:py-1 z-10 tracking-wider">
                          {product.badge}
                        </div>
                      )}
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out hidden md:block">
                        <div className="w-full bg-[#e4d2ef] text-gray-800 py-2 md:py-3 rounded font-bold hover:bg-black hover:text-white transition-colors flex items-center justify-center shadow-lg text-xs md:text-sm">
                          <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                          DETALLES
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 md:p-5 flex flex-col flex-grow">
                      <h3 className="font-semibold text-gray-800 group-hover:text-[#e4d2ef] transition-colors mb-1 md:mb-2 line-clamp-2 min-h-[32px] md:min-h-[48px] text-xs md:text-base">
                        {product.name}
                      </h3>
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-3 mt-1 md:mt-3">
                        <span className="font-black text-sm md:text-xl text-gray-900">${Number(product.price).toLocaleString('es-CO')}</span>
                        {product.originalPrice && (
                          <span className="text-[10px] md:text-sm font-medium text-gray-400 line-through">${Number(product.originalPrice).toLocaleString('es-CO')}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={`/coleccion/${handle}?page=${pageNumber}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-[#e4d2ef] hover:text-gray-800'
                    }`}
                  >
                    {pageNumber}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
