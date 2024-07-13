// src/components/stocks/notes.tsx

import React from 'react'

type NotesProps = {
  subject: string
  content: string
}

export const Notes: React.FC<NotesProps> = ({ subject, content }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-2">Apuntes de {subject}</h2>
      <p>{content}</p>
    </div>
  )
}

export const NotesSkeleton: React.FC = () => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-2 animate-pulse">
        Cargando apuntes...
      </h2>
      <div className="animate-pulse bg-gray-200 h-6 w-full mb-2"></div>
      <div className="animate-pulse bg-gray-200 h-6 w-full"></div>
    </div>
  )
}
