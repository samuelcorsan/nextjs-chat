'use client'
import React, { useState } from 'react'

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
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Ejercicios de {subject}</h2>
      <div className="grid grid-cols-5 gap-4 mb-4">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            className="p-2 border rounded-md hover:bg-gray-100"
            onClick={() => setSelectedExercise(exercise)}
          >
            {exercise.title}
          </button>
        ))}
      </div>
      {selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4">{selectedExercise.title}</h3>
            <p className="mb-4">{selectedExercise.question}</p>
            <input
              type="text"
              value={answers[selectedExercise.id] || ''}
              onChange={(e) => handleChange(selectedExercise.id, e.target.value)}
              className="border p-2 w-full mb-4"
              placeholder="Tu respuesta"
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white p-2 rounded mr-2"
                onClick={() => setSelectedExercise(null)}
              >
                Cerrar
              </button>
              <button
                className="bg-green-500 text-white p-2 rounded"
                onClick={handleSubmit}
              >
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
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-2 animate-pulse">
        Cargando ejercicios...
      </h2>
      <div className="grid grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-10 w-full rounded-md"></div>
        ))}
      </div>
    </div>
  )
}