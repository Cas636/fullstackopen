const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const maxLikes = Math.max(...blogs.map(b => b.likes))
  const favorite = blogs.find(b => b.likes === maxLikes)

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCounts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  const maxBlogs = Math.max(...Object.values(authorCounts))
  const topAuthor = Object.keys(authorCounts).find(author => authorCounts[author] === maxBlogs)

  return {
    author: topAuthor,
    blogs: maxBlogs
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorLikes = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  const maxLikes = Math.max(...Object.values(authorLikes))
  const topAuthor = Object.keys(authorLikes).find(author => authorLikes[author] === maxLikes)

  return {
    author: topAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}