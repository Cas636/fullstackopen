import { useState } from 'react'
import {
  Routes, Route, Link,
  useMatch, useNavigate
} from 'react-router-dom'
import { useField } from './hooks'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to='/' style={padding}>anecdotes</Link>
      <Link to='/create' style={padding}>create new</Link>
      <Link to='/about' style={padding}>about</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
        <li key={anecdote.id} >
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      )}
    </ul>
  </div>
)

const Anecdote = ({ anecdote, vote }) => {
  if (!anecdote) return null
  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p>has {anecdote.votes} votes <button onClick={() => vote(anecdote.id)}>vote</button></p>
      <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div style={{ marginTop: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}>
    <strong>The Tolkien Anecdote App</strong>Explore the vast legendarium and share reflections.
    <br />
    Find more lore at <a href='https://tolkiengateway.net/'>Tolkien Gateway</a>
  </div>
)

const CreateNew = (props) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/')
  }

  const handleReset = (e) => {
    e.preventDefault()
    content.reset()
    author.reset()
    info.reset()
  }

  const getInputProps = (hook) => {
    const { reset, ...props } = hook
    return props
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' {...getInputProps(content)} />
        </div>
        <div>
          author
          <input name='author' {...getInputProps(author)} />
        </div>
        <div>
          url for more info
          <input name='info' {...getInputProps(info)} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'And suddenly the Ainur saw afar off a light, as it were a cloud with a living heart of flame; and they knew that this was no vision only, but that Ilúvatar had made a new thing: Eä, the World that Is.',
      author: 'J.R.R. Tolkien',
      info: 'https://tolkiengateway.net/wiki/E%C3%A4',
      votes: 0,
      id: 1
    },
    {
      content: 'Eä is the material universe as a realization of the Music of the Ainur. It signifies "Let it be" or "The World that Is", distinguishing the realized creation from the thought of Ilúvatar.',
      author: 'Tolkien Legendarium',
      info: 'https://tolkiengateway.net/wiki/Ainulindal%C3%AB',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    setNotification(`a new anecdote ${anecdote.content} created!`)
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  const match = useMatch('/anecdotes/:id')
  const anecdote = match
    ? anecdoteById(Number(match.params.id))
    : null

  return (
    <div>
      <h1>The Tolkien Anecdote App</h1>
      <Menu />
      {notification && <div>{notification}</div>}
      <Routes>
        <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} vote={vote} />} />
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/about" element={<About />} />
        <Route path="/create" element={<CreateNew addNew={addNew} />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
