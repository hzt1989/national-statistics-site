// 栏目渲染：hash 路由（#/overview、#/population、#/economy、#/jobs、#/regions、#/sources）。
// 每个栏目由链接到达；图表在渲染后画在 canvas 上；控件都在本文件里接线。

import { META, POPULATION, ECONOMY, JOBS_PRICES, REGIONS, INDICATORS } from './data.js';
import { drawBars, drawLine, drawDonut } from './charts.js';
import { commas, yiToWanYi, wanToYi, signedPct } from './format.js';

const ROUTES = [
  { hash: '#/overview', label: '总览' },
  { hash: '#/population', label: '人口' },
  { hash: '#/economy', label: '经济' },
  { hash: '#/jobs', label: '就业与物价' },
  { hash: '#/regions', label: '地区' },
  { hash: '#/sources', label: '数据来源' },
];

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function kpi(label, value, sub) {
  return '<div class="kpi"><div class="kpi-label">' + esc(label) + '</div>'
    + '<div class="kpi-value">' + esc(value) + '</div>'
    + '<div class="kpi-sub">' + esc(sub) + '</div></div>';
}

function sectionHead(title, note) {
  return '<h2>' + esc(title) + '</h2><p class="note">' + esc(note) + '</p>';
}

function findYear(series, year) {
  for (const row of series) if (row.year === year) return row;
  return series[series.length - 1];
}

// ---- 总览 ----
function viewOverview() {
  const years = META.years.map((y) => '<option value="' + y + '"' + (y === META.latestYear ? ' selected' : '') + '>' + y + ' 年</option>').join('');
  return sectionHead('中国 · 国家统计总览', '最新完整年度为 2024 年；以下数字均来自国家统计局已公布的公报与年鉴。')
    + '<div class="toolbar"><label for="yearSel">查看年份</label>'
    + '<select id="yearSel">' + years + '</select>'
    + '<span class="hint">切换年份，下方关键指标与图表同步更新。</span></div>'
    + '<div id="kpiRow" class="kpi-row"></div>'
    + '<div class="grid2"><div class="card"><h3>国内生产总值（万亿元）</h3>'
    + '<canvas id="chartGdp" class="chart" width="560" height="260"></canvas>'
    + '<p class="note">现价 GDP；2020–2024 年。</p></div>'
    + '<div class="card"><h3>年末总人口（亿人）</h3>'
    + '<canvas id="chartPop" class="chart" width="560" height="260"></canvas>'
    + '<p class="note">2020 年为普查时点口径，其余为年末数。</p></div></div>'
    + '<div class="card"><h3>指标速查</h3>'
    + '<input id="findBox" type="search" placeholder="输入关键词，如 GDP、人口、失业率…" aria-label="搜索指标">'
    + '<ul id="findList" class="find-list"></ul></div>';
}

function paintOverview() {
  const sel = document.getElementById('yearSel');
  const year = Number(sel.value);
  const pop = findYear(POPULATION.series, year);
  const eco = findYear(ECONOMY.series, year);
  const un = findYear(JOBS_PRICES.unemployment, year);
  const cpi = findYear(JOBS_PRICES.cpi, year);
  document.getElementById('kpiRow').innerHTML =
    kpi('年末总人口', wanToYi(pop.total) + ' 亿', year + ' 年末 · 出生 ' + pop.births + ' 万人')
    + kpi('国内生产总值', yiToWanYi(eco.gdp) + ' 万亿元', '同比增长 ' + signedPct(eco.growth))
    + kpi('城镇调查失业率', un.rate.toFixed(1) + '%', '年均值')
    + kpi('居民消费价格涨幅', signedPct(cpi.rate), '比上年');
  drawBars(document.getElementById('chartGdp'),
    ECONOMY.series.map((r) => String(r.year)),
    ECONOMY.series.map((r) => r.gdp / 10000),
    { color: '#c8402a', highlight: ECONOMY.series.findIndex((r) => r.year === year),
      format: (v) => v.toFixed(0), valueLabel: (v) => v.toFixed(1) });
  drawLine(document.getElementById('chartPop'),
    POPULATION.series.map((r) => String(r.year)),
    POPULATION.series.map((r) => r.total / 10000),
    { color: '#0f766e', format: (v) => v.toFixed(1), valueLabel: (v) => v.toFixed(2) });
  const box = document.getElementById('findBox');
  const list = document.getElementById('findList');
  const paintList = () => {
    const q = box.value.trim();
    const hits = INDICATORS.filter((d) => !q || d.name.includes(q) || d.section.includes(q));
    list.innerHTML = hits.length
      ? hits.map((d) => '<li><span class="find-name">' + esc(d.name) + '</span>'
        + '<span class="find-val">' + esc(d.value) + '</span>'
        + '<span class="find-meta">' + d.year + ' 年 · ' + esc(d.section) + '</span></li>').join('')
      : '<li class="empty">没有匹配的指标，换个关键词试试。</li>';
  };
  box.addEventListener('input', paintList);
  paintList();
  sel.addEventListener('change', paintOverview);
}

// ---- 人口 ----
function viewPopulation() {
  const last = POPULATION.series[POPULATION.series.length - 1];
  const change = last.births - last.deaths;
  return sectionHead('人口', '2024 年末总人口 14.08 亿，比上年末减少 139 万人；人口自然增长率为负。')
    + '<div class="kpi-row">'
    + kpi('年末总人口', '14.08 亿', '2024 年末')
    + kpi('出生人口', '954 万', '2024 年 · 出生率 6.77‰')
    + kpi('死亡人口', '1,093 万', '2024 年 · 自然减少 ' + Math.abs(change) + ' 万人')
    + kpi('城镇化率', '67.0%', '2024 年末常住人口城镇化率')
    + '</div>'
    + '<div class="grid2"><div class="card"><h3>年末总人口（亿人，2020–2024）</h3>'
    + '<canvas id="chartPopTotal" class="chart" width="560" height="260"></canvas></div>'
    + '<div class="card"><h3>年龄结构（第七次人口普查，2020 年）</h3>'
    + '<canvas id="chartAge" class="chart" width="560" height="260"></canvas>'
    + '<p class="note">60 岁及以上占 18.70%，65 岁及以上占 13.50%。</p></div></div>'
    + '<div class="card"><h3>出生与死亡（万人）</h3>'
    + '<canvas id="chartBirthDeath" class="chart" width="560" height="240"></canvas>'
    + '<p class="note">' + esc(POPULATION.note) + '</p></div>';
}

function paintPopulation() {
  drawBars(document.getElementById('chartPopTotal'),
    POPULATION.series.map((r) => String(r.year)),
    POPULATION.series.map((r) => r.total / 10000),
    { color: '#0f766e', format: (v) => v.toFixed(1), valueLabel: (v) => v.toFixed(2) });
  drawDonut(document.getElementById('chartAge'), POPULATION.age2020,
    { centerTop: '2020 年', centerBottom: '普查口径' });
  const c = document.getElementById('chartBirthDeath');
  drawBars(c,
    POPULATION.series.map((r) => String(r.year)),
    POPULATION.series.map((r) => r.births),
    { color: '#c8402a', format: (v) => String(Math.round(v)), valueLabel: (v) => String(v) });
  // 死亡人数画成第二组折线需要另一张图，这里用文字补齐：
  const rows = POPULATION.series.map((r) => '<tr><td>' + r.year + '</td><td>' + commas(r.births)
    + '</td><td>' + commas(r.deaths) + '</td><td>' + (r.births - r.deaths >= 0 ? '+' : '')
    + commas(r.births - r.deaths) + '</td></tr>').join('');
  c.insertAdjacentHTML('afterend',
    '<table class="data-table"><thead><tr><th>年份</th><th>出生（万人）</th><th>死亡（万人）</th><th>自然增长（万人）</th></tr></thead>'
    + '<tbody>' + rows + '</tbody></table>');
}

// ---- 经济 ----
let ecoChartKind = 'line';
let ecoUnit = 'wanyi';

function viewEconomy() {
  return sectionHead('经济', '2024 年国内生产总值 134.9 万亿元，比上年增长 5.0%。')
    + '<div class="kpi-row">'
    + kpi('国内生产总值', '134.9 万亿元', '2024 年 · 现价')
    + kpi('GDP 增速', '+5.0%', '2024 年 · 不变价')
    + kpi('人均 GDP', '约 9.6 万元', '2024 年 · 约 13,400 美元')
    + kpi('第三产业占比', '56.7%', '2024 年')
    + '</div>'
    + '<div class="card"><h3>国内生产总值走势（2020–2024）</h3>'
    + '<div class="toolbar"><span>图表：</span>'
    + '<button id="ecoLine" class="seg on" type="button">折线</button>'
    + '<button id="ecoBar" class="seg" type="button">柱状</button>'
    + '<span class="sep"></span><span>单位：</span>'
    + '<button id="ecoWanYi" class="seg on" type="button">万亿元</button>'
    + '<button id="ecoYi" class="seg" type="button">亿元</button></div>'
    + '<canvas id="chartEco" class="chart" width="560" height="280"></canvas>'
    + '<p class="note">增速为不变价；2021 年增速 8.6% 含有 2020 年低基数因素。</p></div>'
    + '<div class="grid2"><div class="card"><h3>三次产业结构（2024 年）</h3>'
    + '<canvas id="chartSector" class="chart" width="560" height="260"></canvas></div>'
    + '<div class="card"><h3>三次产业增加值（2024 年）</h3><ul class="stat-list">'
    + ECONOMY.sectors2024.map((s) => '<li><span>' + esc(s.label) + '</span><b>'
      + commas(s.value) + ' 亿元 · ' + s.share.toFixed(1) + '%</b></li>').join('')
    + '</ul><p class="note">' + esc(ECONOMY.note) + '</p></div></div>';
}

function paintEconomy() {
  const labels = ECONOMY.series.map((r) => String(r.year));
  const values = ECONOMY.series.map((r) => ecoUnit === 'wanyi' ? r.gdp / 10000 : r.gdp);
  const fmt = ecoUnit === 'wanyi' ? (v) => v.toFixed(0) : (v) => commas(Math.round(v));
  const vlab = ecoUnit === 'wanyi' ? (v) => v.toFixed(1) : (v) => commas(Math.round(v));
  const canvas = document.getElementById('chartEco');
  if (ecoChartKind === 'line') {
    drawLine(canvas, labels, values, { color: '#c8402a', format: fmt, valueLabel: vlab });
  } else {
    drawBars(canvas, labels, values, { color: '#c8402a', format: fmt, valueLabel: vlab });
  }
  drawDonut(document.getElementById('chartSector'), ECONOMY.sectors2024,
    { centerTop: '2024 年', centerBottom: '产业结构' });
  const seg = (id, on, fn) => {
    const el = document.getElementById(id);
    el.classList.toggle('on', on);
    el.onclick = fn;
  };
  seg('ecoLine', ecoChartKind === 'line', () => { ecoChartKind = 'line'; paintEconomy(); });
  seg('ecoBar', ecoChartKind === 'bar', () => { ecoChartKind = 'bar'; paintEconomy(); });
  seg('ecoWanYi', ecoUnit === 'wanyi', () => { ecoUnit = 'wanyi'; paintEconomy(); });
  seg('ecoYi', ecoUnit === 'yi', () => { ecoUnit = 'yi'; paintEconomy(); });
}

// ---- 就业与物价 ----
function viewJobs() {
  const inc = JOBS_PRICES.income2024;
  return sectionHead('就业与物价', '2024 年全国城镇调查失业率年均 5.1%；居民消费价格比上年上涨 0.2%。')
    + '<div class="kpi-row">'
    + kpi('城镇调查失业率', '5.1%', '2024 年均值')
    + kpi('居民消费价格涨幅', '+0.2%', '2024 年比上年')
    + kpi('人均可支配收入', '41,314 元', '2024 年 · 名义增长 5.3%')
    + kpi('城镇人均可支配收入', '54,188 元', '2024 年')
    + '</div>'
    + '<div class="grid2"><div class="card"><h3>城镇调查失业率（%，2020–2024）</h3>'
    + '<canvas id="chartUnemp" class="chart" width="560" height="260"></canvas>'
    + '<p class="note">年均值；31 个大城市城镇调查失业率 2024 年均 5.1%。</p></div>'
    + '<div class="card"><h3>居民消费价格涨幅（%，2020–2024）</h3>'
    + '<canvas id="chartCpi" class="chart" width="560" height="260"></canvas>'
    + '<p class="note">CPI 比上年涨幅；2023、2024 年均为 0.2%。</p></div></div>'
    + '<div class="card"><h3>居民收入（2024 年）</h3><ul class="stat-list">'
    + '<li><span>全国居民人均可支配收入</span><b>' + commas(inc.all) + ' 元</b></li>'
    + '<li><span>城镇居民人均可支配收入</span><b>' + commas(inc.urban) + ' 元</b></li>'
    + '<li><span>农村居民人均可支配收入</span><b>' + commas(inc.rural) + ' 元</b></li>'
    + '</ul><p class="note">' + esc(JOBS_PRICES.note) + '</p></div>';
}

function paintJobs() {
  drawLine(document.getElementById('chartUnemp'),
    JOBS_PRICES.unemployment.map((r) => String(r.year)),
    JOBS_PRICES.unemployment.map((r) => r.rate),
    { color: '#0f766e', format: (v) => v.toFixed(1), valueLabel: (v) => v.toFixed(1) + '%' });
  drawBars(document.getElementById('chartCpi'),
    JOBS_PRICES.cpi.map((r) => String(r.year)),
    JOBS_PRICES.cpi.map((r) => r.rate),
    { color: '#d9a441', format: (v) => v.toFixed(1), valueLabel: (v) => v.toFixed(1) + '%' });
}

// ---- 地区 ----
let regionSortKey = 'gdp';
let regionSortDir = -1;

function viewRegions() {
  return sectionHead('地区', '2024 年各省（自治区、直辖市）地区生产总值。点击表头可按该列排序。')
    + '<div class="toolbar"><label for="regionBox">筛选省份</label>'
    + '<input id="regionBox" type="search" placeholder="输入省名，如 广东、浙江…" aria-label="筛选省份">'
    + '<span class="hint">共 ' + REGIONS.length + ' 个省份示例，按 GDP 降序排列。</span></div>'
    + '<div class="card"><table class="data-table" id="regionTable">'
    + '<thead><tr><th data-key="name">省份</th><th data-key="gdp">GDP（亿元）</th>'
    + '<th data-key="perCapita">人均 GDP（元）</th></tr></thead><tbody id="regionBody"></tbody></table>'
    + '<p class="note">人均 GDP 为约数口径（GDP 除以常住人口估算）；省份 GDP 以各省统计公报为准。</p></div>';
}

function paintRegions() {
  const box = document.getElementById('regionBox');
  const body = document.getElementById('regionBody');
  const draw = () => {
    const q = box.value.trim();
    const rows = REGIONS.filter((r) => !q || r.name.includes(q))
      .slice()
      .sort((a, b) => {
        const av = a[regionSortKey], bv = b[regionSortKey];
        if (typeof av === 'string') return regionSortDir * av.localeCompare(bv, 'zh');
        return regionSortDir * (av - bv);
      });
    body.innerHTML = rows.length
      ? rows.map((r) => '<tr><td>' + esc(r.name) + '</td><td>' + commas(r.gdp)
        + '</td><td>' + commas(r.perCapita) + '</td></tr>').join('')
      : '<tr><td colspan="3" class="empty">没有匹配的省份。</td></tr>';
    document.querySelectorAll('#regionTable th').forEach((th) => {
      th.classList.toggle('sorted', th.dataset.key === regionSortKey);
      th.textContent = th.textContent.replace(/ [▲▼]$/, '')
        + (th.dataset.key === regionSortKey ? (regionSortDir === -1 ? ' ▼' : ' ▲') : '');
    });
  };
  box.addEventListener('input', draw);
  document.querySelectorAll('#regionTable th').forEach((th) => {
    th.addEventListener('click', () => {
      if (regionSortKey === th.dataset.key) regionSortDir = -regionSortDir;
      else { regionSortKey = th.dataset.key; regionSortDir = th.dataset.key === 'name' ? 1 : -1; }
      draw();
    });
  });
  draw();
}

// ---- 数据来源 ----
function viewSources() {
  return sectionHead('数据来源与口径', '本页所有数字均来自公开渠道；不确定的数字写为约数。')
    + '<div class="card"><h3>来源</h3><ol class="source-list">'
    + META.sources.map((s) => '<li>' + esc(s) + '</li>').join('')
    + '</ol><h3>口径说明</h3><ul class="stat-list">'
    + '<li><span>年份</span><b>除特别注明外均为 2024 年</b></li>'
    + '<li><span>人口</span><b>年末常住人口；2020 年为普查时点数</b></li>'
    + '<li><span>GDP</span><b>现价；增速为不变价</b></li>'
    + '<li><span>失业率</span><b>全国城镇调查失业率年均值</b></li>'
    + '<li><span>省份 GDP</span><b>各省统计公报；人均值为约数</b></li>'
    + '</ul><p class="note">2025 年全年数据尚未公布，本页暂不收录。如发现数字有误，请以国家统计局公布的原文为准。</p></div>';
}

const VIEWS = {
  overview: { html: viewOverview, paint: paintOverview },
  population: { html: viewPopulation, paint: paintPopulation },
  economy: { html: viewEconomy, paint: paintEconomy },
  jobs: { html: viewJobs, paint: paintJobs },
  regions: { html: viewRegions, paint: paintRegions },
  sources: { html: viewSources, paint: null },
};

export function navHtml(current) {
  return ROUTES.map((r) => '<a href="' + r.hash + '"' + (r.hash.slice(2) === current ? ' class="on" aria-current="page"' : '') + '>'
    + esc(r.label) + '</a>').join('');
}

export function render(route) {
  const key = VIEWS[route] ? route : 'overview';
  const host = document.getElementById('view');
  host.innerHTML = VIEWS[key].html();
  document.getElementById('nav').innerHTML = navHtml(key);
  if (VIEWS[key].paint) VIEWS[key].paint();
  window.scrollTo(0, 0);
}
