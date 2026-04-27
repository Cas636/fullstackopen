const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// replace useState with useState + useField
code = code.replace(
  "import { useState } from 'react'",
  "import { useState } from 'react'\nimport { useField } from './hooks'"
);

const oldCreateNew = `const CreateNew = (props) => {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [info, setInfo] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content,
      author,
      info,
      votes: 0
    })
    navigate('/')
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          author
          <input name='author' value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          url for more info
          <input name='info' value={info} onChange={(e)=> setInfo(e.target.value)} />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}`;

const newCreateNew = `const CreateNew = (props) => {
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
}`

code = code.replace(oldCreateNew, newCreateNew);

fs.writeFileSync('src/App.jsx', code);
console.log('Patched App.jsx successfully.');
