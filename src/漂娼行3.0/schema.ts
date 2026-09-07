// 漂娼行3.0 — MVU 变量类型定义
// 全局 z (Zod v4) 与 _ (lodash) 由运行时注入，无需 import

export const Schema = z.object({
  // ── 系统 ──
  系统: z.object({
    当前时间: z.string().prefault(''),
    当前位置: z.string().prefault(''),
    场景状态: z.string().prefault(''),
  }).prefault({}),

  // ── 玩家 ──
  玩家: z.object({
    名字: z.string().prefault('Daniel'),
  }).prefault({}),

  // ── 当前NPC（z.record，键为NPC姓名；空对象 {} 表示无NPC在场） ──
  当前NPC: z.record(
    z.string().describe('NPC姓名'),
    z.object({
      类型标签: z.string().prefault(''),
      年龄: z.coerce.number().prefault(0),
      性格: z.string().prefault(''),
      样貌: z.string().prefault(''),
      着装: z.string().prefault(''),
      姿势: z.string().prefault(''),
      奶子: z.string().prefault(''),
      小穴: z.string().prefault(''),
      菊花: z.string().prefault(''),
      红唇: z.string().prefault(''),
      玉足: z.string().prefault(''),
    }).prefault({})
  ).prefault({}),

  // ── 行动建议（场景驱动生成） ──
  行动建议: z.object({
    A: z.string().prefault(''),
    B: z.string().prefault(''),
    C: z.string().prefault(''),
  }).prefault({}),
});

export type StatData = z.infer<typeof Schema>;
