import CheckoutClient from "@/components/CheckoutClient";

export const metadata = {
  title: "Finalizar Compra - Pago Contra Entrega",
  description: "Completa tus datos para el envío a toda Colombia.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-light text-gray-900 tracking-wide">Finalizar Compra</h1>
          <p className="text-gray-500 mt-2">Pago 100% seguro al recibir tu pedido en casa.</p>
        </div>
        <CheckoutClient />
      </div>
    </div>
  );
}
