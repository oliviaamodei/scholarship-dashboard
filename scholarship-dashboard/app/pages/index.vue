<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-800 p-8">
    <div class="max-w-5xl mx-auto">

      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-slate-100">Scholarship Dashboard</h1>
        <div class="flex items-center justify-between mt-1">
          <p class="text-gray-500 dark:text-slate-400 leading-none">Applicant Overview</p>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 dark:text-slate-400">{{ isDark ? 'Dark' : 'Light' }}</span>
            <button @click="toggleDark" class="relative inline-flex items-center w-10 h-5 rounded-full transition-colors focus:outline-none"
              :class="isDark ? 'bg-slate-500' : 'bg-gray-300'">
              <span class="inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform"
                :class="isDark ? 'translate-x-5' : 'translate-x-1'" />
            </button>
          </div>
        </div>
      </div>

      <!-- Search & Filter -->
      <div class="flex gap-3 mb-4">
        <input
          v-model="search"
          type="text"
          placeholder="Search by name..."
          class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-slate-500"
        />
        <select v-model="minGpa" class="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
          <option value="">Min GPA</option>
          <option value="3.5">GPA 3.5+</option>
          <option value="3.0">GPA 3.0+</option>
          <option value="2.5">GPA 2.5+</option>
        </select>
        <button @click="resetFilters" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-sm text-gray-500 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
          Reset
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white dark:bg-slate-700 rounded-xl shadow overflow-hidden">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-200">
            <tr>
              <th class="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-500" @click="setSort('name')">
                <div class="flex items-center gap-2"><span>Name</span><span class="text-xs">{{ sortIcon('name') }}</span></div>
              </th>
              <th class="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-500" @click="setSort('gpa')">
                <div class="flex items-center gap-2"><span>GPA</span><span class="text-xs">{{ sortIcon('gpa') }}</span></div>
              </th>
              <th class="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-500" @click="setSort('essayScore')">
                <div class="flex items-center gap-2"><span>Essay Score</span><span class="text-xs">{{ sortIcon('essayScore') }}</span></div>
              </th>
              <th class="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-500" @click="setSort('financialNeed')">
                <div class="flex items-center gap-2"><span>Financial Need</span><span class="text-xs">{{ sortIcon('financialNeed') }}</span></div>
              </th>
              <th class="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-500" @click="setSort('extracurricular')">
                <div class="flex items-center gap-2"><span>Extracurricular</span><span class="text-xs">{{ sortIcon('extracurricular') }}</span></div>
              </th>
              <th class="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-500" @click="setSort('computedScore')">
                <div class="flex items-center gap-2"><span>Computed Score</span><span class="text-xs">{{ sortIcon('computedScore') }}</span></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(applicant, index) in processedApplicants"
              :key="applicant.id"
              :class="index % 2 === 0 ? 'bg-white dark:bg-slate-700' : 'bg-gray-50 dark:bg-slate-600'"
              class="border-t border-gray-100 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
              @click="navigateTo(`/applicants/${applicant.id}`)"
            >
              <td class="px-6 py-4 font-medium text-gray-800 dark:text-slate-100">{{ applicant.name }}</td>
              <td class="px-6 py-4 text-gray-600 dark:text-slate-300">{{ applicant.gpa.toFixed(1) }}</td>
              <td class="px-6 py-4 text-gray-600 dark:text-slate-300">{{ applicant.essayScore }}</td>
              <td class="px-6 py-4 text-gray-600 dark:text-slate-300">{{ applicant.financialNeed }}</td>
              <td class="px-6 py-4 text-gray-600 dark:text-slate-300">{{ applicant.extracurricular }}</td>
              <td class="px-6 py-4 font-semibold text-gray-800 dark:text-slate-100">{{ computeScore(applicant).toFixed(1) }}</td>
            </tr>
            <tr v-if="processedApplicants.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-400">No applicants match your filters.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-xs text-gray-400 mt-3">{{ processedApplicants.length }} applicant(s) shown</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { applicants, computeScore } from '~/composables/useApplicants'

const isDark = ref(false)

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

const search = ref('')
const minGpa = ref('')

function resetFilters() {
  search.value = ''
  minGpa.value = ''
}

type SortKey = 'name' | 'gpa' | 'essayScore' | 'financialNeed' | 'extracurricular' | 'computedScore'
const sortKey = ref<SortKey>('computedScore')
const sortDir = ref<'asc' | 'desc'>('desc')

function setSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = key === 'name' ? 'asc' : 'desc'
  }
}

function sortIcon(key: SortKey) {
  if (sortKey.value !== key) return '↕'
  return sortDir.value === 'asc' ? '↑' : '↓'
}

const processedApplicants = computed(() => {
  let result = [...applicants]

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    result = result.filter(a => a.name.toLowerCase().includes(q))
  }

  if (minGpa.value) {
    result = result.filter(a => a.gpa >= parseFloat(minGpa.value))
  }

  result.sort((a, b) => {
    let valA: number | string
    let valB: number | string

    if (sortKey.value === 'computedScore') {
      valA = computeScore(a)
      valB = computeScore(b)
    } else if (sortKey.value === 'name') {
      valA = a.name
      valB = b.name
    } else {
      valA = a[sortKey.value]
      valB = b[sortKey.value]
    }

    if (valA < valB) return sortDir.value === 'asc' ? -1 : 1
    if (valA > valB) return sortDir.value === 'asc' ? 1 : -1
    return 0
  })

  return result
})
</script>
