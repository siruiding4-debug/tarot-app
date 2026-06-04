import type { TarotCard, DrawnCard, Orientation, SpreadType, SpreadDefinition } from '@/types'
import { tarotDeck } from '@/data/tarotCards'

/**
 * Fisher-Yates 洗牌算法
 * 返回全新的打乱后的牌组副本
 */
export function shuffleDeck(deck: TarotCard[] = [...tarotDeck]): TarotCard[] {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * 从牌组中抽取指定数量的牌
 * @param count 抽牌数量
 * @param deck 牌组（默认使用洗牌后的完整牌组）
 * @returns 抽取的牌和剩余牌组
 */
export function drawCards(
  count: number,
  deck?: TarotCard[]
): { drawn: TarotCard[]; remaining: TarotCard[] } {
  const source = deck ?? shuffleDeck()
  const drawn = source.slice(0, count)
  const remaining = source.slice(count)
  return { drawn, remaining }
}

/**
 * 随机决定正位/逆位
 * 各50%概率
 */
export function randomOrientation(): Orientation {
  return Math.random() < 0.5 ? 'upright' : 'reversed'
}

/**
 * 为抽取的牌分配逆位状态和牌阵位置
 */
export function assignDrawnCards(
  cards: TarotCard[],
  spreadType: SpreadType
): DrawnCard[] {
  const positions = getSpreadPositions(spreadType)
  return cards.map((card, index) => ({
    card,
    orientation: randomOrientation(),
    position: index,
    positionName: positions[index]?.name ?? `位置 ${index + 1}`,
    isRevealed: false,
  }))
}

/**
 * 获取牌阵位置定义
 */
export function getSpreadPositions(spreadType: SpreadType): SpreadDefinition['positions'] {
  switch (spreadType) {
    case 'single':
      return [{ index: 0, name: '指引', description: '宇宙给你的今日指引' }]
    case 'three-card':
      return [
        { index: 0, name: '过去', description: '影响当前局面的过去因素' },
        { index: 1, name: '现在', description: '当前所处的状态和核心问题' },
        { index: 2, name: '未来', description: '即将到来的趋势和可能的结果' },
      ]
    case 'triangle':
      return [
        { index: 0, name: '本质', description: '问题的核心本质' },
        { index: 1, name: '阻碍', description: '当前面临的主要障碍' },
        { index: 2, name: '建议', description: '宇宙给你的行动建议' },
      ]
    case 'celtic-cross':
      return [
        { index: 0, name: '现状', description: '当前情况的核心' },
        { index: 1, name: '助力/阻力', description: '帮助或阻碍你的力量' },
        { index: 2, name: '基础', description: '问题的根源和基础' },
        { index: 3, name: '过去', description: '刚刚过去的影响因素' },
        { index: 4, name: '目标', description: '可能的最高目标' },
        { index: 5, name: '近未来', description: '即将发生的事件' },
        { index: 6, name: '自我', description: '你当前的态度和状态' },
        { index: 7, name: '环境', description: '外界环境和他人影响' },
        { index: 8, name: '希望/恐惧', description: '内心的希望或恐惧' },
        { index: 9, name: '结果', description: '综合所有因素后的最终趋势' },
      ]
  }
}

/**
 * 获取牌阵定义
 */
export function getSpreadDefinition(type: SpreadType): SpreadDefinition {
  const positions = getSpreadPositions(type)
  const names: Record<SpreadType, { name: string; description: string }> = {
    single: { name: '单张指引', description: '抽一张牌，获得宇宙最简单的回应' },
    'three-card': {
      name: '三牌阵',
      description: '过去、现在、未来——时间之线揭示因果',
    },
    triangle: {
      name: '圣三角',
      description: '本质、阻碍、建议——三角之力照亮前路',
    },
    'celtic-cross': {
      name: '凯尔特十字',
      description: '十张牌全面解构——最深邃的灵魂探索',
    },
  }
  return {
    type,
    name: names[type].name,
    description: names[type].description,
    cardCount: positions.length,
    positions,
  }
}
