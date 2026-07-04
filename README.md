# Phoenix Review App v1.4.7

移动端优先的个人复盘 PWA。

## 当前界面保留内容

- 记录：每日复盘 / 随机想法。
- 草稿箱：未完成内容可以继续编辑。
- 日历：按日期查看已经上传到历史库的正式记录。
- 导出：可导出本周、最近 7 天、本月或自定义区间。
- 数据管理：导出 / 导入 JSON 备份，清空本地数据。

## 本版调整

- 不新增额外界面区域，不加入演示页。
- 日历页：前一天 / 后一天同一行，今天为整行大按钮。
- 导出页：本周 / 最近 7 天同一行，本月为整行大按钮。
- 顶部版本说明显示：v1.4.7 · The world is my oyster and I shall claim it with my sword.
- 更新 PWA 缓存版本，避免浏览器继续显示旧界面。

## 部署

把本文件夹第一层的 `index.html`、`app.js`、`style.css`、`manifest.webmanifest`、`sw.js`、`icons/` 上传到 GitHub Pages 仓库根目录。

访问链接建议加版本参数：

```text
https://你的用户名.github.io/phoenix-review-app/?v=1.4.7
```

## 数据说明

当前仍是本地存储版，数据保存在当前浏览器 localStorage。换设备或清缓存前，请先导出 JSON 备份。
