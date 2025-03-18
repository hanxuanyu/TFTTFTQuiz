import chessData from '../assets/data/tft13/chess.json'
import jobData from '../assets/data/tft13/job.json'
import raceData from '../assets/data/tft13/race.json'

const REMOTE_URLS = {
  chess: 'https://game.gtimg.cn/images/lol/act/img/tft/js/chess.js',
  job: 'https://game.gtimg.cn/images/lol/act/img/tft/js/job.js',
  race: 'https://game.gtimg.cn/images/lol/act/img/tft/js/race.js'
}

const LOCAL_DATA = {
  chess: chessData,
  job: jobData,
  race: raceData
}

/**
 * 从远程URL加载数据
 * @param {string} type - 数据类型：'chess' | 'job' | 'race'
 * @returns {Promise<Object>} 加载的数据
 */
const loadFromRemote = async (type) => {
  try {
    const response = await fetch(REMOTE_URLS[type])
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const text = await response.text()
    // 移除可能的JavaScript变量声明，只保留JSON部分
    const jsonStr = text.replace(/^var\s+\w+\s*=\s*/, '').trim()
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error(`Failed to load ${type} data from remote:`, error)
    return null
  }
}

/**
 * 加载指定类型的数据
 * @param {string} type - 数据类型：'chess' | 'job' | 'race'
 * @returns {Promise<Object>} 加载的数据
 */
export const loadData = async (type) => {
  // 首先尝试从远程加载
  const remoteData = await loadFromRemote(type)
  if (remoteData) {
    return remoteData
  }
  
  // 如果远程加载失败，使用本地数据
  return LOCAL_DATA[type]
}

/**
 * 获取所有数据
 * @returns {Promise<Object>} 包含所有数据的对象
 */
export const loadAllData = async () => {
  const [chess, job, race] = await Promise.all([
    loadData('chess'),
    loadData('job'),
    loadData('race')
  ])
  
  return { chess, job, race }
} 