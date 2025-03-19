<template>
  <div class="max-w-3xl mx-auto p-4">
    <div class="bg-white rounded-xl shadow-md p-5">
      <!-- 顶部信息栏 -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <!-- 版本信息和赛季选择 -->
        <div class="flex items-center space-x-4 mb-2 sm:mb-0">
          <div class="text-sm text-gray-500">
            <span v-if="gameData.chess?.version" class="mr-2">版本：{{ gameData.chess.version }}</span>
            <span v-if="gameData.chess?.season" class="mr-2">赛季：{{ gameData.chess.season }}</span>
          </div>
          
          <!-- 赛季选择 -->
          <select 
            v-model="selectedSeason" 
            class="px-3 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @change="handleSeasonChange"
          >
            <option value="tft13">S13</option>
            <option value="tft14">S14</option>
          </select>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- 进度显示 -->
          <div class="text-gray-600">
            <span class="font-medium">第 {{ currentQuestionIndex + 1 }}/{{ totalQuestions }} 题</span>
          </div>
          
          <!-- 得分显示 -->
          <div class="text-gray-600">
            <span class="font-medium">得分：{{ score }}/{{ totalQuestions }}</span>
          </div>
        </div>
      </div>

      <!-- 问题卡片 -->
      <div v-if="currentQuestion" class="mb-8">
        <div class="bg-gray-50 rounded-lg p-6">
          <h2 class="text-xl font-medium mb-4 text-gray-800">{{ currentQuestion.question }}</h2>
          
          <!-- 选项列表 -->
          <div class="space-y-3">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              @click="checkAnswer(option)"
              class="w-full p-4 text-left rounded-lg border transition-all duration-200"
              :class="getOptionClass(option)"
            >
              {{ option.text }}
            </button>
          </div>

          <!-- 答案反馈 -->
          <div v-if="showResult" class="mt-6 p-4 rounded-lg" :class="isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p class="font-medium" :class="isCorrect ? 'text-green-700' : 'text-red-700'">
                  {{ isCorrect ? '回答正确！' : '回答错误！' }}
                </p>
                <p class="mt-2 text-sm text-gray-600">
                  {{ correctAnswerText }}
                </p>
              </div>
              <div class="flex flex-col sm:flex-row gap-3 sm:space-x-4">
                <button
                  @click="showDetail"
                  class="w-full sm:w-auto px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  查看详情
                </button>
                <button
                  v-if="!autoSkip || !isCorrect"
                  @click="nextQuestion"
                  class="w-full sm:w-auto px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  下一题
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 自动换题开关 -->
      <div class="flex items-center justify-end">
        <span class="text-sm text-gray-600 mr-2">自动换题</span>
        <Switch v-model="autoSkip" />
      </div>

      <!-- 详细信息模态框 -->
      <ChessDetailModal
        v-if="currentChessDetail"
        v-model="showDetailModal"
        :chess="currentChessDetail"
      />
      
      <!-- 特质和职业详情模态框 -->
      <TraitDetailModal
        v-if="currentTraitDetail"
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
import { useGameDataStore } from '../stores/gameData'
import ChessDetailModal from './ChessDetailModal.vue'
import TraitDetailModal from './TraitDetailModal.vue'
import QuizCompleteModal from './QuizCompleteModal.vue'
import Switch from './Switch.vue'

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
const autoSkip = ref(false)
const selectedSeason = ref('tft14') // 默认选择S14
const gameDataStore = useGameDataStore()
const gameData = ref({
  chess: null,
  race: null,
  job: null
})

// 添加计算属性判断答案是否正确
const isCorrect = computed(() => {
  if (!selectedAnswer.value || !showResult.value) return false
  if (currentQuestion.value.type === 'chess') {
    return selectedAnswer.value.value === currentQuestion.value.correctAnswer
  } else if (currentQuestion.value.type === 'trait') {
    return selectedAnswer.value.text === currentQuestion.value.correctAnswer.text
  } else if (currentQuestion.value.type === 'price') {
    return selectedAnswer.value.value === currentQuestion.value.correctAnswer
  }
  return false
})

// 添加计算属性获取正确答案文本
const correctAnswerText = computed(() => {
  if (!currentQuestion.value) return ''
  if (currentQuestion.value.type === 'chess') {
    return '正确答案是：' + currentQuestion.value.correctAnswer
  } else if (currentQuestion.value.type === 'trait') {
    return '正确答案是：' + currentQuestion.value.correctAnswer.text
  } else if (currentQuestion.value.type === 'price') {
    return '正确答案是：' + (currentQuestion.value.question.includes('费用是') ? 
      currentQuestion.value.correctAnswer : 
      currentQuestion.value.correctAnswer + '金币')
  }
  return ''
})

// 添加计算属性判断选项样式
const getOptionClass = computed(() => (option) => {
  if (!showResult.value) {
    return selectedAnswer.value === option ? 
      'bg-indigo-50 border-indigo-300' : 
      'hover:bg-gray-50 border-gray-200 bg-white'
  }
  
  if (currentQuestion.value.type === 'chess') {
    if (option.value === currentQuestion.value.correctAnswer) {
      return 'bg-green-50 border-green-300'
    }
    if (option.value === selectedAnswer.value?.value && option.value !== currentQuestion.value.correctAnswer) {
      return 'bg-red-50 border-red-300'
    }
  } else if (currentQuestion.value.type === 'trait') {
    if (option.text === currentQuestion.value.correctAnswer.text) {
      return 'bg-green-50 border-green-300'
    }
    if (option.text === selectedAnswer.value?.text && option.text !== currentQuestion.value.correctAnswer.text) {
      return 'bg-red-50 border-red-300'
    }
  } else if (currentQuestion.value.type === 'price') {
    if (option.value === currentQuestion.value.correctAnswer) {
      return 'bg-green-50 border-green-300'
    }
    if (option.value === selectedAnswer.value?.value && option.value !== currentQuestion.value.correctAnswer) {
      return 'bg-red-50 border-red-300'
    }
  }
  
  return 'bg-white border-gray-200'
})

// 处理赛季变更
const handleSeasonChange = async () => {
  // 重置所有状态
  score.value = 0
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  showResult.value = false
  quizCompleted.value = false
  showDetailModal.value = false
  currentChessDetail.value = null
  showTraitModal.value = false
  currentTraitDetail.value = null
  
  // 重新加载数据并生成问题
  await initializeData()
}

// 初始化数据
const initializeData = async () => {
  try {
    gameData.value = await gameDataStore.loadData(selectedSeason.value)
    generateQuestions()
  } catch (error) {
    console.error('Failed to load game data:', error)
  }
}

// 生成问题
const generateQuestions = () => {
  if (!gameData.value.chess || !gameData.value.race || !gameData.value.job) {
    console.error('Game data not loaded')
    return
  }

  const newQuestions = []
  const chessList = gameData.value.chess.data
  const raceList = gameData.value.race.data
  const jobList = gameData.value.job.data

  // 生成10个问题
  while (newQuestions.length < totalQuestions.value) {
    const questionType = Math.random() < 0.33 ? 'chess' : (Math.random() < 0.5 ? 'trait' : 'price')
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
        question: `以下哪个棋子同时具有「${races.join('、')}」特质和「${jobs.join('、')}」职业？`,
        correctAnswer: randomChess.displayName,
        options: generateOptions(chessList, randomChess.displayName)
      }
    } else if (questionType === 'trait') {
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
        question: `「${randomChess.displayName}」具有哪些特质和职业？`,
        correctAnswer: {
          text: `「${races.join('、')}」特质和「${jobs.join('、')}」职业`,
          races: races,
          jobs: jobs
        },
        options: generateTraitOptions(raceList, jobList, races, jobs)
      }
    } else if (questionType === 'price') {
      const randomChess = chessList[Math.floor(Math.random() * chessList.length)]
      const isPriceToChess = Math.random() < 0.5

      if (isPriceToChess) {
        // 根据费用提问棋子
        question = {
          type: 'price',
          question: `以下哪个棋子的费用是 ${randomChess.price} 金币？`,
          correctAnswer: randomChess.displayName,
          options: generatePriceOptions(chessList, randomChess.displayName, randomChess.price)
        }
      } else {
        // 根据棋子提问费用
        question = {
          type: 'price',
          question: `「${randomChess.displayName}」的费用是多少金币？`,
          correctAnswer: randomChess.price,
          options: generatePriceNumberOptions(randomChess.price)
        }
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
    text: `「${correctRaces.join('、')}」特质和「${correctJobs.join('、')}」职业`,
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
      text: `「${randomRaces.map(r => r.name).join('、')}」特质和「${randomJobs.map(j => j.name).join('、')}」职业`,
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

// 生成价格相关的选项（棋子选项）
const generatePriceOptions = (chessList, correctAnswer, price) => {
  const options = [{
    text: correctAnswer,
    value: correctAnswer
  }]
  
  // 只从不同费用的棋子中选择选项
  const differentPriceChess = chessList.filter(chess => 
    chess.price !== price
  )
  
  // 从不同费用棋子中选择
  while (options.length < 4 && differentPriceChess.length > 0) {
    const randomIndex = Math.floor(Math.random() * differentPriceChess.length)
    const option = differentPriceChess[randomIndex].displayName
    if (!options.some(opt => opt.value === option)) {
      options.push({
        text: option,
        value: option
      })
    }
  }
  
  return shuffleArray(options)
}

// 生成价格数字选项
const generatePriceNumberOptions = (correctPrice) => {
  const options = [{
    text: correctPrice,
    value: correctPrice
  }]
  
  // 生成1-6的随机数字作为选项
  const possiblePrices = ['1', '2', '3', '4', '5', '6'].filter(price => price !== correctPrice)
  
  while (options.length < 4 && possiblePrices.length > 0) {
    const randomIndex = Math.floor(Math.random() * possiblePrices.length)
    const option = possiblePrices[randomIndex]
    if (!options.some(opt => opt.value === option)) {
      options.push({
        text: option,
        value: option
      })
    }
  }
  
  return shuffleArray(options)
}

// 修改检查答案方法
const checkAnswer = (answer) => {
  if (showResult.value) return
  selectedAnswer.value = answer
  showResult.value = true
  
  if (currentQuestion.value.type === 'chess') {
    if (answer.value === currentQuestion.value.correctAnswer) {
      score.value++
      // 根据自动跳过设置决定是否自动进入下一题
      if (autoSkip.value) {
        setTimeout(() => {
          nextQuestion()
        }, 1000)
      }
    }
    currentChessDetail.value = gameData.value.chess.data.find(chess => chess.displayName === currentQuestion.value.correctAnswer)
  } else if (currentQuestion.value.type === 'trait') {
    if (answer.text === currentQuestion.value.correctAnswer.text) {
      score.value++
      // 根据自动跳过设置决定是否自动进入下一题
      if (autoSkip.value) {
        setTimeout(() => {
          nextQuestion()
        }, 1000)
      }
    }
    currentTraitDetail.value = currentQuestion.value.correctAnswer
  } else if (currentQuestion.value.type === 'price') {
    if (answer.value === currentQuestion.value.correctAnswer) {
      score.value++
      // 根据自动跳过设置决定是否自动进入下一题
      if (autoSkip.value) {
        setTimeout(() => {
          nextQuestion()
        }, 1000)
      }
    }
    
    // 获取题目中提到的棋子
    const questionText = currentQuestion.value.question
    const chessName = questionText.match(/「(.+?)」/)?.[1] || currentQuestion.value.correctAnswer
    currentChessDetail.value = gameData.value.chess.data.find(chess => chess.displayName === chessName)
  }
}

// 添加显示详情方法
const showDetail = () => {
  if (currentQuestion.value.type === 'chess' || currentQuestion.value.type === 'price') {
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
  initializeData()
})
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}
</style> 