import fs from 'fs'

let appCode = fs.readFileSync('src/App.jsx', 'utf8')
appCode = appCode.replace('isLoading: isLoadingBlogs', 'isLoading')
appCode = appCode.replace('const deleteBlog = (id)', 'const deleteBlog = (_id)')
appCode = appCode.replace(
  'deleteBlogMutation.mutate(id)',
  'deleteBlogMutation.mutate(_id)'
)
fs.writeFileSync('src/App.jsx', appCode)
