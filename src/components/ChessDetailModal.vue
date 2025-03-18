<template>
  <div v-if="modelValue" class="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-xl font-bold">{{ chess?.displayName }} 详细信息</h3>
        <button @click="$emit('update:modelValue', false)" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div v-if="chess" class="space-y-4">
        <div class="flex items-center space-x-4">
          <img :src="chess.originalImage" :alt="chess.displayName" class="w-24 h-24 rounded-lg">
          <div>
            <p class="font-semibold">费用：{{ chess.price }}金币</p>
            <p>特质：{{ chess.races }}</p>
            <p>职业：{{ chess.jobs }}</p>
          </div>
        </div>
        
        <div class="border-t pt-4">
          <h4 class="font-bold mb-2">技能：{{ chess.skillName }}</h4>
          <p class="text-gray-700">{{ chess.skillIntroduce }}</p>
        </div>
        
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
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  chess: {
    type: Object,
    default: null
  }
})

defineEmits(['update:modelValue'])
</script> 