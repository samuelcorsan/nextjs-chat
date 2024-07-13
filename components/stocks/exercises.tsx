'use client'
import React, { useState } from 'react'

type Exercise = {
  question: string
  answer: string
}

type ExercisesProps = {
  exercises: Exercise[]
}

export const Exercises: React.FC<ExercisesProps> = ({ exercises }) => {
  const [answers, setAnswers] = useState<string[]>(
    new Array(exercises.length).fill('')
  )

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    console.log('Respuestas enviadas:', answers)
    // Aquí puedes agregar la lógica para enviar las respuestas al servidor o procesarlas de alguna manera
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Ejercicios</h2>
      {exercises.map((exercise, index) => (
        <div key={index} className="mb-4">
          <p className="font-semibold mb-2">Pregunta {index + 1}:</p>
          <p className="mb-2">{exercise.question}</p>
          <input
            type="text"
            value={answers[index]}
            onChange={e => handleChange(index, e.target.value)}
            className="border p-2 w-full mb-2"
            placeholder="Tu respuesta"
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Enviar respuestas
      </button>
    </div>
  )
}

export const ExercisesSkeleton: React.FC = () => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-2 animate-pulse">
        Cargando ejercicios...
      </h2>
      <div className="animate-pulse bg-gray-200 h-6 w-full mb-2"></div>
      <div className="animate-pulse bg-gray-200 h-6 w-full mb-2"></div>
      <div className="animate-pulse bg-gray-200 h-6 w-full mb-2"></div>
      <div className="animate-pulse bg-gray-200 h-6 w-full"></div>
    </div>
  )
}
