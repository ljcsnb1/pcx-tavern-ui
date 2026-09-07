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

      <!-- NPC状态面板 -->
      <NpcPanel v-if="has_npc" />
      <div class="npc-empty" v-else>
        <span class="npc-empty-text">无在场NPC</span>
      </div>

      <!-- 行动建议 -->
      <div class="actions">
        <div class="action-item">
          <span class="action-tag">A</span>
          <span class="action-text">{{ store.data.行动建议.A || '—' }}</span>
        </div>
        <div class="action-item">
          <span class="action-tag">B</span>
          <span class="action-text">{{ store.data.行动建议.B || '—' }}</span>
        </div>
        <div class="action-item">
          <span class="action-tag">C</span>
          <span class="action-text">{{ store.data.行动建议.C || '—' }}</span>
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

const has_npc = computed(() => {
  const npc = store.data.当前NPC;
  return npc && npc.姓名;
});
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
