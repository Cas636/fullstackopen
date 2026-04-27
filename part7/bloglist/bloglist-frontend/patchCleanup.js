import fs from 'fs'

let appCode = fs.readFileSync('src/App.jsx', 'utf8')
appCode = appCode.replace(
  'const { data: blogs = [], isLoading }',
  'const { data: blogs = [] }'
)

const newDelete = `const _deleteBlog = (id) => {
    const blogToDelete = blogs.find((b) => b.id === id)
    if (window.confirm(\`Remove blog \${blogToDelete.title} by \${blogToDelete.author}\`)) {
      deleteBlogMutation.mutate(id)
      notify(\`blog \${blogToDelete.title} removed\`)
    }
  }`
appCode = appCode.replace(
  /const deleteBlog = \(_id\) => \{[\s\S]*?\}\n {2}\}/,
  newDelete
)

appCode = appCode.replace(
  /deleteBlogMutation.mutate\(_id\)/,
  'deleteBlogMutation.mutate(id)'
)
fs.writeFileSync('src/App.jsx', appCode)
