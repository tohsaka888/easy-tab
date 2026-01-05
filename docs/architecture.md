# Easy-Tab 画布式标签页 - 架构与设计文档

> 目标：实现一个基于响应式网格（m × n 正方体）的模块化画布，具备拖拽、缩放、编辑、动态重排的优秀体验，交互对标 Google 新标签页 + Notion + iOS 桌面编辑模式。

## 1. 范围与阶段

**MVP（当前阶段）**
- 纯前端实现，数据使用 mock（可本地持久化）。
- 画布网格、模块拖拽/缩放/重排、编辑模式与新增 Drawer。
- 首批内置组件：搜索组件、快捷访问组件。

**后续扩展**
- 插件体系对外开放（第三方模块）。
- 多端同步、云端持久化与权限。

## 2. 核心概念与术语

- **Grid**：可视区域被分割成等大小正方体单元。
- **Cell**：单个网格单元。
- **Module**：画布上的组件实例，占用整数个 Cell。
- **Layout**：模块的几何信息（x, y, w, h，单位为 Cell）。
- **Edit Mode**：编辑模式，支持拖拽/缩放/删除/新增。

## 3. 总体架构

```
web (Next.js + React)
├─ app/               # 路由与页面
├─ components/        # 画布、模块、通用 UI
├─ modules/           # 内置模块实现（搜索、快捷访问等）
├─ store/             # 状态管理（布局、编辑状态、配置）
├─ lib/               # 纯函数布局引擎、工具函数
├─ mocks/             # Mock API 与数据
└─ docs/              # 架构与设计文档
```

**关键模块**
- **Grid Engine**：计算网格与布局，碰撞检测与重排。
- **Canvas Renderer**：负责渲染背景网格与模块容器。
- **Module Registry**：插件化注册与渲染。
- **State Store**：全局状态与操作。

## 4. 技术选型与库建议

### 4.1 基础栈

- **Next.js + React + TypeScript**：页面架构与组件化开发。
- **Tailwind CSS**：快速搭建 UI 与网格辅助线样式。
- **ESLint**：基础质量控制。

### 4.2 核心功能与库映射（推荐优先）

| 功能 | 推荐库/方案 | 备注 |
| --- | --- | --- |
| 拖拽 | `@dnd-kit/core` + 自研拖拽层 | 细粒度控制拖拽行为与交互状态 |
| 缩放 | 自研 Resize Handles（pointer events） | 与网格单位耦合，便于整数倍限制 |
| 动态重排 | 自研布局引擎 | 适配 iOS 桌面式重排规则 |
| 模块注册 | 自研 Registry | 便于插件化扩展 |
| 状态管理 | `zustand` | 轻量、易组合 |
| JSON Schema | `ajv` 或 `zod` | 配置校验与持久化扩展 |
| Mock API | `msw` | 搜索建议、favicon 等接口模拟 |
| 下拉定位 | `@floating-ui/react` | 搜索建议弹层定位 |
| 本地持久化 |  `idb-keyval`

### 4.3 可选方案（权衡）

- **`react-grid-layout`**：内置网格/重排/缩放，最快落地，但自定义交互与动画可控性较弱。
- **`react-rnd`**：拖拽 + 缩放合一，简单但难以实现复杂碰撞与占位逻辑。
- **`interactjs`**：强大底层手势库，适合完全自研拖拽/缩放层。

### 4.4 交互与动画

- 编辑模式“晃动”使用 CSS keyframes（性能稳定，易控）。
- 复杂过渡可选 `framer-motion` / `react-spring`，但建议优先 CSS。

## 5. 网格与布局系统（核心）

### 5.1 网格计算

**输入**：viewport 宽高（px）、最小格子尺寸 `minCell`、页面内边距 `padding`。

**输出**：列数 `cols`、行数 `rows`、真实格子边长 `cellSize`。

建议算法：
1. 预估列数 `cols = floor((vw - 2*padding) / minCell)`。
2. 预估行数 `rows = floor((vh - 2*padding) / minCell)`。
3. 计算 `cellSize = min((vw - 2*padding) / cols, (vh - 2*padding) / rows)`。
4. `cellSize` 向下取整，避免小数引起渲染抖动。

**约束**
- 禁止横向滚动条：当模块宽度超出当前列数，自动换行。
- 页面尺寸变化时重新计算网格，并对已有布局做“最近合法位置”吸附。
- **画布尺寸**：画布高度与宽度必须为 Cell 整数倍（以 `cellSize` 为基准）。高度应支持动态调整（例如根据当前布局与最小可视范围扩展），宽度优先使用更大的可视容器（上限可配置）。

### 5.2 坐标系统

- 左上角为 (0, 0)。
- 模块 `layout = { x, y, w, h }`，单位为 Cell。
- 渲染时转换为像素：
  - `left = padding + x * cellSize`
  - `top = padding + y * cellSize`
  - `width = w * cellSize`
  - `height = h * cellSize`

### 5.3 尺寸约束

每个模块包含：
- `minW/minH`：最小占用格子数
- `maxW/maxH`：最大占用格子数

当拖拽或缩放超过限制：
- 背景高亮红色
- 拒绝应用尺寸变更

### 5.4 组件间距与画布边距

- 组件间距以 `cellSize` 的整数倍体现（推荐 0.125~0.2 倍的 Cell 作为视觉间距）。
- 画布四周安全内边距应为 Cell 的整数倍（桌面 48px 约等于 0.5 Cell；移动端 24px 约等于 0.3 Cell），保证模块不贴边。

## 6. 拖拽与动态重排（重点）

### 6.1 拖拽/缩放交互

- 拖动模块：半透明 + 预占位轮廓（ghost）。
- 缩放模块：四角拖拽手柄；手柄大小与触控适配。

**事件模型**
- pointerdown → 记录起始布局 + pointerId
- pointermove → 计算候选布局 + 碰撞检测
- pointerup → 结算布局

**拖拽对齐**
- 拖拽位移必须按 Cell 对齐（`delta = round(pixelDelta / cellSize)`）。
- 结束拖拽后再做一次合法位置吸附，确保最终位置为整格。

### 6.2 重排策略（智能布局）

当模块移动/缩放与其他模块重叠：
1. 触发 **collision detection**。
2. 按规则移动被覆盖模块（优先向下，其次向右），形成 **Push Down** 流。
3. 直到无重叠或达到最大行数。

推荐策略：
- **Push Down**：类似 iOS 桌面。
- **Compaction**：空洞回填，保证整体紧凑。

**期望行为（MVP+）**
- 拖动模块 A 覆盖模块 B 时，B 自动向后移动（按 `y` 方向优先，必要时右移）以让位。
- 拖拽过程中显示候选占位区域（Ghost）与潜在落点，用于提示自动重排后的结果。

### 6.3 布局算法（纯函数）

建议将以下逻辑放入 `lib/layout-engine.ts`：
- `detectCollision(layout, layouts)`
- `findNearestSpot(layout, layouts)`
- `reflow(layouts)`
- `compact(layouts)`

**新增/补充建议**
- `pushDown(layouts, targetId)`：将被覆盖模块依次向下/向右移动。
- `getDragPreview(layout, layouts)`：输出拖拽中的候选落点集合（用于高亮 Cell）。

## 7. 编辑模式（全局）

### 7.1 编辑模式入口

- 右上角统一「编辑」按钮。
- 切换后：
  - 所有模块进入“晃动”动画。
  - 显示删除按钮（右上角红色叉）。

### 7.2 编辑模式 UI

- Hover 显示虚线边框。
- 角落展示 Resize Handle。
- 非法区域高亮红色，提示不可放置。
- 拖拽时可在画布上高亮潜在落点 Cell（颜色变化提示）。

## 8. 组件新增机制

### 8.1 入口

- 全局新增按钮（+）。
- 右侧 Drawer 展示组件卡片。

### 8.2 新增流程

- Drawer 中模块可拖拽至画布。
- 放手时根据指针位置计算最近合法 Cell。
- 创建模块实例并进入编辑状态。

## 9. 插件体系设计（可扩展性）

### 9.1 模块注册协议

```ts
export type ModuleDefinition = {
  type: string
  name: string
  icon?: string
  defaultLayout: { w: number; h: number }
  minW: number
  minH: number
  maxW: number
  maxH: number
  schema: JSONSchema
  render: (props: ModuleProps) => JSX.Element
}
```

### 9.2 Registry

- `moduleRegistry.register(definition)`
- `moduleRegistry.get(type)`

### 9.3 数据与配置

模块实例：
```json
{
  "id": "mod_123",
  "type": "search",
  "layout": { "x": 0, "y": 0, "w": 4, "h": 2 },
  "config": { "engine": "google" }
}
```

## 10. 内置组件设计（首批）

### 10.1 搜索组件

- UI 类似 Google 新标签页搜索框。
- 功能：
  - 多搜索引擎切换（Google/Bing/自定义）。
  - 输入联想下拉（mock API）。
- 交互：
  - 编辑模式下可拖拽/缩放/删除。

### 10.2 快捷访问组件

- 添加网址：
  - mock API 获取 favicon + 标题。
- 展示为图标 + 名称。
- 支持编辑/删除/拖拽/缩放。

## 11. 状态管理与数据层

### 11.1 全局状态

建议采用轻量状态库（如 Zustand），核心状态包括：
- `editMode: boolean`
- `modules: ModuleInstance[]`
- `layout: Layout[]`
- `activeDragId: string | null`
- `drawerOpen: boolean`

### 11.2 JSON Schema

使用 JSON Schema 描述模块 config，便于验证与后续持久化。

## 12. 性能与体验

- 拖拽/缩放采用 `requestAnimationFrame` 合并更新。
- 大量模块时可引入可视化优化（虚拟化或分层绘制）。
- Grid 背景采用 CSS repeating-linear-gradient，避免重绘成本。
- 拖拽期间仅更新局部状态（当前模块 + 影响模块），避免全量布局重排导致卡顿。

## 13. 可访问性与可用性

- 提供键盘移动模块（方向键 + Shift 调整尺寸）。
- 编辑模式切换有可见提示。
- 增强触控手势体验（移动端拖拽阈值）。

---

## 14. 里程碑建议

1. 完成 Grid Engine + 画布基础渲染
2. 完成拖拽/缩放/重排
3. 完成编辑模式
4. 完成 Drawer + 模块新增
5. 完成内置模块（搜索 + 快捷访问）
6. 插件体系开放 + JSON Schema 管理
