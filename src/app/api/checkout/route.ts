import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer, shippingAddress, note } = body;

    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Faltan credenciales de Shopify (Client ID / Secret)' }, { status: 500 });
    }

    // 1. Obtener token dinámico de Shopify (válido por 1 día)
    const tokenResponse = await fetch(`https://${domain}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      })
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      console.error("Error obteniendo token:", tokenData);
      return NextResponse.json({ error: 'No se pudo autenticar con Shopify Admin API' }, { status: 500 });
    }

    const adminToken = tokenData.access_token;

    // 2. Separar nombre completo en firstName y lastName para Shopify
    const nameParts = (customer.fullName || customer.firstName || '').trim().split(/\s+/);
    const firstName = nameParts[0] || 'Cliente';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Headless';

    // 3. Construir los line items para la orden
    const lineItems = items.map((item: any) => {
      // Necesitamos el ID del variant. Si el ID viene completo de GraphQL, lo extraemos.
      // Ejemplo: "gid://shopify/ProductVariant/44528874651926" -> "44528874651926"
      const variantIdMatch = item.product.variantId?.match(/\d+$/);
      const variantId = variantIdMatch ? parseInt(variantIdMatch[0], 10) : null;

      return {
        variant_id: variantId,
        quantity: item.quantity
      };
    });

    // 2. Crear el payload de la orden para la API REST de Shopify
    const orderPayload = {
      order: {
        line_items: lineItems,
        customer: {
          first_name: firstName,
          last_name: lastName,
        },
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          address1: shippingAddress.address1,
          city: shippingAddress.city,
          province: shippingAddress.province, // Departamento
          country: 'CO',
          phone: customer.phone,
          company: shippingAddress.neighborhood // Guardamos el barrio aquí temporalmente
        },
        billing_address: {
          first_name: firstName,
          last_name: lastName,
          address1: shippingAddress.address1,
          city: shippingAddress.city,
          province: shippingAddress.province,
          country: 'CO',
          phone: customer.phone
        },
        financial_status: "pending",
        payment_gateway_names: ["Pago Contra Entrega"],
        note: note || "",
        tags: "pago-contra-entrega, creado-headless"
      }
    };

    // 3. Hacer la petición a Shopify Admin API
    const response = await fetch(`https://${domain}/admin/api/2024-01/orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify(orderPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error creando orden en Shopify:", data);
      return NextResponse.json({ error: 'Error al crear la orden en Shopify', details: data }, { status: response.status });
    }

    return NextResponse.json({ success: true, orderId: data.order.id });
    
  } catch (error) {
    console.error('Error procesando checkout:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
