<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-800 p-8">
    <div class="max-w-6xl mx-auto">

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

      <!-- Search, Filter & Add -->
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
        <button @click="showAddModal = true" class="px-4 py-2 rounded-lg bg-gray-700 dark:bg-slate-600 text-white text-sm hover:bg-gray-600 dark:hover:bg-slate-500 transition-colors">
          + Add Applicant
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white dark:bg-slate-700 rounded-xl shadow overflow-hidden">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-200">
            <tr>
              <th class="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-500" @click="setSort('name')">
                <div class="flex items-center gap-2"><span>Name</span><span class="text-xs">{{ sortIcon('name') }}</span></div>
              </th>
              <th class="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-500" @click="setSort('gpa')">
                <div class="flex items-center gap-2"><span>GPA</span><span class="text-xs">{{ sortIcon('gpa') }}</span></div>
              </th>
              <th class="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-500" @click="setSort('essayScore')">
                <div class="flex items-center gap-2"><span>Essay Score</span><span class="text-xs">{{ sortIcon('essayScore') }}</span></div>
              </th>
              <th class="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-500" @click="setSort('financialNeed')">
                <div class="flex items-center gap-2"><span>Financial Need</span><span class="text-xs">{{ sortIcon('financialNeed') }}</span></div>
              </th>
              <th class="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-500" @click="setSort('extracurricular')">
                <div class="flex items-center gap-2"><span>Extracurricular</span><span class="text-xs">{{ sortIcon('extracurricular') }}</span></div>
              </th>
              <th class="px-6 py-3 font-semibold cursor-pointer hover:bg-gray-300 dark:hover:bg-slate-500" @click="setSort('computedScore')">
                <div class="flex items-center gap-2"><span>Computed Score</span><span class="text-xs">{{ sortIcon('computedScore') }}</span></div>
              </th>
              <th class="px-6 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(applicant, index) in processedApplicants"
              :key="applicant.id"
              :class="index % 2 === 0 ? 'bg-white dark:bg-slate-700' : 'bg-gray-50 dark:bg-slate-600'"
              class="border-t border-gray-100 dark:border-slate-600 transition-colors"
              :style="editingId !== applicant.id ? 'cursor:pointer' : ''"
              @click="editingId !== applicant.id && navigateTo(`/applicants/${applicant.id}`)"
            >
              <!-- Edit mode -->
              <template v-if="editingId === applicant.id">
                <td class="px-3 py-2"><input v-model="editForm.name" class="w-full px-2 py-1 rounded border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm focus:outline-none" /></td>
                <td class="px-3 py-2"><input v-model.number="editForm.gpa" type="number" min="0" max="4" step="0.01" class="w-20 px-2 py-1 rounded border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm focus:outline-none" /></td>
                <td class="px-3 py-2"><input v-model.number="editForm.essayScore" type="number" min="0" max="100" class="w-20 px-2 py-1 rounded border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm focus:outline-none" /></td>
                <td class="px-3 py-2"><input v-model.number="editForm.financialNeed" type="number" min="0" max="100" class="w-20 px-2 py-1 rounded border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm focus:outline-none" /></td>
                <td class="px-3 py-2"><input v-model.number="editForm.extracurricular" type="number" min="0" max="100" class="w-20 px-2 py-1 rounded border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm focus:outline-none" /></td>
                <td class="px-3 py-2 text-gray-500 dark:text-slate-400 text-sm">{{ computeScore(editForm).toFixed(1) }}</td>
                <td class="px-3 py-2 text-center" @click.stop>
                  <button @click="saveEdit(applicant.id)" class="text-green-600 hover:text-green-500 mr-2 font-bold text-base" title="Save">✓</button>
                  <button @click="cancelEdit" class="text-gray-400 hover:text-gray-600 font-bold text-base" title="Cancel">✕</button>
                </td>
              </template>

              <!-- View mode -->
              <template v-else>
                <td class="px-6 py-4 font-medium text-gray-800 dark:text-slate-100">{{ applicant.name }}</td>
                <td class="px-6 py-4 text-gray-600 dark:text-slate-300">{{ applicant.gpa.toFixed(1) }}</td>
                <td class="px-6 py-4 text-gray-600 dark:text-slate-300">{{ applicant.essayScore }}</td>
                <td class="px-6 py-4 text-gray-600 dark:text-slate-300">{{ applicant.financialNeed }}</td>
                <td class="px-6 py-4 text-gray-600 dark:text-slate-300">{{ applicant.extracurricular }}</td>
                <td class="px-6 py-4 font-semibold text-gray-800 dark:text-slate-100">{{ computeScore(applicant).toFixed(1) }}</td>
                <td class="px-6 py-4 text-center" @click.stop>
                  <button @click="startEdit(applicant)" class="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 mr-3" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z" /></svg>
                  </button>
                  <button @click="deleteApplicant(applicant.id)" class="text-gray-400 hover:text-red-500 dark:hover:text-red-400" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h6a1 1 0 011 1v1a1 1 0 01-1 1H9z" /></svg>
                  </button>
                </td>
              </template>
            </tr>
            <tr v-if="processedApplicants.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-400">No applicants match your filters.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-xs text-gray-400 mt-3">{{ processedApplicants.length }} applicant(s) shown</p>
    </div>

    <!-- Add Applicant Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50" @click.self="showAddModal = false">
      <div class="bg-white dark:bg-slate-700 rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 class="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4">Add Applicant</h2>
        <div class="space-y-3">
          <div>
            <label class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Name</label>
            <input v-model="newForm.name" type="text" placeholder="Full name"
              class="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">GPA (0–4)</label>
              <input v-model.number="newForm.gpa" type="number" min="0" max="4" step="0.01" placeholder="0.00"
                class="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Essay Score (0–100)</label>
              <input v-model.number="newForm.essayScore" type="number" min="0" max="100" placeholder="0"
                class="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Financial Need (0–100)</label>
              <input v-model.number="newForm.financialNeed" type="number" min="0" max="100" placeholder="0"
                class="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Extracurricular (0–100)</label>
              <input v-model.number="newForm.extracurricular" type="number" min="0" max="100" placeholder="0"
                class="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-5">
          <button @click="showAddModal = false" class="px-4 py-2 text-sm text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors">Cancel</button>
          <button @click="addApplicant" class="px-4 py-2 text-sm bg-gray-700 dark:bg-slate-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-slate-500 transition-colors">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { applicants as sourceApplicants, computeScore } from '~/composables/useApplicants'
import type { Applicant } from '~/composables/useApplicants'

// --- Dark mode ---
const isDark = ref(false)
function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

// --- Reactive applicants list ---
const applicants = ref<Applicant[]>(sourceApplicants.map(a => ({ ...a })))

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

// --- Processed list ---
const processedApplicants = computed(() => {
  let result = [...applicants.value]

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
    if (sortKey.value === 'computedScore') { valA = computeScore(a); valB = computeScore(b) }
    else if (sortKey.value === 'name') { valA = a.name; valB = b.name }
    else { valA = a[sortKey.value]; valB = b[sortKey.value] }
    if (valA < valB) return sortDir.value === 'asc' ? -1 : 1
    if (valA > valB) return sortDir.value === 'asc' ? 1 : -1
    return 0
  })

  return result
})

// --- Edit ---
const editingId = ref<number | null>(null)
const editForm = ref<Applicant>({ id: 0, name: '', gpa: 0, essayScore: 0, financialNeed: 0, extracurricular: 0 })

function startEdit(applicant: Applicant) {
  editingId.value = applicant.id
  editForm.value = { ...applicant }
}

function saveEdit(id: number) {
  const index = applicants.value.findIndex(a => a.id === id)
  if (index !== -1) applicants.value[index] = { ...editForm.value }
  editingId.value = null
}

function cancelEdit() {
  editingId.value = null
}

// --- Delete ---
function deleteApplicant(id: number) {
  applicants.value = applicants.value.filter(a => a.id !== id)
}

// --- Add ---
const showAddModal = ref(false)
const newForm = ref({ name: '', gpa: 0, essayScore: 0, financialNeed: 0, extracurricular: 0 })

function addApplicant() {
  if (!newForm.value.name.trim()) return
  const newId = Math.max(0, ...applicants.value.map(a => a.id)) + 1
  applicants.value.push({ id: newId, ...newForm.value })
  newForm.value = { name: '', gpa: 0, essayScore: 0, financialNeed: 0, extracurricular: 0 }
  showAddModal.value = false
}
</script>
