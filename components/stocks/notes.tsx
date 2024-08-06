// src/components/stocks/notes.tsx

import React from 'react'

type Subtopic = {
  title: string;
  content: string;
}

type Topic = {
  title: string;
  subtopics: Subtopic[];
}

type NotesProps = {
  subject: string;
  topics: Topic[];
}

export const Notes: React.FC<NotesProps> = ({ subject, topics }) => {
  if (!topics || topics.length === 0) {
    return <div className="p-4 bg-white shadow-md rounded-lg">No hay apuntes disponibles para {subject}.</div>
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Apuntes de {subject}</h1>
      {topics.map((topic, index) => (
        <section key={index} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{topic.title}</h2>
          {topic.subtopics.map((subtopic, subIndex) => (
            <article key={subIndex} className="mb-4">
              <h3 className="text-xl font-medium mb-2">{subtopic.title}</h3>
              <div className="text-gray-700 whitespace-pre-wrap">{subtopic.content}</div>
            </article>
          ))}
        </section>
      ))}
    </div>
  )
}

export const NotesSkeleton: React.FC = () => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-2 animate-pulse">
        Cargando apuntes...
      </h2>
      <div className="animate-pulse bg-gray-200 h-8 w-3/4 mb-6"></div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="mb-8">
          <div className="animate-pulse bg-gray-200 h-6 w-1/2 mb-4"></div>
          {[...Array(3)].map((_, j) => (
            <div key={j} className="mb-4">
              <div className="animate-pulse bg-gray-200 h-5 w-1/3 mb-2"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-full mb-1"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-full mb-1"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-3/4"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
