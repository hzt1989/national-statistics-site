[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/hzt1989/national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/hzt1989/national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

# 中国国情数据 · 国家统计

一个离线可用的中国国家统计网站：总览、人口、经济、就业与物价、地区、数据来源六个栏目，
每个栏目都由顶部导航链接到达；数字全部来自国家统计局已公布的公报与年鉴，每个数字都标明
来源与年份，不确定的写约数。

## 栏目

- **总览**：按年份切换（2020–2024）的关键指标卡片、GDP 与人口走势图、指标速查搜索框。
- **人口**：年末总人口、出生与死亡、城镇化率、年龄结构环形图、出生/死亡对照表。
- **经济**：GDP 走势图（折线/柱状切换、万亿元/亿元单位切换）、三次产业结构环形图与增加值。
- **就业与物价**：城镇调查失业率折线图、CPI 柱状图、居民人均可支配收入。
- **地区**：12 个省份 GDP 表，可按表头排序、可按省名筛选。
- **数据来源**：全部来源清单与口径说明。

## 技术

静态文件，无构建步骤：`app/index.html` 在桌面 Chrome 与手机上都能直接打开，零网络请求。
图表用 Canvas 手写绘制（`app/charts.js`），不引入外部库。文件分工：

- `app/data.js` — 统计数据与来源
- `app/views.js` — hash 路由与各栏目渲染
- `app/charts.js` — Canvas 柱状图、折线图、环形图
- `app/format.js` — 数字格式化
- `app/main.js` — 启动与路由
- `app/style.css`、`app/index.html` — 样式与页面骨架

本地打开：`node serve.ts` 或任意静态服务器指向 `app/`。

## 许可

MIT License，见 [LICENSE](LICENSE)。
