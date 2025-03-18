<template>
  <div v-if="modelValue" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">特质和职业详情</h2>
        <button @click="$emit('update:modelValue', false)" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 特质详情 -->
        <div v-if="traits.length > 0" class="space-y-4">
          <h3 class="text-xl font-semibold text-blue-600">特质</h3>
          <div v-for="trait in traits" :key="trait.raceId" class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center mb-2">
              <img :src="trait.imagePath" :alt="trait.name" class="w-12 h-12 mr-3">
              <h4 class="text-lg font-medium">{{ trait.name }}</h4>
            </div>
            <p class="text-gray-700 whitespace-pre-line text-sm mb-3">{{ trait.introduce }}</p>
            <div class="space-y-1">
              <div v-for="(effect, level) in trait.level" :key="level" class="flex items-center text-sm">
                <span class="font-medium mr-2">{{ level }}级：</span>
                <span>{{ effect }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 职业详情 -->
        <div v-if="jobs.length > 0" class="space-y-4">
          <h3 class="text-xl font-semibold text-green-600">职业</h3>
          <div v-for="job in jobs" :key="job.jobId" class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center mb-2">
              <img :src="job.imagePath" :alt="job.name" class="w-12 h-12 mr-3">
              <h4 class="text-lg font-medium">{{ job.name }}</h4>
            </div>
            <p class="text-gray-700 whitespace-pre-line text-sm mb-3">{{ job.introduce }}</p>
            <div class="space-y-1">
              <div v-for="(effect, level) in job.level" :key="level" class="flex items-center text-sm">
                <span class="font-medium mr-2">{{ level }}级：</span>
                <span>{{ effect }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import raceData from '../assets/data/tft13/race.json'
import jobData from '../assets/data/tft13/job.json'

const props = defineProps({
  modelValue: Boolean,
  trait: {
    type: Object,
    required: true
  }
})

defineEmits(['update:modelValue'])

// 计算特质和职业列表
const traits = computed(() => {
  if (!props.trait.races) return []
  return props.trait.races.map(raceName => 
    raceData.data.find(race => race.name === raceName)
  ).filter(Boolean)
})

const jobs = computed(() => {
  if (!props.trait.jobs) return []
  return props.trait.jobs.map(jobName => 
    jobData.data.find(job => job.name === jobName)
  ).filter(Boolean)
})
</script> 