<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-800 p-8">
    <div class="max-w-5xl mx-auto">

      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-800 dark:text-slate-100">Summary</h1>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 dark:text-slate-400">{{ isDark ? 'Dark' : 'Light' }}</span>
            <button @click="toggleDark" class="relative inline-flex items-center w-10 h-5 rounded-full transition-colors focus:outline-none"
              :class="isDark ? 'bg-slate-500' : 'bg-gray-300'">
              <span class="inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform"
                :class="isDark ? 'translate-x-5' : 'translate-x-1'" />
            </button>
          </div>
        </div>
        <p class="text-gray-500 dark:text-slate-400 mt-1">Score Overview</p>
        <nav class="flex gap-4 text-sm mt-2">
          <NuxtLink to="/" class="text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-100 transition-colors">Dashboard</NuxtLink>
          <span class="font-semibold text-gray-800 dark:text-slate-100">Summary</span>
        </nav>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-4 gap-4 mb-8">
        <div class="bg-white dark:bg-slate-700 rounded-xl shadow p-5">
          <p class="text-xs text-gray-400 dark:text-slate-400 uppercase font-semibold tracking-wide">Total Applicants</p>
          <p class="text-3xl font-bold text-gray-800 dark:text-slate-100 mt-1">{{ applicants.length }}</p>
        </div>
        <div class="bg-white dark:bg-slate-700 rounded-xl shadow p-5">
          <p class="text-xs text-gray-400 dark:text-slate-400 uppercase font-semibold tracking-wide">Average Score</p>
          <p class="text-3xl font-bold text-gray-800 dark:text-slate-100 mt-1">{{ avgScore }}</p>
        </div>
        <div class="bg-white dark:bg-slate-700 rounded-xl shadow p-5">
          <p class="text-xs text-gray-400 dark:text-slate-400 uppercase font-semibold tracking-wide">Highest Score</p>
          <p class="text-3xl font-bold text-gray-800 dark:text-slate-100 mt-1">{{ highScore }}</p>
          <p class="text-xs text-gray-400 dark:text-slate-500 mt-1 truncate">{{ topApplicant?.name }}</p>
        </div>
        <div class="bg-white dark:bg-slate-700 rounded-xl shadow p-5">
          <p class="text-xs text-gray-400 dark:text-slate-400 uppercase font-semibold tracking-wide">Lowest Score</p>
          <p class="text-3xl font-bold text-gray-800 dark:text-slate-100 mt-1">{{ lowScore }}</p>
          <p class="text-xs text-gray-400 dark:text-slate-500 mt-1 truncate">{{ bottomApplicant?.name }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">

        <!-- Top 5 -->
        <div class="bg-white dark:bg-slate-700 rounded-xl shadow overflow-hidden">
          <div class="bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-200 px-6 py-3 font-semibold text-sm">Top 5 Applicants</div>
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-slate-600 border-b border-gray-100 dark:border-slate-500">
              <tr>
                <th class="px-6 py-3 text-left font-semibold text-gray-600 dark:text-slate-300">Rank</th>
                <th class="px-6 py-3 text-left font-semibold text-gray-600 dark:text-slate-300">Name</th>
                <th class="px-6 py-3 text-left font-semibold text-gray-600 dark:text-slate-300">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(applicant, index) in top5"
                :key="applicant.id"
                :class="index % 2 === 0 ? 'bg-white dark:bg-slate-700' : 'bg-gray-50 dark:bg-slate-600'"
                class="border-t border-gray-100 dark:border-slate-500 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer transition-colors"
                @click="navigateTo(`/applicants/${applicant.id}`)"
              >
                <td class="px-6 py-4 text-gray-400 dark:text-slate-400 font-medium">#{{ index + 1 }}</td>
                <td class="px-6 py-4 font-medium text-gray-800 dark:text-slate-100">{{ applicant.name }}</td>
                <td class="px-6 py-4 font-semibold text-gray-800 dark:text-slate-100">{{ computeScore(applicant).toFixed(1) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Score Distribution -->
        <div class="bg-white dark:bg-slate-700 rounded-xl shadow overflow-hidden">
          <div class="bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-200 px-6 py-3 font-semibold text-sm">Score Distribution</div>
          <div class="px-6 py-5 space-y-4">
            <div v-for="bucket in distribution" :key="bucket.label">
              <div class="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 mb-1">
                <span>{{ bucket.label }}</span>
                <span>{{ bucket.count }} applicant{{ bucket.count !== 1 ? 's' : '' }}</span>
              </div>
              <div class="w-full bg-gray-100 dark:bg-slate-600 rounded-full h-4">
                <div
                  class="bg-gray-500 dark:bg-slate-400 h-4 rounded-full transition-all"
                  :style="{ width: bucket.count > 0 ? `${(bucket.count / applicants.length) * 100}%` : '0%' }"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { applicants, computeScore } from '~/composables/useApplicants'
const { isDark, toggleDark } = useDarkMode()

const scores = applicants.map(a => computeScore(a))

const avgScore = computed(() => (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))

const sorted = [...applicants].sort((a, b) => computeScore(b) - computeScore(a))
const top5 = sorted.slice(0, 5)
const topApplicant = sorted[0]
const bottomApplicant = sorted[sorted.length - 1]
const highScore = computeScore(topApplicant).toFixed(1)
const lowScore = computeScore(bottomApplicant).toFixed(1)

const buckets = [
  { label: '90 – 100', min: 90, max: 100 },
  { label: '80 – 89',  min: 80, max: 89.99 },
  { label: '70 – 79',  min: 70, max: 79.99 },
  { label: '60 – 69',  min: 60, max: 69.99 },
  { label: 'Below 60', min: 0,  max: 59.99 },
]

const distribution = buckets.map(b => ({
  label: b.label,
  count: applicants.filter(a => {
    const s = computeScore(a)
    return s >= b.min && s <= b.max
  }).length
}))
</script>
