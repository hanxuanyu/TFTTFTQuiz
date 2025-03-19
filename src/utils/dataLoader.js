import chessData13 from '../assets/data/tft13/chess.json'
import jobData13 from '../assets/data/tft13/job.json'
import raceData13 from '../assets/data/tft13/race.json'
import chessData14 from '../assets/data/tft14/chess.json'
import jobData14 from '../assets/data/tft14/job.json'
import raceData14 from '../assets/data/tft14/race.json'

const REMOTE_URLS = {
  tft13: {
    chess: 'https://game.gtimg.cn/images/lol/act/img/tft/js/chess.js',
    job: 'https://game.gtimg.cn/images/lol/act/img/tft/js/job.js',
    race: 'https://game.gtimg.cn/images/lol/act/img/tft/js/race.js'
  }
}

const LOCAL_DATA = {
  tft13: {
    chess: chessData13,
    job: jobData13,
    race: raceData13
  },
  tft14: {
    chess: chessData14,
    job: jobData14,
    race: raceData14
  }
}

/**
 * 从远程URL加载数据
 * @param {string} season - 赛季：'tft13' | 'tft14'
 * @param {string} type - 数据类型：'chess' | 'job' | 'race'
 * @returns {Promise<Object>} 加载的数据
 */
const loadFromRemote = async (season, type) => {
  try {
    const response = await fetch(REMOTE_URLS[season][type])
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const text = await response.text()
    // 移除可能的JavaScript变量声明，只保留JSON部分
    const jsonStr = text.replace(/^var\s+\w+\s*=\s*/, '').trim()
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error(`Failed to load ${season} ${type} data from remote:`, error)
    return null
  }
}

/**
 * 加载指定赛季和类型的数据
 * @param {string} season - 赛季：'tft13' | 'tft14'
 * @param {string} type - 数据类型：'chess' | 'job' | 'race'
 * @returns {Promise<Object>} 加载的数据
 */
export const loadData = async (season, type) => {
  // 如果是S14，直接使用本地数据
  if (season === 'tft14') {
    return LOCAL_DATA[season][type]
  }
  
  // 对于S13，首先尝试从远程加载
  const remoteData = await loadFromRemote(season, type)
  if (remoteData) {
    return remoteData
  }
  
  // 如果远程加载失败，使用本地数据
  return LOCAL_DATA[season][type]
}

/**
 * 获取指定赛季的所有数据
 * @param {string} season - 赛季：'tft13' | 'tft14'
 * @returns {Promise<Object>} 包含所有数据的对象
 */
export const loadAllData = async (season) => {
  const [chess, job, race] = await Promise.all([
    loadData(season, 'chess'),
    loadData(season, 'job'),
    loadData(season, 'race')
  ])
  
  return { chess, job, race }
} 