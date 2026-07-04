# Phoenix Review App v1.4

移动端优先的个人复盘 PWA。

## v1.4 核心逻辑

- **存为草稿**：未完成内容进入草稿箱，下一次可以继续编辑。
- **上传到历史库**：完成后的草稿会成为正式记录，按日期和时间进入日历。
- **日历查询**：选择日期后可查看当天所有正式复盘和随机想法。
- **阶段导出**：可导出本周、最近 7 天、本月或自定义区间的全部复盘和想法，直接发给 ChatGPT 分析。
- **JSON 备份**：可导出/导入完整本地数据。

## 部署

把本文件夹第一层的 `index.html`、`app.js`、`style.css`、`manifest.webmanifest`、`sw.js`、`icons/` 上传到 GitHub Pages 仓库根目录。

访问链接建议加版本参数：

```text
https://你的用户名.github.io/phoenix-review-app/?v=1.4
```

## 数据说明

当前仍是本地存储版，数据保存在当前浏览器 localStorage。换设备或清缓存前，请先导出 JSON 备份。若需要手机和电脑自动同步，下一步需要接 Supabase / Firebase 等云端数据库。
