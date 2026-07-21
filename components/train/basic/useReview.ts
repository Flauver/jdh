import { useLocalStorage } from "@vueuse/core";
import { shallowRef } from 'vue'

type Record = [count: number, index: number]
type ErrorStats = [errors: number, total: number]

export interface CardStats {
    key: string
    errors: number
    total: number
    errorRate: number
}

export interface KeyStats {
    key: string
    errors: number
    total: number
    errorRate: number
}

export function useReview<T extends { key: string }>(name: string, cards: readonly T[]) {
    if (cards.length < 100) throw new Error(`卡片至少100张：${cards.length}`);

    const emptyRecord = () => Array.from({ length: cards.length }, (_, i) => [-1, i] as Record)
    const storageRef = useLocalStorage<Record[]>(`yima_${name}_records`, emptyRecord)

    const emptyStats = () => Array.from({ length: cards.length }, () => [0, 0] as ErrorStats)
    const statsRef = useLocalStorage<ErrorStats[]>(`yima_${name}_stats`, emptyStats)

    const cardLength = cards.length
    if (storageRef.value.length < cardLength) {
        for (let i = storageRef.value.length; i < cardLength; i++) {
            storageRef.value.push([-1, i])
        }
    } else if (storageRef.value.length > cardLength) {
        storageRef.value = storageRef.value.filter(v => v[1] < cardLength)
    }

    if (statsRef.value.length < cardLength) {
        for (let i = statsRef.value.length; i < cardLength; i++) {
            statsRef.value.push([0, 0])
        }
    } else if (statsRef.value.length > cardLength) {
        statsRef.value = statsRef.value.slice(0, cardLength)
    }

    storageRef.value.sort((a, b) => {
        if (a[0] === 8 && b[0] < 8)
            return 1
        if (b[0] === 8 && a[0] < 8)
            return -1
        return 0
    })

    const scanProgress = () => storageRef.value.reduce((p, c) => p + Number(c[0] > 1), 0)
    const progress = shallowRef(scanProgress())
    const card = shallowRef<T>(cards[storageRef.value[0][1]])
    const isFirst = shallowRef(storageRef.value[0][0] === -1)

    const restart = () => {
        storageRef.value = emptyRecord()
        if (statsRef.value) {
            statsRef.value = emptyStats()
        }
        progress.value = 0
        isFirst.value = true
        card.value = cards[0]
    }

    const getCardStats = (): CardStats[] => {
        if (!statsRef.value) {
            return cards.map(card => ({
                key: card.key,
                errors: 0,
                total: 0,
                errorRate: 0
            }))
        }
        return cards.map((card, index) => {
            const [errors, total] = statsRef.value[index] || [0, 0]
            return {
                key: card.key,
                errors,
                total,
                errorRate: total > 0 ? (errors / total) * 100 : 0
            }
        })
    }

    const getKeyStats = (): KeyStats[] => {
        if (!statsRef.value) {
            return []
        }
        const keyMap = new Map<string, ErrorStats>()
        cards.forEach((card, index) => {
            const [errors, total] = statsRef.value[index] || [0, 0]
            const existing = keyMap.get(card.key) || [0, 0]
            keyMap.set(card.key, [existing[0] + errors, existing[1] + total])
        })
        return Array.from(keyMap.entries()).map(([key, [errors, total]]) => ({
            key,
            errors,
            total,
            errorRate: total > 0 ? (errors / total) * 100 : 0
        }))
    }

    const maxIndex = cards.length - 1
    const moveSteps = [3, 9, 21, 36, 60, 100];
    const maxMoveStepsIndex = moveSteps.length - 1

    const answer = (correct: boolean) => {
        const currentIndex = storageRef.value[0][1]
        if (statsRef.value) {
            const [errors, total] = statsRef.value[currentIndex] || [0, 0]
            statsRef.value[currentIndex] = [errors + (correct ? 0 : 1), total + 1]
        }

        if (!correct) {
            if (storageRef.value[0][0] > 1)
                progress.value -= 1
            storageRef.value[0][0] = -1
            isFirst.value = true
            return
        }

        const firstRecord = storageRef.value[0]
        const firstCount = ++firstRecord[0]
        if (firstCount === 2) {
            progress.value += 1
        }

        let step = 0
        if (firstCount > maxMoveStepsIndex) {
            firstRecord[0] = 8
            step = maxIndex
        } else {
            step = moveSteps[firstCount]
            if (step > maxIndex)
                step = maxIndex
        }

        storageRef.value.copyWithin(0, 1, step + 1)
        storageRef.value[step] = firstRecord

        card.value = cards[storageRef.value[0][1]]
        isFirst.value = storageRef.value[0][0] === -1
    }

    return { progress, card, isFirst, restart, answer, getCardStats, getKeyStats }
}