<template>
  <div class="npc-panel">
    <!-- NPC标题行 -->
    <div class="npc-header">
      <span class="npc-name">{{ name }}</span>
      <span class="npc-tag" v-if="npc.类型标签">{{ npc.类型标签 }}</span>
      <span class="npc-age" v-if="npc.年龄">{{ npc.年龄 }}岁</span>
    </div>

    <!-- 外观网格 -->
    <div class="npc-grid" v-if="has_appearance">
      <div class="npc-field" v-if="npc.样貌">
        <span class="field-label">样貌</span>
        <span class="field-value">{{ npc.样貌 }}</span>
      </div>
      <div class="npc-field" v-if="npc.着装">
        <span class="field-label">着装</span>
        <span class="field-value">{{ npc.着装 }}</span>
      </div>
      <div class="npc-field" v-if="npc.姿势">
        <span class="field-label">姿势</span>
        <span class="field-value">{{ npc.姿势 }}</span>
      </div>
    </div>

    <!-- 身体网格 -->
    <div class="npc-grid body-grid" v-if="has_body">
      <div class="npc-field" v-if="npc.奶子">
        <span class="field-label">奶子</span>
        <span class="field-value">{{ npc.奶子 }}</span>
      </div>
      <div class="npc-field" v-if="npc.小穴">
        <span class="field-label">小穴</span>
        <span class="field-value">{{ npc.小穴 }}</span>
      </div>
      <div class="npc-field" v-if="npc.菊花">
        <span class="field-label">菊花</span>
        <span class="field-value">{{ npc.菊花 }}</span>
      </div>
      <div class="npc-field" v-if="npc.红唇">
        <span class="field-label">红唇</span>
        <span class="field-value">{{ npc.红唇 }}</span>
      </div>
      <div class="npc-field" v-if="npc.玉足">
        <span class="field-label">玉足</span>
        <span class="field-value">{{ npc.玉足 }}</span>
      </div>
    </div>

    <!-- 性格（如有） -->
    <div class="npc-personality" v-if="npc.性格">
      <span class="field-label">性格</span>
      <span class="field-value">{{ npc.性格 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/** 单个NPC的数据结构（z.record value 类型） */
type NpcData = {
  类型标签: string;
  年龄: number;
  性格: string;
  样貌: string;
  着装: string;
  姿势: string;
  奶子: string;
  小穴: string;
  菊花: string;
  红唇: string;
  玉足: string;
};

const props = defineProps<{
  name: string;
  npc: NpcData;
}>();

const npc = computed(() => props.npc);

const has_appearance = computed(() => {
  const n = npc.value;
  return n.样貌 || n.着装 || n.姿势;
});

const has_body = computed(() => {
  const n = npc.value;
  return n.奶子 || n.小穴 || n.菊花 || n.红唇 || n.玉足;
});
</script>

<style lang="scss" scoped>
.npc-panel {
  background-color: var(--c-surface);
  padding: 8px 10px;
  margin-bottom: 10px;
  border-radius: 2px;
}

.npc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--c-background);
  flex-wrap: wrap;
}

.npc-name {
  color: var(--c-primary);
  font-weight: bold;
  font-size: 0.95rem;
}

.npc-tag {
  color: var(--c-accent);
  font-size: 0.75rem;
  background-color: var(--c-background);
  padding: 1px 6px;
  border-radius: 2px;
}

.npc-age {
  color: var(--c-text-muted);
  font-size: 0.75rem;
}

.npc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 6px;
}

.body-grid {
  border-top: 1px dashed var(--c-background);
  padding-top: 6px;
}

.npc-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.field-label {
  color: var(--c-text-muted);
  font-size: 0.7rem;
  flex-shrink: 0;
}

.field-value {
  color: var(--c-text-primary);
  font-size: 0.8rem;
  line-height: 1.35;
}

.npc-personality {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed var(--c-background);
}

@media (max-width: 500px) {
  .npc-grid {
    grid-template-columns: 1fr;
  }
}
</style>
