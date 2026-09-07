<template>
  <div class="status-bar">
    <!-- 标题栏（始终可见） -->
    <div class="header" @click="expanded = !expanded">
      <div class="header-left">
        <span class="header-time" v-if="store.data.系统.当前时间">{{ store.data.系统.当前时间 }}</span>
        <span class="header-time" v-else>----/--/-- --:--</span>
        <span class="header-divider">|</span>
        <span class="header-loc" v-if="store.data.系统.当前位置">{{ store.data.系统.当前位置 }}</span>
        <span class="header-loc header-loc-empty" v-else>未选定场所</span>
      </div>
      <div class="header-right">
        <span class="header-name">{{ store.data.玩家.名字 || 'Daniel' }}</span>
        <span class="header-toggle" :class="{ 'header-toggle-open': expanded }">▾</span>
      </div>
    </div>

    <!-- 展开区 -->
    <div class="expand-area" v-show="expanded">
      <!-- 场景状态 -->
      <div class="scene-status" v-if="store.data.系统.场景状态">
        <span class="scene-label">场景</span>
        <span class="scene-value">{{ store.data.系统.场景状态 }}</span>
      </div>

      <!-- NPC状态面板 — 多NPC动态渲染 -->
      <template v-if="npc_entries.length">
        <NpcPanel
          v-for="[name, npc] in npc_entries"
          :key="name"
          :name="name"
          :npc="npc"
        />
      </template>
      <div class="npc-empty" v-else>
        <span class="npc-empty-text">无在场NPC</span>
      </div>

      <!-- NPC数量提示（多NPC时显示） -->
      <div class="npc-count" v-if="npc_entries.length > 1">
        <span class="npc-count-text">在场 {{ npc_entries.length }} 人</span>
      </div>

      <!-- 行动建议 — 优先用MVU变量，fallback从正文解析 -->
      <div class="actions">
        <div class="action-item">
          <span class="action-tag">A</span>
          <span class="action-text">{{ actions.A || '—' }}</span>
        </div>
        <div class="action-item">
          <span class="action-tag">B</span>
          <span class="action-text">{{ actions.B || '—' }}</span>
        </div>
        <div class="action-item">
          <span class="action-tag">C</span>
          <span class="action-text">{{ actions.C || '—' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore } from './store';
import NpcPanel from './components/NpcPanel.vue';

const store = useDataStore();

const expanded = ref(true);

/** NPC record 条目数组 [name, npc_data][] */
const npc_entries = computed(() => {
  const record = store.data.当前NPC;
  if (!record || typeof record !== 'object') return [];
  return Object.entries(record).filter(([name, npc]) => {
    // 过滤掉键名为空或值为空对象的情况
    return name && Object.keys(npc as object).length > 0;
  }) as [string, typeof record[string]][];
});

/** 行动建议 — MVU变量优先，正文fallback */
const actions = computed(() => {
  const mvu_actions = store.data.行动建议;
  const a = mvu_actions?.A?.trim();
  const b = mvu_actions?.B?.trim();
  const c = mvu_actions?.C?.trim();

  // 如果MVU变量有值，直接用
  if (a && b && c) {
    return { A: a, B: b, C: c };
  }

  // Fallback: 从当前消息正文解析 A/B/C
  const parsed = parse_actions_from_message();
  if (parsed) {
    return parsed;
  }

  // 最终fallback: 显示MVU变量中有的部分
  return {
    A: a || '',
    B: b || '',
    C: c || '',
  };
});

/**
 * 从当前消息正文中解析 A/B/C 行动建议。
 *
 * 支持的格式（从JSONL观察到的真实输出格式）：
 *   "A. 订个包间，让她上人——正规流程，进场选妃\nB. 问她...\nC. 直接说..."
 *   "A. 让她们都坐下，先喝一杯再说 B. 直接点名... C. 站起来..."
 *
 * 策略：取 <StatusPlaceHolderImpl/> 或 <UpdateVariable> 标签之前
 * 的最后一段包含 A. B. C. 的文本块。
 */
function parse_actions_from_message(): { A: string; B: string; C: string } | null {
  try {
    const msg_id = getCurrentMessageId();
    const messages = getChatMessages(msg_id, { role: 'assistant' });
    if (!messages || messages.length === 0) return null;

    const mes = messages[0].message;
    if (!mes) return null;

    // 截取 StatusPlaceHolderImpl 之前的内容
    const beforePlaceholder = mes.split('<StatusPlaceHolderImpl')[0];
    // 再截取 UpdateVariable 之前
    const beforeUpdate = beforePlaceholder.split('<UpdateVariable')[0];

    // 从后往前找包含 A. B. C. 的文本块
    // 用正则匹配最后的 A. ... B. ... C. ... 模式
    const actionRegex = /A[.、．:：]\s*(.+?)(?=\s*B[.、．:：]|$)/s;
    const bRegex = /B[.、．:：]\s*(.+?)(?=\s*C[.、．:：]|$)/s;
    const cRegex = /C[.、．:：]\s*(.+?)(?=\n|$)/s;

    const aMatch = beforeUpdate.match(actionRegex);
    const bMatch = beforeUpdate.match(bRegex);
    const cMatch = beforeUpdate.match(cRegex);

    if (aMatch && bMatch && cMatch) {
      const cleanA = aMatch[1].trim().replace(/\n/g, ' ');
      const cleanB = bMatch[1].trim().replace(/\n/g, ' ');
      const cleanC = cMatch[1].trim().replace(/\n/g, ' ');

      if (cleanA && cleanB && cleanC) {
        return { A: cleanA, B: cleanB, C: cleanC };
      }
    }

    return null;
  } catch (e) {
    console.warn('[状态栏] 从正文解析行动建议失败:', e);
    return null;
  }
}
</script>

<style lang="scss" scoped>
.status-bar {
  width: 100%;
  max-width: 680px;
  background-color: var(--c-background);
  border: 1px solid var(--c-surface);
  border-left: 3px solid var(--c-primary);
  font-family: var(--font-main);
  color: var(--c-text-primary);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid var(--c-surface);
  transition: background-color 0.15s;

  &:hover {
    background-color: var(--c-surface);
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.header-time {
  font-family: var(--font-mono);
  color: var(--c-text-muted);
  font-size: 0.85rem;
}

.header-divider {
  color: var(--c-text-muted);
  opacity: 0.5;
}

.header-loc {
  color: var(--c-primary);
  font-weight: bold;
}

.header-loc-empty {
  color: var(--c-text-muted);
  font-weight: normal;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-name {
  color: var(--c-text-primary);
  font-weight: bold;
}

.header-toggle {
  color: var(--c-text-muted);
  font-size: 0.7rem;
  transition: transform 0.2s;
}

.header-toggle-open {
  transform: rotate(180deg);
}

.expand-area {
  padding: 10px 12px;
}

.scene-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--c-surface);
}

.scene-label {
  color: var(--c-text-muted);
  font-size: 0.75rem;
  background-color: var(--c-surface);
  padding: 2px 6px;
  border-radius: 2px;
}

.scene-value {
  color: var(--c-accent);
  font-size: 0.85rem;
}

.npc-empty {
  text-align: center;
  padding: 20px 0;
}

.npc-empty-text {
  color: var(--c-text-muted);
  font-size: 0.8rem;
}

.npc-count {
  text-align: right;
  margin-bottom: 8px;
}

.npc-count-text {
  color: var(--c-text-muted);
  font-size: 0.7rem;
  opacity: 0.8;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed var(--c-surface);
  flex-wrap: wrap;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 120px;
}

.action-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background-color: var(--c-accent);
  color: var(--c-background);
  font-size: 0.7rem;
  font-weight: bold;
  border-radius: 2px;
  flex-shrink: 0;
}

.action-text {
  color: var(--c-text-primary);
  font-size: 0.8rem;
  line-height: 1.3;
}

@media (max-width: 500px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .actions {
    flex-direction: column;
  }

  .action-item {
    min-width: auto;
  }
}
</style>
