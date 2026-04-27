import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const updatedAnecdote = action.payload
      return state.map(a => a.id !== updatedAnecdote.id ? a : updatedAnecdote)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    try {
      const anecdotes = await anecdoteService.getAll()
      dispatch(setAnecdotes(anecdotes))
    } catch (error) {
      console.error('Failed to fetch anecdotes:', error)
    }
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteForAnecdote = anecdote => {
  return async dispatch => {
    const votedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    const updatedAnecdote = await anecdoteService.update(anecdote.id, votedAnecdote)
    dispatch(voteAnecdote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer
