<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-5xl mx-auto">

      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Scholarship Dashboard</h1>
        <p class="text-gray-500 mt-1">Applicant Overview</p>
      </div>

      <!-- Search & Filter -->
      <div class="flex gap-3 mb-4">
        <input
          v-model="search"
          type="text"
          placeholder="Search by name..."
          class="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <select v-model="minGpa" class="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
          <option value="">Min GPA</option>
          <option value="3.5">GPA 3.5+</option>
          <option value="3.0">GPA 3.0+</option>
          <option value="2.5">GPA 2.5+</option>
        </select>
        <button @click="resetFilters" class="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-500 hover:bg-gray-100 transition-colors">
          Reset
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow overflow-hidden">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-200 text-gray-700">
            <tr>
              <th class="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-300" @click="setSort('name')">
                <div class="flex items-center gap-2">
                  <span>Name</span><span class="text-xs">{{ sortIcon('name') }}</span>
                </div>
              </th>
              <th class="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-300" @click="setSort('gpa')">
                <div class="flex items-center gap-2">
                  <span>GPA</span><span class="text-xs">{{ sortIcon('gpa') }}</span>
                </div>
              </th>
              <th class="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-300" @click="setSort('essayScore')">
                <div class="flex items-center gap-2">
                  <span>Essay Score</span><span class="text-xs">{{ sortIcon('essayScore') }}</span>
                </div>
              </th>
              <th class="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-300" @click="setSort('financialNeed')">
                <div class="flex items-center gap-2">
                  <span>Financial Need</span><span class="text-xs">{{ sortIcon('financialNeed') }}</span>
                </div>
              </th>
              <th class="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-300" @click="setSort('extracurricular')">
                <div class="flex items-center gap-2">
                  <span>Extracurricular</span><span class="text-xs">{{ sortIcon('extracurricular') }}</span>
                </div>
              </th>
              <th class="px-4 py-3 font-semibold cursor-pointer hover:bg-gray-300" @click="setSort('computedScore')">
                <div class="flex items-center gap-2">
                  <span>Computed Score</span><span class="text-xs">{{ sortIcon('computedScore') }}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(applicant, index) in processedApplicants"
              :key="applicant.id"
              :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
              class="border-t border-gray-100 hover:bg-gray-100 transition-colors"
            >
              <td class="px-6 py-4 font-medium text-gray-800">{{ applicant.name }}</td>
              <td class="px-6 py-4 text-gray-600">{{ applicant.gpa.toFixed(1) }}</td>
              <td class="px-6 py-4 text-gray-600">{{ applicant.essayScore }}</td>
              <td class="px-6 py-4 text-gray-600">{{ applicant.financialNeed }}</td>
              <td class="px-6 py-4 text-gray-600">{{ applicant.extracurricular }}</td>
              <td class="px-6 py-4 font-semibold text-gray-800">{{ computeScore(applicant).toFixed(1) }}</td>
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

interface Applicant {
  id: number
  name: string
  gpa: number
  essayScore: number
  financialNeed: number
  extracurricular: number
}

// --- Search & Filter ---
const search = ref('')
const minGpa = ref('')

function resetFilters() {
  search.value = ''
  minGpa.value = ''
}

// --- Sort ---
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

// --- Score ---
function computeScore(a: Applicant): number {
  const gpaNormalized = (a.gpa / 4.0) * 100
  return (gpaNormalized * 0.30) + (a.essayScore * 0.25) + (a.financialNeed * 0.25) + (a.extracurricular * 0.20)
}

// --- Combined computed ---
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

const applicants: Applicant[] = [
  { id: 1,  name: 'Jordan Mitchell',   gpa: 3.8,  essayScore: 88, financialNeed: 72, extracurricular: 91 },
  { id: 2,  name: 'Priya Sharma',      gpa: 3.95, essayScore: 95, financialNeed: 65, extracurricular: 85 },
  { id: 3,  name: 'Marcus Williams',   gpa: 3.2,  essayScore: 78, financialNeed: 90, extracurricular: 70 },
  { id: 4,  name: 'Sofia Rodriguez',   gpa: 3.6,  essayScore: 82, financialNeed: 88, extracurricular: 76 },
  { id: 5,  name: 'Aiden Chen',        gpa: 4.0,  essayScore: 91, financialNeed: 45, extracurricular: 95 },
  { id: 6,  name: 'Taylor Brooks',     gpa: 2.9,  essayScore: 70, financialNeed: 95, extracurricular: 60 },
  { id: 7,  name: 'Zara Okafor',       gpa: 3.7,  essayScore: 86, financialNeed: 78, extracurricular: 88 },
  { id: 8,  name: 'Ethan Nguyen',      gpa: 3.5,  essayScore: 74, financialNeed: 82, extracurricular: 65 },
  { id: 9,  name: 'Mia Thompson',      gpa: 3.85, essayScore: 92, financialNeed: 55, extracurricular: 80 },
  { id: 10, name: 'Caleb Washington',  gpa: 3.1,  essayScore: 68, financialNeed: 91, extracurricular: 73 },
  { id: 11, name: 'Hannah Lee',        gpa: 3.9,  essayScore: 89, financialNeed: 60, extracurricular: 92 },
  { id: 12, name: 'Diego Fernandez',   gpa: 3.3,  essayScore: 80, financialNeed: 85, extracurricular: 68 },
  { id: 13, name: 'Aaliyah Jackson',   gpa: 3.65, essayScore: 84, financialNeed: 76, extracurricular: 82 },
  { id: 14, name: 'Noah Patel',        gpa: 3.45, essayScore: 77, financialNeed: 70, extracurricular: 90 },
  { id: 15, name: 'Emma Kowalski',     gpa: 3.75, essayScore: 90, financialNeed: 68, extracurricular: 78 },
]
</script>
