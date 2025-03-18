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
                'bg-green-100 border-green-500': showResult && option === currentQuestion.correctAnswer,
                'bg-red-100 border-red-500': showResult && option === selectedAnswer && option !== currentQuestion.correctAnswer
              }"
            >
              {{ option }}
            </button>
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

      <!-- 完成提示 -->
      <div v-if="quizCompleted" class="text-center">
        <h2 class="text-2xl font-bold mb-4">测试完成！</h2>
        <p class="text-xl mb-6">最终得分：{{ score }}/{{ totalQuestions }}</p>
        <button
          @click="restartQuiz"
          class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          重新开始
        </button>
      </div>

      <!-- 详细信息模态框 -->
      <ChessDetailModal
        v-model="showDetailModal"
        :chess="currentChessDetail"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import chessData from '../assets/data/tft13/chess.json'
import raceData from '../assets/data/tft13/race.json'
import jobData from '../assets/data/tft13/job.json'
import ChessDetailModal from './ChessDetailModal.vue'

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

// 生成问题
const generateQuestions = () => {
  const newQuestions = []
  const chessList = chessData.data
  const raceList = raceData.data
  const jobList = jobData.data

  // 生成10个问题
  for (let i = 0; i < totalQuestions.value; i++) {
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

      question = {
        type: 'trait',
        question: `${randomChess.displayName}具有哪些特质和职业？`,
        correctAnswer: `${races.join('、')}特质和${jobs.join('、')}职业`,
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
  const options = [correctAnswer]
  const otherChess = chessList.filter(chess => chess.displayName !== correctAnswer)
  
  while (options.length < 4) {
    const randomIndex = Math.floor(Math.random() * otherChess.length)
    const option = otherChess[randomIndex].displayName
    if (!options.includes(option)) {
      options.push(option)
    }
  }
  
  return shuffleArray(options)
}

// 生成特质和职业选项
const generateTraitOptions = (raceList, jobList, correctRaces, correctJobs) => {
  const options = [`${correctRaces.join('、')}特质和${correctJobs.join('、')}职业`]
  
  // 生成3个错误选项
  while (options.length < 4) {
    const randomRaces = getRandomItems(raceList, 1, 2)
    const randomJobs = getRandomItems(jobList, 1, 2)
    
    const option = `${randomRaces.map(r => r.name).join('、')}特质和${randomJobs.map(j => j.name).join('、')}职业`
    
    if (!options.includes(option)) {
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

// 检查答案
const checkAnswer = (answer) => {
  if (showResult.value) return
  selectedAnswer.value = answer
  showResult.value = true
  
  if (answer === currentQuestion.value.correctAnswer) {
    score.value++
  }

  // 显示详细信息
  if (currentQuestion.value.type === 'chess') {
    currentChessDetail.value = chessData.data.find(chess => chess.displayName === currentQuestion.value.correctAnswer)
    showDetailModal.value = true
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