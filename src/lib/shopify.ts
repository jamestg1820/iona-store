const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch({ query, variables }: { query: string; variables?: any }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      // Usamos revalidación estática (ISR). El sitio guardará en caché la respuesta
      // y la actualizará en segundo plano cada 60 segundos. Esto hace que cargue al instante.
      next: { revalidate: 60 } 
    });

    const body = await result.json();

    if (body.errors) {
      console.error(body.errors[0].message);
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (error) {
    console.error('Error en shopifyFetch:', error);
    return {
      status: 500,
      error: 'Error recibiendo datos'
    };
  }
}

export async function getProducts() {
  const query = `
    query getProducts {
      products(first: 8) {
        edges {
          node {
            id
            title
            handle
            variants(first: 1) {
              edges {
                node {
                  id
                  sku
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
            images(first: 2) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query });
  
  if (response.status !== 200 || !response.body?.data) {
    console.log("No se pudieron cargar productos de Shopify o la tienda está vacía.");
    return [];
  }

  // Transformar la respuesta de Shopify al formato de nuestra interfaz UIProduct
  return response.body.data.products.edges.map(({ node }: any) => {
    const variant = node.variants.edges[0]?.node;
    const price = parseFloat(variant?.price?.amount || "0");
    const compareAtPrice = variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : undefined;
    
    return {
      id: node.id,
      handle: node.handle,
      name: node.title,
      price: price,
      originalPrice: compareAtPrice,
      image: node.images.edges[0]?.node?.url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      secondImage: node.images.edges[1]?.node?.url,
      badge: compareAtPrice && compareAtPrice > price ? 'OFERTA' : undefined,
      variantId: variant?.id
    };
  });
}

export async function getProductByHandle(handle: string) {
  const query = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        descriptionHtml
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              sku
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              image {
                url
              }
            }
          }
        }
        options {
          name
          values
        }
      }
    }
  `;

  const response = await shopifyFetch({ query, variables: { handle } });

  if (response.status !== 200 || !response.body?.data?.product) {
    return null;
  }

  const product = response.body.data.product;
  
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    descriptionHtml: product.descriptionHtml,
    images: product.images.edges.map((edge: any) => ({
      url: edge.node.url,
      altText: edge.node.altText || product.title
    })),
    options: product.options,
    variants: product.variants.edges.map((edge: any) => ({
      id: edge.node.id,
      sku: edge.node.sku,
      title: edge.node.title,
      price: parseFloat(edge.node.price.amount),
      compareAtPrice: edge.node.compareAtPrice ? parseFloat(edge.node.compareAtPrice.amount) : undefined,
      selectedOptions: edge.node.selectedOptions,
      image: edge.node.image
    }))
  };
}

export async function getCollectionProducts(handle: string) {
  const query = `
    query getCollectionProducts($handle: String!) {
      collection(handle: $handle) {
        title
        products(first: 100) {
          edges {
            node {
              id
              title
              handle
              variants(first: 1) {
                edges {
                  node {
                    id
                    sku
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }
              images(first: 2) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query, variables: { handle } });
  
  if (response.status !== 200 || !response.body?.data?.collection) {
    return { title: '', products: [] };
  }

  const collection = response.body.data.collection;

  const products = collection.products.edges.map(({ node }: any) => {
    const variant = node.variants.edges[0]?.node;
    const price = parseFloat(variant?.price?.amount || "0");
    const compareAtPrice = variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : undefined;
    
    return {
      id: node.id,
      handle: node.handle,
      name: node.title,
      price: price,
      originalPrice: compareAtPrice,
      image: node.images.edges[0]?.node?.url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      secondImage: node.images.edges[1]?.node?.url,
      badge: compareAtPrice && compareAtPrice > price ? 'OFERTA' : undefined,
      variantId: variant?.id
    };
  });

  return { title: collection.title, products };
}
