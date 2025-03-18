<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" @close="handleClose" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-xl font-bold text-gray-900 mb-4">
                {{ chess?.displayName }} 详细信息
              </DialogTitle>
              <div class="mt-4">
                <div v-if="chess" class="space-y-6">
                  <!-- 基本信息 -->
                  <div class="flex items-start space-x-4">
                    <img :src="chess.originalImage" :alt="chess.displayName" class="w-24 h-24 rounded-lg">
                    <div class="space-y-2">
                      <div class="flex items-center space-x-2">
                        <span class="font-medium text-gray-700">费用：</span>
                        <span class="text-gray-600">{{ chess.price }}金币</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="font-medium text-gray-700">特质：</span>
                        <span class="text-gray-600">{{ chess.races }}</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="font-medium text-gray-700">职业：</span>
                        <span class="text-gray-600">{{ chess.jobs }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 技能信息 -->
                  <div class="border-t pt-4">
                    <h4 class="font-bold mb-2">技能：{{ chess.skillName }}</h4>
                    <p class="text-gray-700">{{ chess.skillIntroduce }}</p>
                  </div>
                  
                  <!-- 属性信息 -->
                  <div class="grid grid-cols-2 gap-4 border-t pt-4">
                    <div>
                      <h4 class="font-bold mb-2">基础属性</h4>
                      <p>生命值：{{ chess.life }}</p>
                      <p>法力值：{{ chess.magic }}</p>
                      <p>护甲：{{ chess.armor }}</p>
                      <p>魔抗：{{ chess.spellBlock }}</p>
                    </div>
                    <div>
                      <h4 class="font-bold mb-2">攻击属性</h4>
                      <p>攻击力：{{ chess.attack }}</p>
                      <p>攻速：{{ chess.attackSpeed }}</p>
                      <p>攻击范围：{{ chess.attackRange }}</p>
                      <p>暴击率：{{ chess.crit }}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  @click="handleClose"
                >
                  关闭
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  chess: {
    type: Object,
    required: true
  },
  autoClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .bg-white,
.fade-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.fade-enter-from .bg-white,
.fade-leave-to .bg-white {
  transform: scale(0.95);
}
</style> 