import 'server-only'
import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  streamUI,
  createStreamableValue
} from 'ai/rsc'
import { openai } from '@ai-sdk/openai'
import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage,
} from '@/components/stocks'
import { z } from 'zod'
import { Notes, NotesSkeleton } from '@/components/stocks/notes'
import { Exercises, ExercisesSkeleton } from '@/components/stocks/exercises'
import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  sleep,
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat, Message } from '@/lib/types'
import { auth } from '@/auth'

type Exercise = {
  id: string
  title: string
  question: string
  answer: string
}

type AIState = {
  chatId: string
  messages: Message[]
}

async function confirmPurchase(symbol: string, price: number, amount: number) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Purchasing {amount} ${symbol}...
      </p>
    </div>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000)

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
          Purchasing {amount} ${symbol}... working on it...
        </p>
      </div>
    )

    await sleep(1000)

    purchasing.done(
      <div>
        <p className="mb-2">
          You have successfully purchased {amount} ${symbol}. Total cost:{' '}
          {formatNumber(amount * price)}
        </p>
      </div>
    )

    systemMessage.done(
      <SystemMessage>
        You have purchased {amount} shares of {symbol} at ${price}. Total cost ={' '}
        {formatNumber(amount * price)}.
      </SystemMessage>
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'system',
          content: `[User has purchased ${amount} shares of ${symbol} at ${price}. Total cost = ${
            amount * price
          }]`
        }
      ]
    })
  })

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value
    }
  }
}

async function submitUserMessage(content: string) {
  'use server'
  const aiState = getMutableAIState<typeof AI>()
  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const result = await streamUI({
    model: openai('gpt-4o'),
    initial: <SpinnerMessage />,
    system: `\
    Eres un asistente de IA especializado en ayudar a los estudiantes a prepararse para la EBAU (Evaluación de Bachillerato para el Acceso a la Universidad) en España para el curso 2024-2025. Tu función principal es proporcionar apuntes detallados, ejercicios y responder preguntas sobre el bachillerato y la EBAU.
    Definición de Apuntes:
    Los apuntes son resúmenes detallados y estructurados de un tema específico. Deben ser completos, claros y útiles para el estudio. Los apuntes ideales tienen las siguientes características:
    1. Son extensos, cubriendo todo el tema en profundidad.
    2. Están bien organizados, con una estructura clara de temas y subtemas.
    3. Incluyen definiciones, fórmulas, conceptos clave y ejemplos cuando sea relevante.
    4. Son específicos para el nivel de EBAU, cubriendo todos los puntos importantes del temario.
    Instrucciones para la generación de apuntes:
    1. Cuando un usuario solicite apuntes, primero asegúrate de que han especificado claramente el tema y la asignatura.
    2. Si la solicitud es vaga o poco clara, pide más detalles. Por ejemplo:
      - "¿Podrías especificar de qué asignatura y tema en concreto necesitas los apuntes?"
      - "Para proporcionarte los mejores apuntes, ¿podrías decirme qué aspectos específicos del tema te interesan más?"
    3. Una vez que tengas clara la solicitud, genera apuntes extensos y detallados. No te limites en longitud; los apuntes completos son más útiles que los resúmenes breves.
    4. Utiliza la función \`listNotes\` para presentar los apuntes de manera estructurada y fácil de leer.
    Formato de los apuntes:
1. Estructura jerárquica:
   - Divide el tema en subtemas principales.
   - Para cada subtema, identifica y explica los conceptos clave.
   - Proporciona definiciones claras, fórmulas relevantes y ejemplos para cada concepto.
2. Contenido detallado:
   - Ofrece explicaciones claras y concisas de cada concepto.
   - Incluye todas las fórmulas relevantes, explicando el significado de cada variable.
   - Proporciona ejemplos prácticos o aplicaciones en la vida real.
   - Establece conexiones con otros temas o conceptos relacionados cuando sea pertinente.
3. Nivel de lenguaje:
   - Usa un lenguaje apropiado para estudiantes de EBAU, evitando simplificaciones excesivas pero manteniendo la claridad.
   - Define términos técnicos cuando se introduzcan por primera vez.
4. Preparación para exámenes:
   - Destaca los puntos clave que los estudiantes deben recordar.
   - Señala errores comunes y cómo evitarlos.
   - Incluye estrategias para abordar problemas típicos de EBAU relacionados con el tema.
5. Contextualización:
   - Menciona experimentos históricos o descubrimientos relevantes que ayuden a entender la importancia del tema.
6. Adaptación al currículo:
   - Ajusta la longitud y profundidad del contenido según la relevancia del tema en el currículo de EBAU.
Recuerda: Tu objetivo es proporcionar apuntes completos, precisos y útiles que ayuden a los estudiantes a comprender profundamente el tema y prepararse eficazmente para la EBAU.
    Otras instrucciones:
    - Si el usuario solicita apuntes de una asignatura, utiliza la función \`listNotes\` para generarlos y presentarlos.
    - Si el usuario solicita ejercicios, utiliza la función \`getExercises\` para generarlos y presentarlos.
    - Si te preguntan sobre temas no relacionados con el bachillerato o la EBAU, explica amablemente que eres un asistente especializado en EBAU y no puedes proporcionar información sobre otros temas.
    - Estás aquí para ayudar con el estudio para la EBAU. Ofrece consejos de estudio, orientación sobre la estructura de la prueba, y cualquier otra información relevante para la preparación de la EBAU cuando sea apropiado.
    Recuerda: Tu objetivo es proporcionar la información más completa y útil posible para ayudar a los estudiantes en su preparación para la EBAU. No dudes en pedir aclaraciones o más detalles si crees que eso te ayudará a proporcionar una mejor asistencia.`,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    },
    tools: {
      listNotes: {
        description: 'Generate structured notes for a specific subject.',
        parameters: z.object({
          subject: z.string().describe('The subject for which to generate notes'),
          topics: z.array(z.object({
            title: z.string().describe('The title of the main topic'),
            subtopics: z.array(z.string()).describe('List of subtopics for each main topic')
          }))
        }),
        generate: async function* ({ subject, topics }) {
          yield (
            <BotCard>
              <NotesSkeleton />
            </BotCard>
          )
          await sleep(1000)
          const toolCallId = nanoid()
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'listNotes',
                    toolCallId,
                    args: { subject, topics }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'listNotes',
                    toolCallId,
                    result: { subject, topics }
                  }
                ]
              }
            ]
          })
          return (
            <BotCard>
              <Notes subject={subject} topics={topics} />
            </BotCard>
          )
        }
      },
      getExercises: {
        description: 'Get exercises for a specific subject.',
        parameters: z.object({
          subject: z.string().describe('The subject for which to get exercises'),
          exercises: z.array(
            z.object({
              id: z.string().describe('The unique identifier of the exercise'),
              title: z.string().describe('The title of the exercise'),
              question: z.string().describe('The question of the exercise'),
              answer: z.string().describe('The answer to the exercise')
            })
          )
        }),
        generate: async function* ({ subject, exercises }) {
          yield (
            <BotCard>
              <ExercisesSkeleton />
            </BotCard>
          )
          await sleep(1000)
          const toolCallId = nanoid()
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'getExercises',
                    toolCallId,
                    args: { subject, exercises }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'getExercises',
                    toolCallId,
                    result: { subject, exercises }
                  }
                ]
              }
            ]
          })
          return (
            <BotCard>
              <Exercises subject={subject} exercises={exercises} />
            </BotCard>
          )
        }
      }
    }
  })

  return {
    id: nanoid(),
    display: result.value
  }
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    confirmPurchase
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState() as Chat

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  onSetAIState: async ({ state }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/chat/${chatId}`

      const firstMessageContent = messages[0].content as string
      const title = firstMessageContent.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'tool' ? (
          message.content.map(tool => {
            return tool.toolName === 'listNotes' ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Notes subject={tool.result.subject} notes={tool.result.notes} />
              </BotCard>
            ) : tool.toolName === 'getExercises' ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Exercises subject={tool.result.subject} exercises={tool.result.exercises} />
              </BotCard>
            ) : null
          })
        ) : message.role === 'user' ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === 'assistant' &&
          typeof message.content === 'string' ? (
          <BotMessage content={message.content} />
        ) : null
    }))
}