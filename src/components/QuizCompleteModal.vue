<template>
  <Transition name="modal">
    <div v-if="modelValue" class="fixed inset-0 flex items-center justify-center z-50">
      <!-- 背景遮罩 -->
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="$emit('update:modelValue', false)"></div>
      
      <!-- 弹窗内容 -->
      <div class="relative bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div class="text-center">
          <slot>
            <h2 class="text-2xl font-bold text-blue-600 mb-4">{{ title }}</h2>
            <p class="text-xl mb-6">{{ content }}</p>
          </slot>
          
          <div class="flex justify-center space-x-4">
            <slot name="actions">
              <button
                v-if="showClose"
                @click="$emit('update:modelValue', false)"
                class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                关闭
              </button>
              <button
                v-if="showRestart"
                @click="$emit('restart')"
                class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                重新开始
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '提示'
  },
  content: {
    type: String,
    default: ''
  },
  showClose: {
    type: Boolean,
    default: true
  },
  showRestart: {
    type: Boolean,
    default: true
  }
})

defineEmits(['update:modelValue', 'restart'])
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style> 