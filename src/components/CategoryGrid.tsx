import Link from 'next/link';

const categories = [
  { name: 'Morrales', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', href: '/coleccion/morrales' },
  { name: 'Mujer', image: 'https://tottoco.vtexassets.com/assets/vtex.file-manager-graphql/images/21e17950-ebe0-4ddf-acc6-c47c5ed052b6___4d5d524ac0436da604f684fff9521ea6.svg', href: '/coleccion/mujer' },
  { name: 'Hombre', image: 'https://tottoco.vtexassets.com/assets/vtex.file-manager-graphql/images/9260cebc-903a-4ce1-b18b-1017a9ab5a06___f3d48c444d008d1ac359028d9319d9a0.svg', href: '/coleccion/hombre' },
  { name: 'Carteras', image: 'https://tottoco.vtexassets.com/assets/vtex.file-manager-graphql/images/53a43979-0a5d-43f0-ba2e-37d21c7ee949___c782564e58912cd706779e2aeada4565.svg', href: '/coleccion/carteras' },
  { name: 'Viaje', image: 'https://images.unsplash.com/photo-1552858725-2758b5fb1286?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', href: '/coleccion/viaje' },
  { name: 'Bolsos', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', href: '/coleccion/bolsos' },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
            EXPLORA POR CATEGORÍA
          </h2>
          <Link href="/coleccion" className="hidden md:block font-bold text-[#B5BCE5] hover:underline">
            Ver todo
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} className="group flex flex-col items-center">
              <div className="w-full aspect-square rounded-full overflow-hidden mb-4 border-2 border-gray-100 shadow-sm group-hover:border-[#B5BCE5] group-hover:shadow-md transition-all duration-300 relative">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="font-bold text-gray-800 group-hover:text-[#B5BCE5] transition-colors text-lg">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/coleccion" className="font-bold text-[#B5BCE5] hover:underline">
            Ver todo
          </Link>
        </div>
      </div>
    </section>
  );
}
