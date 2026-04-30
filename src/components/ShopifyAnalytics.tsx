"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

const SHOP_ID = "77966934116";
const SHOP_DOMAIN = "x9y1qu-dt.myshopify.com";

export default function ShopifyAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Si trekkie ya está cargado, reportamos el cambio de página
    if (window.trekkie && typeof window.trekkie.page === "function") {
      window.trekkie.page();
    }
  }, [pathname, searchParams]);

  return (
    <>
      <Script
        id="shopify-trekkie-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // 1. Configurar objetos globales de Shopify
              window.Shopify = window.Shopify || {};
              window.Shopify.shop = "${SHOP_DOMAIN}";
              window.Shopify.locale = "es";
              window.Shopify.currency = { active: 'COP', rate: '1.0' };
              window.Shopify.theme = { name: "Headless", id: 1, theme_store_id: null, role: "main" };
              
              window.ShopifyAnalytics = window.ShopifyAnalytics || {};
              window.ShopifyAnalytics.meta = window.ShopifyAnalytics.meta || {};
              window.ShopifyAnalytics.meta.page = { pageType: 'home' };
              window.ShopifyAnalytics.merchant_id = "${SHOP_ID}";

              // 2. Inicializar Trekkie
              var trekkie = window.trekkie = window.trekkie || [];
              trekkie.methods = [
                'track', 'identify', 'page', 'ready', 'alias', 'group', 'trackForm', 'trackClick', 'trackLink'
              ];
              trekkie.factory = function(method) {
                return function() {
                  var args = Array.prototype.slice.call(arguments);
                  args.unshift(method);
                  trekkie.push(args);
                  return trekkie;
                };
              };
              for (var i = 0; i < trekkie.methods.length; i++) {
                var key = trekkie.methods[i];
                trekkie[key] = trekkie.factory(key);
              }
              trekkie.load = function(config) {
                trekkie.config = config;
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.async = true;
                script.src = 'https://cdn.shopify.com/s/javascripts/tricorder/trekkie.storefront.min.js';
                var first = document.getElementsByTagName('script')[0];
                first.parentNode.insertBefore(script, first);
              };
              
              trekkie.load({
                "trekkie": {
                  "appName": "storefront",
                  "development": false,
                  "defaultDomain": "${SHOP_DOMAIN}"
                },
                "performance": {
                  "navigationTimingApiMeasurementsEnabled": true,
                  "navigationTimingApiMeasurementsSampleRate": 1
                }
              });

              // Primer reporte de página
              trekkie.page();
            })();
          `,
        }}
      />
    </>
  );
}

declare global {
  interface Window {
    trekkie: any;
    ShopifyAnalytics: any;
  }
}
