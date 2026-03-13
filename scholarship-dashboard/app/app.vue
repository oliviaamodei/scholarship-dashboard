<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-primary-700">Scholarship Dashboard</h1>
        <p class="text-gray-500 mt-1">Applicant Overview</p>
      </div>

      <!-- Metric Cards -->
      <!-- <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl shadow p-4 border-t-4 border-primary-500">
          <p class="text-xs text-gray-400 uppercase tracking-wide font-semibold">GPA</p>
          <p class="text-2xl font-bold text-primary-700 mt-1">0.0 – 4.0</p>
          <p class="text-xs text-gray-400 mt-1">Academic performance</p>
        </div>
        <div class="bg-white rounded-xl shadow p-4 border-t-4 border-primary-500">
          <p class="text-xs text-gray-400 uppercase tracking-wide font-semibold">Essay Score</p>
          <p class="text-2xl font-bold text-primary-700 mt-1">0 – 100</p>
          <p class="text-xs text-gray-400 mt-1">Written application quality</p>
        </div>
        <div class="bg-white rounded-xl shadow p-4 border-t-4 border-accent-500">
          <p class="text-xs text-gray-400 uppercase tracking-wide font-semibold">Financial Need</p>
          <p class="text-2xl font-bold text-accent-600 mt-1">0 – 100</p>
          <p class="text-xs text-gray-400 mt-1">Demonstrated financial need</p>
        </div>
        <div class="bg-white rounded-xl shadow p-4 border-t-4 border-accent-500">
          <p class="text-xs text-gray-400 uppercase tracking-wide font-semibold">Extracurricular</p>
          <p class="text-2xl font-bold text-accent-600 mt-1">0 – 100</p>
          <p class="text-xs text-gray-400 mt-1">Activities &amp; involvement</p>
        </div>
      </div> -->

      <!-- Table -->
      <div class="bg-white rounded-xl shadow overflow-hidden">
        <table class="w-full text-sm text-left">
          <thead class="bg-primary-600">
            <tr>
              <th class="px-6 py-4 font-semibold">Name</th>
              <th class="px-6 py-4 font-semibold">GPA</th>
              <th class="px-6 py-4 font-semibold">Essay Score</th>
              <th class="px-6 py-4 font-semibold">Financial Need</th>
              <th class="px-6 py-4 font-semibold">Extracurricular</th>
              <th class="px-6 py-4 font-semibold">Computed Score</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(applicant, index) in sortedApplicants"
              :key="applicant.id"
              :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
              class="border-t border-gray-100 hover:bg-primary-50 transition-colors"
            >
              <td class="px-6 py-4 font-medium text-gray-800">{{ applicant.name }}</td>
              <td class="px-6 py-4 text-gray-600">{{ applicant.gpa.toFixed(1) }}</td>
              <td class="px-6 py-4 text-gray-600">{{ applicant.essayScore }}</td>
              <td class="px-6 py-4 text-gray-600">{{ applicant.financialNeed }}</td>
              <td class="px-6 py-4 text-gray-600">{{ applicant.extracurricular }}</td>
              <td class="px-6 py-4 font-semibold text-accent-600">{{ computeScore(applicant).toFixed(1) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
interface Applicant {
  id: number
  name: string
  gpa: number
  essayScore: number
  financialNeed: number
  extracurricular: number
}

function computeScore(a: Applicant): number {
  const gpaNormalized = (a.gpa / 4.0) * 100
  return (gpaNormalized * 0.30) + (a.essayScore * 0.25) + (a.financialNeed * 0.25) + (a.extracurricular * 0.20)
}

const sortedApplicants = computed(() =>
  [...applicants].sort((a, b) => computeScore(b) - computeScore(a))
)

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
