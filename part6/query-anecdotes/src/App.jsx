import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SET_NOTIFICATION', payload: `anecdote '${updatedAnecdote.content}' voted` })
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
    },
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  if ( result.isLoading ) {
    return <div className="loading">loading data...</div>
  }

  if ( result.isError ) {
    return <div className="error">anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      <div className="anecdote-list">
        {anecdotes.map((anecdote) => (
          <div key={anecdote.id} className="anecdote-item">
            <div className="anecdote-content">{anecdote.content}</div>
            <div className="anecdote-votes">
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote)} className="vote-btn">vote</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
