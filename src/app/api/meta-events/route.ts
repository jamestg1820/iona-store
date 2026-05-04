import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventName, eventId, url, clientData, customData } = body;

    const accessToken = process.env.FB_ACCESS_TOKEN;
    const pixelId = '803936628572207';

    if (!accessToken) {
      return NextResponse.json({ error: 'No FB Access Token' }, { status: 500 });
    }

    const hash = (val: string) => val ? crypto.createHash('sha256').update(val.toLowerCase().trim()).digest('hex') : null;

    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';

    const fbPayload = {
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: url,
        user_data: {
          client_ip_address: ipAddress,
          client_user_agent: userAgent,
          fbp: clientData?.fbp,
          fbc: clientData?.fbc,
          em: clientData?.email ? [hash(clientData.email)] : undefined,
          ph: clientData?.phone ? [hash(clientData.phone)] : undefined,
          external_id: clientData?.email ? [hash(clientData.email)] : undefined,
        },
        custom_data: customData
      }],
      test_event_code: 'TEST27349'
    };

    const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fbPayload)
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error en Meta Events API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
