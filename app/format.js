// 数字格式化：千分位、万亿换算、百分比。

export function commas(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 亿元 -> 万亿元（保留 1 位小数）
export function yiToWanYi(n) {
  return (n / 10000).toFixed(1);
}

// 万人 -> 亿人（保留 2 位小数）
export function wanToYi(n) {
  return (n / 10000).toFixed(2);
}

// 年份下拉框的选项文字
export function yearLabel(year) {
  return year + ' 年';
}

// 增长率带符号，如 +5.0%
export function signedPct(n) {
  return (n >= 0 ? '+' : '') + n.toFixed(1) + '%';
}
