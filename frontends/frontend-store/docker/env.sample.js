// Runtime config inyectada por envsubst al arrancar el contenedor
window.env = {
  CATALOG_URL: '${CATALOG_URL}',
  REVIEWS_URL: '${REVIEWS_URL}',
  STORE_URL: '${STORE_URL}'
};