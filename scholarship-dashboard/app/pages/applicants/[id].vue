<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-800 p-8">
    <div class="max-w-2xl mx-auto">

      <!-- Back -->
      <button @click="navigateTo('/')" class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 mb-6 transition-colors">
        ← Back to Dashboard
      </button>

      <div v-if="applicant">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-800 dark:text-slate-100">{{ applicant.name }}</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Applicant Detail</p>
        </div>

        <!-- Score Breakdown -->
        <div class="bg-white dark:bg-slate-700 rounded-xl shadow overflow-hidden mb-6">
          <div class="bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-200 px-6 py-3 font-semibold text-sm">Score Breakdown</div>
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-slate-600 border-b border-gray-100 dark:border-slate-500">
              <tr>
                <th class="px-6 py-3 text-left font-semibold text-gray-600 dark:text-slate-300">Factor</th>
                <th class="px-6 py-3 text-left font-semibold text-gray-600 dark:text-slate-300">Raw Score</th>
                <th class="px-6 py-3 text-left font-semibold text-gray-600 dark:text-slate-300">Weight</th>
                <th class="px-6 py-3 text-left font-semibold text-gray-600 dark:text-slate-300">Contribution</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-100 dark:border-slate-500">
                <td class="px-6 py-4 text-gray-700 dark:text-slate-300">GPA</td>
                <td class="px-6 py-4 text-gray-600 dark:text-slate-300">{{ applicant.gpa.toFixed(2) }} <span class="text-gray-400 text-xs">({{ gpaNormalized.toFixed(1) }} / 100)</span></td>
                <td class="px-6 py-4 text-gray-600 dark:text-slate-300">30%</td>
                <td class="px-6 py-4 font-medium text-gray-800 dark:text-slate-100">{{ gpaContribution.toFixed(2) }}</td>
              </tr>
              <tr class="border-t border-gray-100 dark:border-slate-500 bg-gray-50 dark:bg-gray-750">
                <td class="px-6 py-4 text-gray-700 dark:text-slate-300">Essay Score</td>
                <td class="px-6 py-4 text-gray-600 dark:text-slate-300">{{ applicant.essayScore }}</td>
                <td class="px-6 py-4 text-gray-600 dark:text-slate-300">25%</td>
                <td class="px-6 py-4 font-medium text-gray-800 dark:text-slate-100">{{ essayContribution.toFixed(2) }}</td>
              </tr>
              <tr class="border-t border-gray-100 dark:border-slate-500">
                <td class="px-6 py-4 text-gray-700 dark:text-slate-300">Financial Need</td>
                <td class="px-6 py-4 text-gray-600 dark:text-slate-300">{{ applicant.financialNeed }}</td>
                <td class="px-6 py-4 text-gray-600 dark:text-slate-300">25%</td>
                <td class="px-6 py-4 font-medium text-gray-800 dark:text-slate-100">{{ financialContribution.toFixed(2) }}</td>
              </tr>
              <tr class="border-t border-gray-100 dark:border-slate-500 bg-gray-50 dark:bg-gray-750">
                <td class="px-6 py-4 text-gray-700 dark:text-slate-300">Extracurricular</td>
                <td class="px-6 py-4 text-gray-600 dark:text-slate-300">{{ applicant.extracurricular }}</td>
                <td class="px-6 py-4 text-gray-600 dark:text-slate-300">20%</td>
                <td class="px-6 py-4 font-medium text-gray-800 dark:text-slate-100">{{ extraContribution.toFixed(2) }}</td>
              </tr>
              <tr class="border-t-2 border-gray-300 dark:border-slate-500 bg-gray-100 dark:bg-slate-600">
                <td class="px-6 py-4 font-bold text-gray-800 dark:text-slate-100" colspan="3">Computed Score</td>
                <td class="px-6 py-4 font-bold text-gray-800 dark:text-slate-100 text-base">{{ totalScore.toFixed(1) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Formula note -->
        <div class="bg-white dark:bg-slate-700 rounded-xl shadow px-6 py-4 text-xs text-gray-400 dark:text-gray-500">
          <span class="font-semibold text-gray-500 dark:text-gray-400">Formula: </span>
          (GPA / 4.0 × 100) × 0.30 + Essay × 0.25 + Financial Need × 0.25 + Extracurricular × 0.20
        </div>
      </div>

      <div v-else class="text-gray-400 text-sm">Applicant not found.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { applicants } from '~/composables/useApplicants'

const route = useRoute()
const id = parseInt(route.params.id as string)

const applicant = applicants.find(a => a.id === id)

const gpaNormalized = computed(() => applicant ? (applicant.gpa / 4.0) * 100 : 0)
const gpaContribution = computed(() => gpaNormalized.value * 0.30)
const essayContribution = computed(() => applicant ? applicant.essayScore * 0.25 : 0)
const financialContribution = computed(() => applicant ? applicant.financialNeed * 0.25 : 0)
const extraContribution = computed(() => applicant ? applicant.extracurricular * 0.20 : 0)
const totalScore = computed(() => gpaContribution.value + essayContribution.value + financialContribution.value + extraContribution.value)
</script>
