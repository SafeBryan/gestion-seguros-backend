
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
      "chunk-5EDD4X6S.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "redirectTo": "/reportes/dashboard-reportes",
    "route": "/reportes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-5EDD4X6S.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "route": "/reportes/dashboard-reportes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-5EDD4X6S.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "route": "/reportes/seguros-impagos"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-5EDD4X6S.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "route": "/reportes/contratos-por-cliente"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-5EDD4X6S.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "route": "/reportes/reembolsos-pendientes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-5EDD4X6S.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "route": "/reportes/contratos-vencidos"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-5EDD4X6S.js",
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
    'index.csr.html': {size: 28178, hash: '9a3a10822c25a49a5d330a835d8eddfd1ea7d87a48729e67a972cbfa7ad41fba', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17245, hash: '167b60929ec5d35bd5ee3bc88d25b4401093e6320df387c51985ae21f94e8c3c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 35925, hash: 'efe5d51b87626cc6addd7a7a670cbd027a601452f914f1d807de3834a14f755e', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 35925, hash: 'efe5d51b87626cc6addd7a7a670cbd027a601452f914f1d807de3834a14f755e', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'seguros/index.html': {size: 35925, hash: 'efe5d51b87626cc6addd7a7a670cbd027a601452f914f1d807de3834a14f755e', text: () => import('./assets-chunks/seguros_index_html.mjs').then(m => m.default)},
    'contratos/index.html': {size: 35925, hash: 'efe5d51b87626cc6addd7a7a670cbd027a601452f914f1d807de3834a14f755e', text: () => import('./assets-chunks/contratos_index_html.mjs').then(m => m.default)},
    'clientes/index.html': {size: 35925, hash: 'efe5d51b87626cc6addd7a7a670cbd027a601452f914f1d807de3834a14f755e', text: () => import('./assets-chunks/clientes_index_html.mjs').then(m => m.default)},
    'pagos/index.html': {size: 35925, hash: 'efe5d51b87626cc6addd7a7a670cbd027a601452f914f1d807de3834a14f755e', text: () => import('./assets-chunks/pagos_index_html.mjs').then(m => m.default)},
    'usuarios/index.html': {size: 35925, hash: 'efe5d51b87626cc6addd7a7a670cbd027a601452f914f1d807de3834a14f755e', text: () => import('./assets-chunks/usuarios_index_html.mjs').then(m => m.default)},
    'reembolsos/index.html': {size: 35925, hash: 'efe5d51b87626cc6addd7a7a670cbd027a601452f914f1d807de3834a14f755e', text: () => import('./assets-chunks/reembolsos_index_html.mjs').then(m => m.default)},
    'depositos/index.html': {size: 35925, hash: 'efe5d51b87626cc6addd7a7a670cbd027a601452f914f1d807de3834a14f755e', text: () => import('./assets-chunks/depositos_index_html.mjs').then(m => m.default)},
    'reembolsos/crear/index.html': {size: 35925, hash: 'efe5d51b87626cc6addd7a7a670cbd027a601452f914f1d807de3834a14f755e', text: () => import('./assets-chunks/reembolsos_crear_index_html.mjs').then(m => m.default)},
    'reembolsos/pendientes/index.html': {size: 35925, hash: 'efe5d51b87626cc6addd7a7a670cbd027a601452f914f1d807de3834a14f755e', text: () => import('./assets-chunks/reembolsos_pendientes_index_html.mjs').then(m => m.default)},
    'reportes/contratos-por-cliente/index.html': {size: 36082, hash: 'af16df9facf1e6f602ba6a8a91518f378dff8c3b5d7a532b05957c3178a01826', text: () => import('./assets-chunks/reportes_contratos-por-cliente_index_html.mjs').then(m => m.default)},
    'reportes/dashboard-reportes/index.html': {size: 36082, hash: 'af16df9facf1e6f602ba6a8a91518f378dff8c3b5d7a532b05957c3178a01826', text: () => import('./assets-chunks/reportes_dashboard-reportes_index_html.mjs').then(m => m.default)},
    'reportes/seguros-impagos/index.html': {size: 36082, hash: 'af16df9facf1e6f602ba6a8a91518f378dff8c3b5d7a532b05957c3178a01826', text: () => import('./assets-chunks/reportes_seguros-impagos_index_html.mjs').then(m => m.default)},
    'reportes/reembolsos-pendientes/index.html': {size: 36082, hash: 'af16df9facf1e6f602ba6a8a91518f378dff8c3b5d7a532b05957c3178a01826', text: () => import('./assets-chunks/reportes_reembolsos-pendientes_index_html.mjs').then(m => m.default)},
    'reportes/contratos-por-vencer/index.html': {size: 36082, hash: 'af16df9facf1e6f602ba6a8a91518f378dff8c3b5d7a532b05957c3178a01826', text: () => import('./assets-chunks/reportes_contratos-por-vencer_index_html.mjs').then(m => m.default)},
    'reportes/contratos-vencidos/index.html': {size: 36082, hash: 'af16df9facf1e6f602ba6a8a91518f378dff8c3b5d7a532b05957c3178a01826', text: () => import('./assets-chunks/reportes_contratos-vencidos_index_html.mjs').then(m => m.default)},
    'styles-KD5DMBN3.css': {size: 323235, hash: 'NO/6mxV21vM', text: () => import('./assets-chunks/styles-KD5DMBN3_css.mjs').then(m => m.default)}
  },
};
