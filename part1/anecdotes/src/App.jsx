import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    'All we have to decide is what to do with the time that is given us.',
    'Not all those who wander are lost.',
    'So we beat on, boats against the current, borne back ceaselessly into the past.',
    'Whatever our souls are made of, his and mine are the same.',
    'There is some good in this world, and it’s worth fighting for.',
    'It was the best of times, it was the worst of times.',
    'Beware; for I am fearless, and therefore powerful.',
    'The man in black fled across the desert, and the gunslinger followed.',
    'Real courage is when you know you’re licked before you begin, but you begin anyway and see it through no matter what.',
    'After all, tomorrow is another day.',
    'We accept the love we think we deserve.',
    'Memories warm you up from the inside. But they also tear you apart.',
    'There is no friend as loyal as a book.',
    'Until I feared I would lose it, I never loved to read. One does not love breathing.',
    'All animals are equal, but some animals are more equal than others.',
    'Nowadays people know the price of everything and the value of nothing.',
    'It matters not what someone is born, but what they grow to be.',
    'Fear cuts deeper than swords.',
    'You forget what you want to remember, and you remember what you want to forget.',
    'There are years that ask questions and years that answer.',
    'The world was hers for the reading.',
    'To the well-organized mind, death is but the next great adventure.',
    'Happiness can be found even in the darkest of times, if one only remembers to turn on the light.',
    'Words are, in my not-so-humble opinion, our most inexhaustible source of magic. Capable of both inflicting injury, and remedying it.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const handleNextAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const handleVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const maxVotes = Math.max(...votes)
  const bestAnecdoteIndex = votes.indexOf(maxVotes)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleNextAnecdote}>next anecdote</button>

      <h1>Anecdote with most votes</h1>
      {maxVotes > 0 ? (
        <>
          <p>{anecdotes[bestAnecdoteIndex]}</p>
          <p>has {maxVotes} votes</p>
        </>
      ) : (
        <p>No votes yet</p>
      )}
    </div>
  )
}

export default App
