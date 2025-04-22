好的，没问题。如果容器比较窄，垂直排列并居中是更合适的布局方式。

我们将使用 `display: flex` 配合 `flex-direction: column` 来实现垂直排列，并使用 `align-items: center` 来让图片卡片在水平方向上居中。

**主要 CSS 修改:**

1.  **`.image-list`:**
    * `display: flex;`
    * `flex-direction: column;` (设置主轴为垂直方向)
    * `align-items: center;` (交叉轴对齐方式，即水平居中)
    * `gap: 10px;` (项目之间的垂直间距)
2.  **`.image-card`:**
    * 移除之前的 `flex` 或 `width` 固定值（除非你仍想限制图片最大宽度）。
    * 可以设置一个 `width` (例如 `width: 90%` 或 `width: 100%`) 让卡片适应容器宽度，并配合 `max-width` 防止在意外变宽的容器中过大。
    * 保持 `aspect-ratio` (如果需要) 或根据需要调整/移除。

**`SmartImageCard.vue` (Vertical Centered Layout):**

```vue
<template>
  <div class="smart-image-card">
    <h3 v-if="schema?.title" class="component-title">{{ schema.title }}</h3>

    <div class="image-list">
      <div
        v-for="(img, index) in localImages"
        :key="img.id"
        class="image-card"
        :class="{ 'is-selected': img.selected }"
        @click="toggleSelect(index)"
      >
        <el-checkbox
          v-model="img.selected"
          class="image-checkbox"
          size="large"
          @click.stop // 阻止事件冒泡到 image-card 的点击事件
        />
        <el-image
          :src="img.src"
          :alt="img.alt || `Image ${index + 1}`"
          fit="cover"
          class="image-item"
          lazy
        />
      </div>
    </div>

    <div v-if="schema?.analysis" class="analysis">
      <h4>{{ schema.analysis.title }}</h4>
      <p>{{ schema.analysis.content }}</p>
    </div>

    <div class="actions">
      <el-button type="primary" @click="applySelected" :disabled="noSelection">应用选中</el-button>
      <el-button @click="applyAll">全部应用</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, PropType } from 'vue';
import { ElImage, ElCheckbox, ElButton } from 'element-plus';

// --- 类型定义 (保持不变) ---
interface ImageItemBase {
  id: string | number;
  src: string;
  alt?: string;
}
interface ImageItem extends ImageItemBase {
  selected: boolean;
}
interface AnalysisData {
  title: string;
  content: string;
}
interface Schema {
  title?: string;
  images: ImageItemBase[];
  analysis?: AnalysisData;
}

// --- Props (保持不变) ---
const props = defineProps({
  schema: {
    type: Object as PropType<Schema>,
    required: true,
    default: () => ({
      images: [],
      analysis: { title: '', content: '' }
    })
  },
});

// --- Emits (保持不变) ---
const emit = defineEmits<{
  (e: 'apply', selectedImageUrls: string[]): void;
}>();

// --- 响应式状态 (保持不变) ---
const localImages = ref<ImageItem[]>([]);

// --- 方法 (保持不变) ---
const updateLocalImages = (newImages: ImageItemBase[]) => {
   if (Array.isArray(newImages)) {
    localImages.value = newImages.map(img => ({
      ...img,
      selected: false,
    }));
  } else {
    localImages.value = [];
  }
};
const toggleSelect = (index: number) => {
  if (localImages.value[index]) {
    localImages.value[index].selected = !localImages.value[index].selected;
  }
};
const applySelected = () => {
  const selectedUrls = localImages.value
    .filter(img => img.selected)
    .map(img => img.src);
  emit('apply', selectedUrls);
};
const applyAll = () => {
  localImages.value.forEach(img => (img.selected = true));
  const allUrls = localImages.value.map(img => img.src);
  emit('apply', allUrls);
};

// --- 计算属性 (保持不变) ---
const noSelection = computed(() => {
  return !localImages.value.some(img => img.selected);
});

// --- Watchers (保持不变) ---
watch(
  () => props.schema?.images,
   (newImages) => {
     if (newImages) {
        updateLocalImages(newImages);
    }
  },
  { deep: true, immediate: true }
);

</script>

<style scoped>
.smart-image-card {
  width: 100%;
  box-sizing: border-box;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fff;
}

.component-title {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.1em;
  font-weight: bold;
  color: #303133;
  text-align: center; /* 标题也居中 */
}

/* --- 垂直居中布局 --- */
.image-list {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: center;   /* 水平居中对齐 */
  gap: 10px;             /* 项目之间的垂直间距 */
  margin-bottom: 15px;
}

.image-card {
  position: relative;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: border-color 0.3s, box-shadow 0.3s;
  aspect-ratio: 16 / 9; /* 调整宽高比，例如16:9，或移除保持图片原始比例 */
  background-color: #f5f7fa;
  width: 90%;           /* 卡片宽度占父容器的90% */
  max-width: 300px;     /* 最大宽度限制，防止过宽 */
  /* 如果不需要固定宽高比，移除 aspect-ratio */
}
/* --- 布局结束 --- */


.image-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.image-card.is-selected {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px var(--el-color-primary-light-5);
}

.image-item {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover; /* 保持 cover 或根据需要改为 contain */
}

.image-checkbox {
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  padding: 1px;
  height: auto;
  line-height: 1;
}

.image-checkbox .el-checkbox__inner {
    width: 16px;
    height: 16px;
}
.image-checkbox .el-checkbox__inner::after {
    height: 8px;
    left: 5px;
}


.analysis {
  margin-top: 16px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  text-align: center; /* 解析文字也居中 */
}

.analysis h4 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 1em;
  color: #303133;
}

.analysis p {
  margin-bottom: 0;
  font-size: 0.9em;
  color: #606266;
  line-height: 1.5;
}

.actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  justify-content: center; /* 按钮也居中 */
}
</style>
```

**主要变化:**

* **`.image-list`** 的样式已更新为 `display: flex; flex-direction: column; align-items: center;`。
* **`.image-card`** 的样式设置了 `width: 90%;` 和 `max-width: 300px;` 来适应容器宽度并限制最大宽度。同时，`aspect-ratio` 调整为 `16 / 9` (你可以根据需要修改或删除此行以允许图片自适应高度)。移除了之前版本中的 `flex` 或固定 `width` 属性。
* 为了整体协调，将标题 `.component-title`、解析文字 `.analysis` 和操作按钮 `.actions` 也设置为了居中对齐 (`text-align: center` 或 `justify-content: center`)。

现在，图片会从上到下依次排列，并且每张图片（卡片）会在其容器内水平居中显示。