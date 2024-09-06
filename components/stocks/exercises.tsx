'use client'

import React, { useState } from 'react'
import { X, Send, ChevronRight } from 'lucide-react'

type Exercise = {
  id: string
  title: string
  question: string
  answer: string
}

type ExercisesProps = {
  subject: string
  exercises: Exercise[]
}

export const Exercises: React.FC<ExercisesProps> = ({ subject, exercises }) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = () => {
    console.log('Respuestas enviadas:', answers)
    // Aquí puedes agregar la lógica para enviar las respuestas al servidor o procesarlas de alguna manera
  }

  return (
    <div className="p-6 bg-gray-900 text-gray-100 shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Ejercicios de {subject}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            className="p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-between"
            onClick={() => setSelectedExercise(exercise)}
          >
            <span className="text-sm">{exercise.title}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ))}
      </div>
      {selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{selectedExercise.title}</h3>
              <button
                className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
                onClick={() => setSelectedExercise(null)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="mb-4 text-gray-300">{selectedExercise.question}</p>
            <input
              type="text"
              value={answers[selectedExercise.id] || ''}
              onChange={(e) => handleChange(selectedExercise.id, e.target.value)}
              className="bg-gray-700 text-gray-100 border border-gray-600 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu respuesta"
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-600 text-white p-2 rounded-lg mr-2 hover:bg-blue-700 transition-colors duration-200 flex items-center"
                onClick={() => setSelectedExercise(null)}
              >
                <X className="w-4 h-4 mr-2" />
                Cerrar
              </button>
              <button
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                onClick={handleSubmit}
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar respuesta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export const ExercisesSkeleton: React.FC = () => {
  return (
    <div className="p-6 bg-gray-900 text-gray-100 shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-6 animate-pulse">
        Cargando ejercicios...
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-800 h-12 w-full rounded-lg"></div>
        ))}
      </div>
    </div>
  )
}