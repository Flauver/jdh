<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import type { CardStats, KeyStats } from './useReview'
import type { ZigenCard } from '../share'

const props = defineProps<{
    cards: readonly ZigenCard[]
    cardStats: CardStats[]
    keyStats: KeyStats[]
}>()

const showPanel = ref(false)
const zigenFontClass = inject('font') || 'oppo-sans'

const sortedCardStats = computed(() => {
    return [...props.cardStats]
        .map((stats, index) => ({ ...stats, card: props.cards[index] }))
        .filter(s => s.total > 0)
        .sort((a, b) => b.errorRate - a.errorRate)
})

const keyboardLayout = {
    qwerty: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    asdf: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    zxcv: ['z', 'x', 'c', 'v', 'b', 'n', 'm']
}

const getKeyStatsByKey = (key: string): KeyStats | undefined => {
    return props.keyStats.find(s => s.key.toLowerCase() === key.toLowerCase())
}

const getErrorColor = (errorRate: number): string => {
    if (errorRate === 0) return 'bg-green-100 text-green-800'
    if (errorRate < 20) return 'bg-green-200 text-green-700'
    if (errorRate < 40) return 'bg-yellow-200 text-yellow-700'
    if (errorRate < 60) return 'bg-orange-200 text-orange-700'
    return 'bg-red-200 text-red-700'
}

const getKeyBackgroundColor = (errorRate: number): string => {
    if (errorRate === 0) return 'bg-green-500'
    if (errorRate < 20) return 'bg-green-400'
    if (errorRate < 40) return 'bg-yellow-400'
    if (errorRate < 60) return 'bg-orange-400'
    return 'bg-red-400'
}

const totalErrors = computed(() => props.keyStats.reduce((sum, s) => sum + s.errors, 0))
const totalAttempts = computed(() => props.keyStats.reduce((sum, s) => sum + s.total, 0))
const overallErrorRate = computed(() => totalAttempts.value > 0 
    ? (totalErrors.value / totalAttempts.value) * 100 
    : 0)
</script>

<template>
    <div class="fixed top-4 right-4 z-50">
        <button
            @click="showPanel = !showPanel"
            class="btn btn-primary btn-sm"
        >
            {{ showPanel ? '隐藏统计' : '显示统计' }}
        </button>
    </div>

    <div
        v-if="showPanel"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4"
        @click.self="showPanel = false"
    >
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-auto p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-800 dark:text-white">键入统计</h2>
                <button @click="showPanel = false" class="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">错误键位分布</h3>
                    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                        <div class="flex justify-center mb-2">
                            <div
                                v-for="key in keyboardLayout.qwerty"
                                :key="key"
                                class="w-10 h-10 flex items-center justify-center rounded m-0.5 text-white font-bold transition-all"
                                :class="getKeyBackgroundColor(getKeyStatsByKey(key)?.errorRate || 0)"
                                :title="getKeyStatsByKey(key) ? `${key}: ${getKeyStatsByKey(key)!.errorRate.toFixed(1)}% (${getKeyStatsByKey(key)!.errors}/${getKeyStatsByKey(key)!.total})` : `${key}: 无数据`"
                            >
                                {{ key.toUpperCase() }}
                            </div>
                        </div>
                        <div class="flex justify-center mb-2 pl-8">
                            <div
                                v-for="key in keyboardLayout.asdf"
                                :key="key"
                                class="w-10 h-10 flex items-center justify-center rounded m-0.5 text-white font-bold transition-all"
                                :class="getKeyBackgroundColor(getKeyStatsByKey(key)?.errorRate || 0)"
                                :title="getKeyStatsByKey(key) ? `${key}: ${getKeyStatsByKey(key)!.errorRate.toFixed(1)}% (${getKeyStatsByKey(key)!.errors}/${getKeyStatsByKey(key)!.total})` : `${key}: 无数据`"
                            >
                                {{ key.toUpperCase() }}
                            </div>
                        </div>
                        <div class="flex justify-center pl-16">
                            <div
                                v-for="key in keyboardLayout.zxcv"
                                :key="key"
                                class="w-10 h-10 flex items-center justify-center rounded m-0.5 text-white font-bold transition-all"
                                :class="getKeyBackgroundColor(getKeyStatsByKey(key)?.errorRate || 0)"
                                :title="getKeyStatsByKey(key) ? `${key}: ${getKeyStatsByKey(key)!.errorRate.toFixed(1)}% (${getKeyStatsByKey(key)!.errors}/${getKeyStatsByKey(key)!.total})` : `${key}: 无数据`"
                            >
                                {{ key.toUpperCase() }}
                            </div>
                        </div>
                        <div class="flex justify-center mt-4 text-sm text-gray-600 dark:text-gray-300">
                            <span class="flex items-center mr-4">
                                <span class="w-4 h-4 bg-green-400 rounded mr-1"></span> 0-20%
                            </span>
                            <span class="flex items-center mr-4">
                                <span class="w-4 h-4 bg-yellow-400 rounded mr-1"></span> 20-40%
                            </span>
                            <span class="flex items-center mr-4">
                                <span class="w-4 h-4 bg-orange-400 rounded mr-1"></span> 40-60%
                            </span>
                            <span class="flex items-center">
                                <span class="w-4 h-4 bg-red-400 rounded mr-1"></span> &gt;60%
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">综合统计</h3>
                    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="text-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                                <div class="text-2xl font-bold text-blue-600">{{ totalAttempts }}</div>
                                <div class="text-sm text-gray-500">总练习次数</div>
                            </div>
                            <div class="text-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                                <div class="text-2xl font-bold text-red-600">{{ totalErrors }}</div>
                                <div class="text-sm text-gray-500">错误次数</div>
                            </div>
                            <div class="text-center p-3 bg-white dark:bg-gray-600 rounded-lg col-span-2">
                                <div class="text-3xl font-bold" :class="getErrorColor(overallErrorRate).split(' ')[1]">
                                    {{ overallErrorRate.toFixed(1) }}%
                                </div>
                                <div class="text-sm text-gray-500">整体错误率</div>
                            </div>
                        </div>
                    </div>

                    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">字根错误率排行</h3>
                    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-h-60 overflow-auto">
                        <div v-if="sortedCardStats.length === 0" class="text-center text-gray-500 py-4">
                            暂无数据
                        </div>
                        <div v-else class="space-y-2">
                            <div
                                v-for="(stat, index) in sortedCardStats.slice(0, 10)"
                                :key="index"
                                class="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded"
                            >
                                <div class="flex items-center">
                                    <span :class="['text-lg font-bold mr-3', zigenFontClass]">{{ stat.card.name }}</span>
                                    <span class="text-sm text-gray-500">→ {{ stat.key }}</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="text-sm mr-2 text-gray-500">{{ stat.errors }}/{{ stat.total }}</span>
                                    <span
                                        class="px-2 py-0.5 rounded text-sm font-medium"
                                        :class="getErrorColor(stat.errorRate)"
                                    >
                                        {{ stat.errorRate.toFixed(1) }}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
