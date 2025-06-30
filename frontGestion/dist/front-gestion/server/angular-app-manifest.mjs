
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/home"
  },
  {
    "renderMode": 2,
    "route": "/usuarios"
  },
  {
    "renderMode": 2,
    "route": "/seguros"
  },
  {
    "renderMode": 2,
    "route": "/contratos"
  },
  {
    "renderMode": 2,
    "route": "/clientes"
  },
  {
    "renderMode": 2,
    "route": "/pagos"
  },
  {
    "renderMode": 2,
    "route": "/depositos"
  },
  {
    "renderMode": 2,
    "route": "/reembolsos"
  },
  {
    "renderMode": 2,
    "route": "/reembolsos/crear"
  },
  {
    "renderMode": 2,
    "route": "/reembolsos/pendientes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-W3Q74Q4Z.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "redirectTo": "/reportes/dashboard-reportes",
    "route": "/reportes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-W3Q74Q4Z.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "route": "/reportes/dashboard-reportes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-W3Q74Q4Z.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "route": "/reportes/seguros-impagos"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-W3Q74Q4Z.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "route": "/reportes/contratos-por-cliente"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-W3Q74Q4Z.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "route": "/reportes/reembolsos-pendientes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-W3Q74Q4Z.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "route": "/reportes/contratos-vencidos"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-W3Q74Q4Z.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "route": "/reportes/contratos-por-vencer"
  },
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 28178, hash: 'a6cb03275f11d590d6f5dd71f6b7a15b00d036a8f60038839a5573ef7a7733db', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17245, hash: '7fe33326f36a609be6b62d99d127a9a9993d15e7d549c5472085f0268bab0bad', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'usuarios/index.html': {size: 35925, hash: 'd952c65df1f9c89d1d80f9bb6eba96cfc5b65d89569686d9cd3e034d2469290c', text: () => import('./assets-chunks/usuarios_index_html.mjs').then(m => m.default)},
    'seguros/index.html': {size: 35925, hash: 'd952c65df1f9c89d1d80f9bb6eba96cfc5b65d89569686d9cd3e034d2469290c', text: () => import('./assets-chunks/seguros_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 35925, hash: 'd952c65df1f9c89d1d80f9bb6eba96cfc5b65d89569686d9cd3e034d2469290c', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'contratos/index.html': {size: 35925, hash: 'd952c65df1f9c89d1d80f9bb6eba96cfc5b65d89569686d9cd3e034d2469290c', text: () => import('./assets-chunks/contratos_index_html.mjs').then(m => m.default)},
    'clientes/index.html': {size: 35925, hash: 'd952c65df1f9c89d1d80f9bb6eba96cfc5b65d89569686d9cd3e034d2469290c', text: () => import('./assets-chunks/clientes_index_html.mjs').then(m => m.default)},
    'pagos/index.html': {size: 35925, hash: 'd952c65df1f9c89d1d80f9bb6eba96cfc5b65d89569686d9cd3e034d2469290c', text: () => import('./assets-chunks/pagos_index_html.mjs').then(m => m.default)},
    'depositos/index.html': {size: 35925, hash: 'd952c65df1f9c89d1d80f9bb6eba96cfc5b65d89569686d9cd3e034d2469290c', text: () => import('./assets-chunks/depositos_index_html.mjs').then(m => m.default)},
    'reembolsos/crear/index.html': {size: 35925, hash: 'd952c65df1f9c89d1d80f9bb6eba96cfc5b65d89569686d9cd3e034d2469290c', text: () => import('./assets-chunks/reembolsos_crear_index_html.mjs').then(m => m.default)},
    'reembolsos/index.html': {size: 35925, hash: 'd952c65df1f9c89d1d80f9bb6eba96cfc5b65d89569686d9cd3e034d2469290c', text: () => import('./assets-chunks/reembolsos_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 35925, hash: 'd952c65df1f9c89d1d80f9bb6eba96cfc5b65d89569686d9cd3e034d2469290c', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'reembolsos/pendientes/index.html': {size: 35925, hash: 'd952c65df1f9c89d1d80f9bb6eba96cfc5b65d89569686d9cd3e034d2469290c', text: () => import('./assets-chunks/reembolsos_pendientes_index_html.mjs').then(m => m.default)},
    'reportes/seguros-impagos/index.html': {size: 36082, hash: '51675e6298022767058e82dee0cd59e926f117d533131a75b5518cecc4408314', text: () => import('./assets-chunks/reportes_seguros-impagos_index_html.mjs').then(m => m.default)},
    'reportes/dashboard-reportes/index.html': {size: 36082, hash: '51675e6298022767058e82dee0cd59e926f117d533131a75b5518cecc4408314', text: () => import('./assets-chunks/reportes_dashboard-reportes_index_html.mjs').then(m => m.default)},
    'reportes/contratos-por-cliente/index.html': {size: 36082, hash: '51675e6298022767058e82dee0cd59e926f117d533131a75b5518cecc4408314', text: () => import('./assets-chunks/reportes_contratos-por-cliente_index_html.mjs').then(m => m.default)},
    'reportes/contratos-vencidos/index.html': {size: 36082, hash: '51675e6298022767058e82dee0cd59e926f117d533131a75b5518cecc4408314', text: () => import('./assets-chunks/reportes_contratos-vencidos_index_html.mjs').then(m => m.default)},
    'reportes/contratos-por-vencer/index.html': {size: 36082, hash: '51675e6298022767058e82dee0cd59e926f117d533131a75b5518cecc4408314', text: () => import('./assets-chunks/reportes_contratos-por-vencer_index_html.mjs').then(m => m.default)},
    'reportes/reembolsos-pendientes/index.html': {size: 36082, hash: '51675e6298022767058e82dee0cd59e926f117d533131a75b5518cecc4408314', text: () => import('./assets-chunks/reportes_reembolsos-pendientes_index_html.mjs').then(m => m.default)},
    'styles-KD5DMBN3.css': {size: 323235, hash: 'NO/6mxV21vM', text: () => import('./assets-chunks/styles-KD5DMBN3_css.mjs').then(m => m.default)}
  },
};
