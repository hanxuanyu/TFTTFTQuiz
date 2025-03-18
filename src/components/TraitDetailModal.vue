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
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
              <button
                type="button"
                class="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none"
                @click="handleClose"
              >
                <span class="sr-only">关闭</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <DialogTitle as="h3" class="text-xl font-bold text-gray-900 mb-4">
                特质和职业详情
              </DialogTitle>
              <div class="mt-4">
                <div v-if="trait" class="space-y-6">
                  <!-- 特质详情 -->
                  <div v-if="traits.length > 0" class="space-y-4">
                    <h3 class="text-xl font-semibold text-blue-600">特质</h3>
                    <div v-for="trait in traits" :key="trait.raceId" class="space-y-4">
                      <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div class="flex items-center mb-2">
                          <img :src="trait.imagePath" :alt="trait.name" class="w-12 h-12 mr-3">
                          <h4 class="text-lg font-medium text-gray-800">{{ trait.name }}</h4>
                        </div>
                        <p class="text-gray-700 whitespace-pre-line text-sm mb-3">{{ trait.introduce }}</p>
                        <div class="space-y-1">
                          <div v-for="(effect, level) in trait.level" :key="level" class="flex items-center text-sm">
                            <span class="font-medium mr-2 text-gray-600">{{ level }}级：</span>
                            <span class="text-gray-700">{{ effect }}</span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- 特质相关棋子 -->
                      <div v-if="getChessesByRace(trait.name).length > 0" class="ml-4">
                        <h4 class="text-sm font-medium text-blue-600 mb-2">相关棋子：</h4>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          <div v-for="chess in getChessesByRace(trait.name)" :key="chess.chessId" 
                               class="bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors">
                            <div class="flex items-center">
                              <img :src="'https://game.gtimg.cn/images/lol/act/img/tft/champions/' + chess.name" :alt="chess.displayName" 
                                   class="w-8 h-8 rounded-full mr-2">
                              <div>
                                <h5 class="text-xs font-medium text-gray-800">{{ chess.displayName }}</h5>
                                <p class="text-xs text-gray-500">{{ chess.price }}费</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 职业详情 -->
                  <div v-if="jobs.length > 0" class="space-y-4">
                    <h3 class="text-xl font-semibold text-green-600">职业</h3>
                    <div v-for="job in jobs" :key="job.jobId" class="space-y-4">
                      <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div class="flex items-center mb-2">
                          <img :src="job.imagePath" :alt="job.name" class="w-12 h-12 mr-3">
                          <h4 class="text-lg font-medium text-gray-800">{{ job.name }}</h4>
                        </div>
                        <p class="text-gray-700 whitespace-pre-line text-sm mb-3">{{ job.introduce }}</p>
                        <div class="space-y-1">
                          <div v-for="(effect, level) in job.level" :key="level" class="flex items-center text-sm">
                            <span class="font-medium mr-2 text-gray-600">{{ level }}级：</span>
                            <span class="text-gray-700">{{ effect }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- 职业相关棋子 -->
                      <div v-if="getChessesByJob(job.name).length > 0" class="ml-4">
                        <h4 class="text-sm font-medium text-green-600 mb-2">相关棋子：</h4>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          <div v-for="chess in getChessesByJob(job.name)" :key="chess.chessId" 
                               class="bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors">
                            <div class="flex items-center">
                              <img :src="'https://game.gtimg.cn/images/lol/act/img/tft/champions/' + chess.name" :alt="chess.displayName" 
                                   class="w-8 h-8 rounded-full mr-2">
                              <div>
                                <h5 class="text-xs font-medium text-gray-800">{{ chess.displayName }}</h5>
                                <p class="text-xs text-gray-500">{{ chess.price }}费</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
import { computed } from 'vue'
import raceData from '../assets/data/tft13/race.json'
import jobData from '../assets/data/tft13/job.json'
import chessData from '../assets/data/tft13/chess.json'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  trait: {
    type: Object,
    required: true
  },
  autoClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

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

// 计算相关棋子列表
const relatedChesses = computed(() => {
  if (!props.trait.races && !props.trait.jobs) return []
  
  return chessData.data.filter(chess => {
    const hasRace = props.trait.races?.some(race => chess.races.includes(race))
    const hasJob = props.trait.jobs?.some(job => chess.jobs.includes(job))
    return hasRace || hasJob
  })
})

// 根据特质获取相关棋子
const getChessesByRace = (raceName) => {
  return chessData.data.filter(chess => chess.races.includes(raceName))
}

// 根据职业获取相关棋子
const getChessesByJob = (jobName) => {
  return chessData.data.filter(chess => chess.jobs.includes(jobName))
}

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