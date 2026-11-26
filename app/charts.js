// Canvas 图表：柱状图、折线图、环形图。纯手写，无外部依赖。
// 所有图表都从 data.js 的数字画，画布按设备像素比缩放以保持清晰。

function setup(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.font = '12px system-ui, sans-serif';
  return { ctx, w, h };
}

function niceMax(values) {
  const m = Math.max.apply(null, values);
  if (m <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(m)));
  return Math.ceil(m / pow) * pow;
}

export function drawBars(canvas, labels, values, opts) {
  const o = opts || {};
  const { ctx, w, h } = setup(canvas);
  const padL = 52, padR = 12, padT = 14, padB = 26;
  const max = niceMax(values);
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const color = o.color || '#c8402a';
  ctx.clearRect(0, 0, w, h);
  // 网格线与刻度
  ctx.strokeStyle = '#e3ddd2';
  ctx.fillStyle = '#6b6455';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const y = padT + (plotH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(w - padR, y);
    ctx.stroke();
    ctx.fillText(o.format ? o.format(max * (4 - i) / 4) : String(Math.round(max * (4 - i) / 4)), padL - 6, y + 4);
  }
  // 柱子
  const slot = plotW / values.length;
  const bw = Math.min(46, slot * 0.58);
  ctx.textAlign = 'center';
  values.forEach((v, i) => {
    const bh = (v / max) * plotH;
    const x = padL + slot * i + (slot - bw) / 2;
    const y = padT + plotH - bh;
    ctx.fillStyle = o.highlight === i ? '#8c2a1a' : color;
    ctx.fillRect(x, y, bw, bh);
    ctx.fillStyle = '#2c2a26';
    ctx.fillText(o.valueLabel ? o.valueLabel(v) : String(v), x + bw / 2, y - 5);
    ctx.fillStyle = '#6b6455';
    ctx.fillText(labels[i], x + bw / 2, h - 8);
  });
}

export function drawLine(canvas, labels, values, opts) {
  const o = opts || {};
  const { ctx, w, h } = setup(canvas);
  const padL = 44, padR = 16, padT = 16, padB = 26;
  const max = niceMax(values);
  const min = Math.min.apply(null, values);
  const lo = Math.min(0, min - (max - min) * 0.15);
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#e3ddd2';
  ctx.fillStyle = '#6b6455';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const y = padT + (plotH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(w - padR, y);
    ctx.stroke();
    const val = lo + (max - lo) * (4 - i) / 4;
    ctx.fillText(o.format ? o.format(val) : val.toFixed(1), padL - 6, y + 4);
  }
  const px = (i) => padL + (plotW * i) / (values.length - 1);
  const py = (v) => padT + plotH - ((v - lo) / (max - lo)) * plotH;
  ctx.beginPath();
  values.forEach((v, i) => { i === 0 ? ctx.moveTo(px(i), py(v)) : ctx.lineTo(px(i), py(v)); });
  ctx.strokeStyle = o.color || '#0f766e';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.textAlign = 'center';
  values.forEach((v, i) => {
    ctx.beginPath();
    ctx.arc(px(i), py(v), 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = o.color || '#0f766e';
    ctx.stroke();
    ctx.fillStyle = '#2c2a26';
    ctx.fillText(o.valueLabel ? o.valueLabel(v) : String(v), px(i), py(v) - 10);
    ctx.fillStyle = '#6b6455';
    ctx.fillText(labels[i], px(i), h - 8);
  });
}

export function drawDonut(canvas, parts, opts) {
  const o = opts || {};
  const { ctx, w, h } = setup(canvas);
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) / 2 - 38;
  const inner = r * 0.58;
  const colors = o.colors || ['#c8402a', '#0f766e', '#d9a441'];
  ctx.clearRect(0, 0, w, h);
  let a0 = -Math.PI / 2;
  parts.forEach((p, i) => {
    const a1 = a0 + (p.share / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a0, a1);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    // 占比标签放在扇形中线外侧
    const mid = (a0 + a1) / 2;
    const lx = cx + Math.cos(mid) * (r + 14);
    const ly = cy + Math.sin(mid) * (r + 14);
    ctx.fillStyle = '#2c2a26';
    ctx.textAlign = lx >= cx ? 'left' : 'right';
    ctx.fillText(p.label + ' ' + p.share.toFixed(2) + '%', lx + (lx >= cx ? 2 : -2), ly + 4);
    a0 = a1;
  });
  // 挖空中心
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = '#fbf9f4';
  ctx.fill();
  ctx.fillStyle = '#2c2a26';
  ctx.textAlign = 'center';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillText(o.centerTop || '', cx, cy - 4);
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = '#6b6455';
  ctx.fillText(o.centerBottom || '', cx, cy + 14);
}
