<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h1 class="text-3xl font-bold text-center text-blue-600 mb-8">云顶之弈知识问答</h1>
      
      <!-- 得分显示 -->
      <div class="text-center mb-6">
        <span class="text-xl font-semibold">得分：{{ score }}/{{ totalQuestions }}</span>
      </div>

      <!-- 问题卡片 -->
      <div v-if="currentQuestion" class="mb-8">
        <div class="bg-gray-50 rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">{{ currentQuestion.question }}</h2>
          
          <!-- 选项列表 -->
          <div class="space-y-3">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              @click="checkAnswer(option)"
              class="w-full p-4 text-left rounded-lg border transition-colors"
              :class="{
                'bg-blue-100 border-blue-500': selectedAnswer === option,
                'hover:bg-gray-100': !selectedAnswer,
                'bg-green-100 border-green-500': showResult && ((currentQuestion.type === 'chess' && option.value === currentQuestion.correctAnswer) || (currentQuestion.type === 'trait' && option.text === currentQuestion.correctAnswer.text)),
                'bg-red-100 border-red-500': showResult && ((currentQuestion.type === 'chess' && option.value === selectedAnswer.value && option.value !== currentQuestion.correctAnswer) || (currentQuestion.type === 'trait' && option.text === selectedAnswer.text && option.text !== currentQuestion.correctAnswer.text))
              }"
            >
              {{ option.text }}
            </button>
          </div>

          <!-- 答案反馈 -->
          <div v-if="showResult" class="mt-6 p-4 rounded-lg" :class="isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold" :class="isCorrect ? 'text-green-700' : 'text-red-700'">
                  {{ isCorrect ? '回答正确！' : '回答错误！' }}
                </p>
                <p class="mt-2 text-gray-600">
                  {{ currentQuestion.type === 'chess' ? '正确答案是：' + currentQuestion.correctAnswer : '正确答案是：' + currentQuestion.correctAnswer.text }}
                </p>
              </div>
              <button
                @click="showDetail"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 下一题按钮 -->
      <div v-if="showResult" class="text-center">
        <button
          @click="nextQuestion"
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          下一题
        </button>
      </div>

      <!-- 详细信息模态框 -->
      <ChessDetailModal
        v-model="showDetailModal"
        :chess="currentChessDetail"
      />
      
      <!-- 特质和职业详情模态框 -->
      <TraitDetailModal
        v-model="showTraitModal"
        :trait="currentTraitDetail"
      />

      <!-- 完成提示模态框 -->
      <QuizCompleteModal
        v-model="quizCompleted"
        :show-close="false"
        title="测试完成！"
        :content="`最终得分：${score}/${totalQuestions}`"
        @restart="restartQuiz"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import chessData from '../assets/data/tft13/chess.json'
import raceData from '../assets/data/tft13/race.json'
import jobData from '../assets/data/tft13/job.json'
import ChessDetailModal from './ChessDetailModal.vue'
import TraitDetailModal from './TraitDetailModal.vue'
import QuizCompleteModal from './QuizCompleteModal.vue'

const score = ref(0)
const totalQuestions = ref(10)
const currentQuestionIndex = ref(0)
const questions = ref([])
const currentQuestion = ref(null)
const selectedAnswer = ref(null)
const showResult = ref(false)
const quizCompleted = ref(false)
const showDetailModal = ref(false)
const currentChessDetail = ref(null)
const showTraitModal = ref(false)
const currentTraitDetail = ref(null)

// 添加计算属性判断答案是否正确
const isCorrect = computed(() => {
  if (!selectedAnswer.value || !showResult.value) return false
  if (currentQuestion.value.type === 'chess') {
    return selectedAnswer.value.value === currentQuestion.value.correctAnswer
  } else {
    return selectedAnswer.value.text === currentQuestion.value.correctAnswer.text
  }
})

// 生成问题
const generateQuestions = () => {
  const newQuestions = []
  const chessList = chessData.data
  const raceList = raceData.data
  const jobList = jobData.data

  // 生成10个问题
  while (newQuestions.length < totalQuestions.value) {
    const questionType = Math.random() < 0.5 ? 'chess' : 'trait'
    let question

    if (questionType === 'chess') {
      // 根据特质和职业提问棋子
      const randomChess = chessList[Math.floor(Math.random() * chessList.length)]
      const raceIds = randomChess.raceIds.split(',')
      const jobIds = randomChess.jobIds.split(',')
      
      const races = raceIds.map(id => 
        raceList.find(race => race.raceId === id)?.name
      ).filter(Boolean)
      
      const jobs = jobIds.map(id => 
        jobList.find(job => job.jobId === id)?.name
      ).filter(Boolean)

      // 如果特质或职业为空，跳过这个问题
      if (races.length === 0 || jobs.length === 0) {
        continue
      }

      question = {
        type: 'chess',
        question: `以下哪个棋子同时具有${races.join('、')}特质和${jobs.join('、')}职业？`,
        correctAnswer: randomChess.displayName,
        options: generateOptions(chessList, randomChess.displayName)
      }
    } else {
      // 根据棋子提问特质和职业
      const randomChess = chessList[Math.floor(Math.random() * chessList.length)]
      const raceIds = randomChess.raceIds.split(',')
      const jobIds = randomChess.jobIds.split(',')
      
      const races = raceIds.map(id => 
        raceList.find(race => race.raceId === id)?.name
      ).filter(Boolean)
      
      const jobs = jobIds.map(id => 
        jobList.find(job => job.jobId === id)?.name
      ).filter(Boolean)

      // 如果特质或职业为空，跳过这个问题
      if (races.length === 0 || jobs.length === 0) {
        continue
      }

      question = {
        type: 'trait',
        question: `${randomChess.displayName}具有哪些特质和职业？`,
        correctAnswer: {
          text: `${races.join('、')}特质和${jobs.join('、')}职业`,
          races: races,
          jobs: jobs
        },
        options: generateTraitOptions(raceList, jobList, races, jobs)
      }
    }

    newQuestions.push(question)
  }

  questions.value = newQuestions
  currentQuestion.value = newQuestions[0]
}

// 生成选项
const generateOptions = (chessList, correctAnswer) => {
  const options = [{
    text: correctAnswer,
    value: correctAnswer
  }]
  const otherChess = chessList.filter(chess => chess.displayName !== correctAnswer)
  
  while (options.length < 4) {
    const randomIndex = Math.floor(Math.random() * otherChess.length)
    const option = otherChess[randomIndex].displayName
    if (!options.some(opt => opt.value === option)) {
      options.push({
        text: option,
        value: option
      })
    }
  }
  
  return shuffleArray(options)
}

// 生成特质和职业选项
const generateTraitOptions = (raceList, jobList, correctRaces, correctJobs) => {
  const options = []
  
  // 添加正确答案
  const correctOption = {
    text: `${correctRaces.join('、')}特质和${correctJobs.join('、')}职业`,
    races: correctRaces,
    jobs: correctJobs
  }
  options.push(correctOption)
  
  // 生成3个错误选项
  while (options.length < 4) {
    const randomRaces = getRandomItems(raceList, 1, 2)
    const randomJobs = getRandomItems(jobList, 1, 2)
    
    // 确保随机生成的特质和职业不为空
    if (randomRaces.length === 0 || randomJobs.length === 0) {
      continue
    }
    
    const option = {
      text: `${randomRaces.map(r => r.name).join('、')}特质和${randomJobs.map(j => j.name).join('、')}职业`,
      races: randomRaces.map(r => r.name),
      jobs: randomJobs.map(j => j.name)
    }
    
    if (!options.some(opt => opt.text === option.text)) {
      options.push(option)
    }
  }
  
  return shuffleArray(options)
}

// 获取随机数量的随机项目
const getRandomItems = (list, min, max) => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  const shuffled = shuffleArray([...list])
  return shuffled.slice(0, count)
}

// 数组随机排序
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// 修改检查答案方法
const checkAnswer = (answer) => {
  if (showResult.value) return
  selectedAnswer.value = answer
  showResult.value = true
  
  if (currentQuestion.value.type === 'chess') {
    if (answer.value === currentQuestion.value.correctAnswer) {
      score.value++
    }
    currentChessDetail.value = chessData.data.find(chess => chess.displayName === currentQuestion.value.correctAnswer)
  } else {
    if (answer.text === currentQuestion.value.correctAnswer.text) {
      score.value++
    }
    currentTraitDetail.value = currentQuestion.value.correctAnswer
  }
}

// 添加显示详情方法
const showDetail = () => {
  if (currentQuestion.value.type === 'chess') {
    showDetailModal.value = true
  } else {
    showTraitModal.value = true
  }
}

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    currentQuestion.value = questions.value[currentQuestionIndex.value]
    selectedAnswer.value = null
    showResult.value = false
  } else {
    quizCompleted.value = true
  }
}

// 重新开始
const restartQuiz = () => {
  score.value = 0
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  showResult.value = false
  quizCompleted.value = false
  showDetailModal.value = false
  currentChessDetail.value = null
  showTraitModal.value = false
  currentTraitDetail.value = null
  generateQuestions()
}

onMounted(() => {
  generateQuestions()
})
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}
</style> 