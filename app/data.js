// 中国国家统计数据（公开已公布数字）
// 口径：除特别注明外，数据来自国家统计局《国民经济和社会发展统计公报》
// 及年度统计年鉴；“约”表示四舍五入后的约数，精确数字以公报原文为准。
// 2024 年为本页最新完整年度；2025 年全年数据尚未公布。

export const META = {
  country: '中国',
  latestYear: 2024,
  years: [2020, 2021, 2022, 2023, 2024],
  updated: '2025 年 2 月公报发布后整理',
  sources: [
    '国家统计局《2024 年国民经济和社会发展统计公报》',
    '国家统计局《中国统计年鉴 2024》',
    '第七次全国人口普查公报（2021 年）',
    '国家统计局各省 2024 年统计公报',
  ],
};

// 年末总人口（万人）与出生、死亡（万人）
export const POPULATION = {
  series: [
    { year: 2020, total: 141178, births: 1200, deaths: 997 },
    { year: 2021, total: 141260, births: 1062, deaths: 1014 },
    { year: 2022, total: 141175, births: 956, deaths: 1041 },
    { year: 2023, total: 140967, births: 902, deaths: 1110 },
    { year: 2024, total: 140828, births: 954, deaths: 1093 },
  ],
  // 2024 年末
  urbanRate2024: 67.0, // 城镇化率 %
  age2020: [
    { label: '0–14 岁', share: 17.95 },
    { label: '15–59 岁', share: 63.35 },
    { label: '60 岁及以上', share: 18.70 },
  ],
  note: '2020 年总人口为第七次人口普查时点数口径；2021–2024 年为年末数。',
};

// GDP（亿元）与增速（%）
export const ECONOMY = {
  series: [
    { year: 2020, gdp: 1013567, growth: 2.2 },
    { year: 2021, gdp: 1149237, growth: 8.6 },
    { year: 2022, gdp: 1210207, growth: 3.0 },
    { year: 2023, gdp: 1260582, growth: 5.2 },
    { year: 2024, gdp: 1349084, growth: 5.0 },
  ],
  // 2024 年三次产业增加值（亿元）
  sectors2024: [
    { label: '第一产业', value: 91414, share: 6.8 },
    { label: '第二产业', value: 492087, share: 36.5 },
    { label: '第三产业', value: 765583, share: 56.7 },
  ],
  perCapita2024: 95749, // 人均 GDP（元）
  note: 'GDP 为现价；增速为不变价。2024 年人均 GDP 约 9.6 万元。',
};

// 就业与物价
export const JOBS_PRICES = {
  unemployment: [
    { year: 2020, rate: 5.6 },
    { year: 2021, rate: 5.1 },
    { year: 2022, rate: 5.6 },
    { year: 2023, rate: 5.2 },
    { year: 2024, rate: 5.1 },
  ],
  cpi: [
    { year: 2020, rate: 2.5 },
    { year: 2021, rate: 0.9 },
    { year: 2022, rate: 2.0 },
    { year: 2023, rate: 0.2 },
    { year: 2024, rate: 0.2 },
  ],
  // 2024 年全国居民人均可支配收入（元）
  income2024: { all: 41314, urban: 54188, rural: 23119, growth: 5.3 },
  note: '失业率为全国城镇调查失业率年均值；CPI 为居民消费价格比上年涨幅；收入增速为名义增速。',
};

// 2024 年部分省份 GDP（亿元，约数）
export const REGIONS = [
  { name: '广东', gdp: 141633, perCapita: 111233 },
  { name: '江苏', gdp: 137008, perCapita: 161110 },
  { name: '山东', gdp: 98566, perCapita: 96379 },
  { name: '浙江', gdp: 90143, perCapita: 135368 },
  { name: '四川', gdp: 64655, perCapita: 77594 },
  { name: '河南', gdp: 63589, perCapita: 64669 },
  { name: '湖北', gdp: 60012, perCapita: 103296 },
  { name: '福建', gdp: 57761, perCapita: 137836 },
  { name: '湖南', gdp: 53231, perCapita: 80682 },
  { name: '安徽', gdp: 50625, perCapita: 82073 },
  { name: '上海', gdp: 53926, perCapita: 217240 },
  { name: '北京', gdp: 49843, perCapita: 227745 },
];

// 指标速查：名称、数值、单位、年份、栏目
export const INDICATORS = [
  { name: '年末总人口', value: '14.08 亿', year: 2024, section: '人口' },
  { name: '出生人口', value: '954 万', year: 2024, section: '人口' },
  { name: '城镇化率', value: '67.0%', year: 2024, section: '人口' },
  { name: '国内生产总值', value: '134.9 万亿元', year: 2024, section: '经济' },
  { name: 'GDP 增速', value: '5.0%', year: 2024, section: '经济' },
  { name: '人均 GDP', value: '约 9.6 万元', year: 2024, section: '经济' },
  { name: '第三产业占比', value: '56.7%', year: 2024, section: '经济' },
  { name: '城镇调查失业率', value: '5.1%', year: 2024, section: '就业与物价' },
  { name: '居民消费价格涨幅', value: '0.2%', year: 2024, section: '就业与物价' },
  { name: '人均可支配收入', value: '41,314 元', year: 2024, section: '就业与物价' },
  { name: '广东 GDP', value: '约 14.2 万亿元', year: 2024, section: '地区' },
  { name: '江苏 GDP', value: '约 13.7 万亿元', year: 2024, section: '地区' },
];
