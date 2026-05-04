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

    // Asegurar formato de teléfono E.164 (Ej: +57...)
    const rawPhone = (customer.phone || '').toString().trim();
    const formattedPhone = rawPhone.startsWith('+') ? rawPhone : (rawPhone ? `+57${rawPhone}` : undefined);

    // 3. Construir los line items para la orden
    const lineItems = items.map((item: any) => {
      const idStr = item.product.variantId?.toString() || item.product.id?.toString() || '';
      const variantIdMatch = idStr.match(/\d+$/);
      const variantId = variantIdMatch ? parseInt(variantIdMatch[0], 10) : null;

      return {
        variant_id: variantId,
        quantity: item.quantity
      };
    });

    // 4. Crear el payload de la orden para la API REST de Shopify
    const orderPayload: any = {
      order: {
        line_items: lineItems,
        // ✅ Cliente con nombre (aparece en sección "Cliente" de Shopify)
        customer: {
          first_name: firstName,
          last_name: lastName,
          phone: formattedPhone,
        },
        // ✅ Teléfono a nivel de orden
        phone: formattedPhone,
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          address1: shippingAddress.address1,
          address2: shippingAddress.neighborhood || '', // ✅ Barrio en campo correcto
          city: shippingAddress.city,
          province: shippingAddress.province, // Departamento
          country: 'CO',
          phone: formattedPhone,
        },
        billing_address: {
          first_name: firstName,
          last_name: lastName,
          address1: shippingAddress.address1,
          address2: shippingAddress.neighborhood || '',
          city: shippingAddress.city,
          province: shippingAddress.province,
          country: 'CO',
          phone: formattedPhone
        },
        financial_status: "pending",
        payment_gateway_names: ["Pago Contra Entrega"],
        note: note || "",
        tags: "pago-contra-entrega, creado-headless"
      }
    };

    if (customer.email) {
      orderPayload.order.email = customer.email;
    }

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
      let errorMessage = 'Error al crear la orden en Shopify';
      if (data.errors) {
        if (typeof data.errors === 'string') {
          errorMessage = data.errors;
        } else if (typeof data.errors === 'object') {
          errorMessage = JSON.stringify(data.errors);
        }
      }
      return NextResponse.json({ error: errorMessage, details: data }, { status: response.status });
    }

    // 🚀 4. ENVIAR A FACEBOOK CONVERSIONS API (CAPI)
    try {
      const accessToken = process.env.FB_ACCESS_TOKEN;
      const pixelId = '803936628572207'; // Tu ID de Píxel

      if (accessToken) {
        // Función simple para hash SHA256 (Meta lo requiere para privacidad)
        const crypto = require('crypto');
        const hash = (val: string) => crypto.createHash('sha256').update(val.toLowerCase().trim()).digest('hex');

        const fbPayload = {
          data: [{
            event_name: 'Purchase',
            event_time: Math.floor(Date.now() / 1000),
            event_id: body.eventId, // MISMO ID DEL CLIENTE PARA DEDUPLICACIÓN
            action_source: 'website',
            event_source_url: request.url,
              user_data: {
                em: [hash(customer.email || '')],
                ph: [hash(customer.phone || '')],
                fn: [hash(firstName)],
                ln: [hash(lastName)],
                ct: [hash(shippingAddress.city || '')],
                st: [hash(shippingAddress.province || '')],
                zp: [hash(shippingAddress.zip || '')], // ZIP/Código Postal
                country: [hash('co')],
                external_id: [hash(customer.email || 'guest')], // ID Externo (Recomendado)
                client_ip_address: request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1',
                client_user_agent: request.headers.get('user-agent') || '',
                fbp: body.fbp, // Browser ID
                fbc: body.fbc, // Click ID
              },
            custom_data: {
              value: items.reduce((total: number, item: any) => total + (item.product.price * item.quantity), 0),
              currency: 'COP',
              content_type: 'product',
              content_ids: items.map((item: any) => item.product.id),
              num_items: items.reduce((total: number, item: any) => total + item.quantity, 0)
            }
          }]
        };

        await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fbPayload)
        });
      }
    } catch (fbError) {
      console.error("Error enviando a Facebook CAPI:", fbError);
      // No bloqueamos el éxito de la orden si falla Facebook
    }

    return NextResponse.json({ success: true, orderId: data.order.id });
    
  } catch (error) {
    console.error('Error procesando checkout:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
