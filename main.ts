// 中国国情数据站点的提交程序（Node 22，只用标准库）。
// 作用：把本仓库的 app/ 与 screenshots/ 拷到输出目录，
// 再用 kit 附带的 make.fun 库写出 /output/dossier.json（裁判读的摘要）。
// 输出目录默认 /output，本地可用 MAKEFUN_OUTPUT_DIR 覆盖：
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// 上限与裁判的 gate 一致：正文最多 160 KiB；截图最多 4 张、每张最多 256 KiB；
// app/ 最多 993 个文件与目录、共最多 16 MiB。
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
