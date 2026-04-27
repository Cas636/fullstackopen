import { useSelector, useDispatch } from 'react-redux'
import { voteForAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()

  const anecdotes = useSelector(({ filter, anecdotes }) => {
    if (filter === '') {
      return [...anecdotes].sort((a, b) => b.votes - a.votes)
    }
    return [...anecdotes]
      .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => b.votes - a.votes)
  })

  const vote = (anecdote) => {
    dispatch(voteForAnecdote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <div className="anecdote-list">
      {anecdotes.map(anecdote => (
        <div key={anecdote.id} className="anecdote-item">
          <div className="anecdote-content">{anecdote.content}</div>
          <div className="anecdote-votes">
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)} className="vote-btn">vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList