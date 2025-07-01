
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
      "chunk-7RXNU5MB.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "redirectTo": "/reportes/dashboard-reportes",
    "route": "/reportes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-7RXNU5MB.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "route": "/reportes/dashboard-reportes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-7RXNU5MB.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "route": "/reportes/seguros-impagos"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-7RXNU5MB.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "route": "/reportes/contratos-por-cliente"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-7RXNU5MB.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "route": "/reportes/reembolsos-pendientes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-7RXNU5MB.js",
      "chunk-QMQTSFHS.js",
      "chunk-FK6H3RFT.js"
    ],
    "route": "/reportes/contratos-vencidos"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-7RXNU5MB.js",
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
    'index.csr.html': {size: 28178, hash: 'a3cdad565574d67b651ff0e4290753a02d2f2fa7967ce0128ab3ebe835c5ddae', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17245, hash: 'db30fd46bc739f339fea1dff0367b0cab7cd3e76cf54860b3d496bf6682d7af3', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'usuarios/index.html': {size: 35925, hash: '0aa37cbc1ac48b99828e719b898bd3aca5aa7f019bb5e319dc6a6cd2cdccbe9f', text: () => import('./assets-chunks/usuarios_index_html.mjs').then(m => m.default)},
    'seguros/index.html': {size: 35925, hash: '0aa37cbc1ac48b99828e719b898bd3aca5aa7f019bb5e319dc6a6cd2cdccbe9f', text: () => import('./assets-chunks/seguros_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 35925, hash: '0aa37cbc1ac48b99828e719b898bd3aca5aa7f019bb5e319dc6a6cd2cdccbe9f', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 35925, hash: '0aa37cbc1ac48b99828e719b898bd3aca5aa7f019bb5e319dc6a6cd2cdccbe9f', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'contratos/index.html': {size: 35925, hash: '0aa37cbc1ac48b99828e719b898bd3aca5aa7f019bb5e319dc6a6cd2cdccbe9f', text: () => import('./assets-chunks/contratos_index_html.mjs').then(m => m.default)},
    'pagos/index.html': {size: 35925, hash: '0aa37cbc1ac48b99828e719b898bd3aca5aa7f019bb5e319dc6a6cd2cdccbe9f', text: () => import('./assets-chunks/pagos_index_html.mjs').then(m => m.default)},
    'depositos/index.html': {size: 35925, hash: '0aa37cbc1ac48b99828e719b898bd3aca5aa7f019bb5e319dc6a6cd2cdccbe9f', text: () => import('./assets-chunks/depositos_index_html.mjs').then(m => m.default)},
    'clientes/index.html': {size: 35925, hash: '0aa37cbc1ac48b99828e719b898bd3aca5aa7f019bb5e319dc6a6cd2cdccbe9f', text: () => import('./assets-chunks/clientes_index_html.mjs').then(m => m.default)},
    'reembolsos/crear/index.html': {size: 35925, hash: '0aa37cbc1ac48b99828e719b898bd3aca5aa7f019bb5e319dc6a6cd2cdccbe9f', text: () => import('./assets-chunks/reembolsos_crear_index_html.mjs').then(m => m.default)},
    'reembolsos/index.html': {size: 35925, hash: '0aa37cbc1ac48b99828e719b898bd3aca5aa7f019bb5e319dc6a6cd2cdccbe9f', text: () => import('./assets-chunks/reembolsos_index_html.mjs').then(m => m.default)},
    'reembolsos/pendientes/index.html': {size: 35925, hash: '0aa37cbc1ac48b99828e719b898bd3aca5aa7f019bb5e319dc6a6cd2cdccbe9f', text: () => import('./assets-chunks/reembolsos_pendientes_index_html.mjs').then(m => m.default)},
    'reportes/contratos-por-cliente/index.html': {size: 36082, hash: 'c65d5d448ff00719400df0e25efa13c08f7e98338a9bb6d50436865266e984d3', text: () => import('./assets-chunks/reportes_contratos-por-cliente_index_html.mjs').then(m => m.default)},
    'reportes/dashboard-reportes/index.html': {size: 36082, hash: 'c65d5d448ff00719400df0e25efa13c08f7e98338a9bb6d50436865266e984d3', text: () => import('./assets-chunks/reportes_dashboard-reportes_index_html.mjs').then(m => m.default)},
    'reportes/reembolsos-pendientes/index.html': {size: 36082, hash: 'c65d5d448ff00719400df0e25efa13c08f7e98338a9bb6d50436865266e984d3', text: () => import('./assets-chunks/reportes_reembolsos-pendientes_index_html.mjs').then(m => m.default)},
    'reportes/contratos-por-vencer/index.html': {size: 36082, hash: 'c65d5d448ff00719400df0e25efa13c08f7e98338a9bb6d50436865266e984d3', text: () => import('./assets-chunks/reportes_contratos-por-vencer_index_html.mjs').then(m => m.default)},
    'reportes/contratos-vencidos/index.html': {size: 36082, hash: 'c65d5d448ff00719400df0e25efa13c08f7e98338a9bb6d50436865266e984d3', text: () => import('./assets-chunks/reportes_contratos-vencidos_index_html.mjs').then(m => m.default)},
    'reportes/seguros-impagos/index.html': {size: 36082, hash: 'c65d5d448ff00719400df0e25efa13c08f7e98338a9bb6d50436865266e984d3', text: () => import('./assets-chunks/reportes_seguros-impagos_index_html.mjs').then(m => m.default)},
    'styles-KD5DMBN3.css': {size: 323235, hash: 'NO/6mxV21vM', text: () => import('./assets-chunks/styles-KD5DMBN3_css.mjs').then(m => m.default)}
  },
};
