"use client";

import { Star, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

const NAMES = [
  "Camila", "Valentina", "Mariana", "Isabella", "Daniela", 
  "Luz", "Sandra", "Paola", "Carolina", "Diana", 
  "Catalina", "Laura", "Andrea", "Natalia", "Tatiana",
  "Yomaira", "Manu", "Sara", "Susana", "Alejandra"
];

const COMMENTS = [
  "Me encantó, el bolso que me entregaron si es de buena calidad. Recomendados.",
  "Súper práctico y un buen complemento para el outfit. Muy serios.",
  "¡Espectacular! Amo la marca y todos los bolsos que tengo extraordinarios. Este es muy práctico y lindo.",
  "Súper practico, fue muy útil en mi viaje, pude cargar lo que necesitaba. Muy recomendado, si pague al recibir.",
  "Primero quiero comentar que llego súper rápido! Al siguiente día de realizar el pedido llego. Segundo es hermoso súper versátil el color negro combina con todo !! Me encantó !",
  "Muy serios con la entrega. Además, si pague al recibir, lo cual me dio mucha confianza.",
  "¡Súper lindo! Y lo mejor es que no me cobraron el envio. Excelente servicio.",
  "Tenía dudas, pero muy serios, llegó súper rápido y si pague al recibir. Excelente.",
  "Hermoso el diseño. El bolso que me entregaron si es de buena calidad y no me cobraron el envio.",
  "Me llegó perfecto. Muy serios y cumplidos. ¡Gracias!",
  "Excelente experiencia de compra. Pude revisar antes y si pague al recibir."
];

// Generador pseudo-aleatorio basado en un string (para que sea consistente por producto)
function cyrb128(str: string) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

function sfc32(a: number, b: number, c: number, d: number) {
    return function() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
      let t = (a + b | 0) + d | 0;
      d = d + 1 | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = c << 21 | c >>> 11;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
}

export default function ProductReviews({ productHandle }: { productHandle: string }) {
  const [reviews, setReviews] = useState<{name: string, text: string}[]>([]);

  useEffect(() => {
    // Inicializar el RNG con el handle del producto para que las reseñas sean las mismas para este producto siempre
    const seed = cyrb128(productHandle);
    const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

    // Número aleatorio de reseñas entre 1 y 4
    const numReviews = Math.floor(rand() * 4) + 1;
    
    const generatedReviews = [];
    const usedNames = new Set();
    const usedComments = new Set();

    for (let i = 0; i < numReviews; i++) {
      let nameObj, commentObj;
      
      // Seleccionar nombre único
      do {
        nameObj = NAMES[Math.floor(rand() * NAMES.length)];
      } while (usedNames.has(nameObj) && usedNames.size < NAMES.length);
      usedNames.add(nameObj);

      // Seleccionar comentario único
      do {
        commentObj = COMMENTS[Math.floor(rand() * COMMENTS.length)];
      } while (usedComments.has(commentObj) && usedComments.size < COMMENTS.length);
      usedComments.add(commentObj);

      generatedReviews.push({ name: nameObj, text: commentObj });
    }

    setReviews(generatedReviews);
  }, [productHandle]);

  if (reviews.length === 0) return null;

  return (
    <div className="mt-8 mb-4">
      <h3 className="text-lg font-black text-gray-900 tracking-tight mb-4 uppercase">
        Lo que dicen nuestras clientas
      </h3>
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
        {reviews.map((review, idx) => (
          <div 
            key={idx} 
            className="flex-shrink-0 w-[280px] bg-white p-5 rounded-xl border border-gray-100 shadow-sm snap-start flex flex-col"
          >
            <div className="flex text-[#e4d2ef] mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current text-[#e4d2ef]" />
              ))}
            </div>
            <div className="mb-2">
              <span className="font-bold text-gray-900 text-[15px]">{review.name}</span>
              {/* Aproximadamente el 50% de las veces mostramos "Compra verificada" */}
              {(idx % 2 === 0) && (
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <CheckCircle className="w-3.5 h-3.5 mr-1 text-gray-700" />
                  <span className="font-medium text-gray-700">Compra verificada</span>
                </div>
              )}
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed mt-1 flex-grow">
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
