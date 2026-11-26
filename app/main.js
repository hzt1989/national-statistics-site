// 启动：解析 hash 路由并渲染；hash 变化时重新渲染。

import { render } from './views.js';

function route() {
  const h = window.location.hash || '#/overview';
  return h.replace(/^#\//, '').split('/')[0];
}

window.addEventListener('hashchange', () => render(route()));
render(route());
