import anecdotesService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch (action.type) {
    case 'VOTE':
      const id = action.data
      const toUpdate = state.find((text) => text.id === id)
      const updated = { ...toUpdate, votes: toUpdate.votes + 1 }
      return state.map((text) => (text.id === id ? updated : text))
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    case 'INIT_ANECDOTE':
      return action.data
    default:
      return state
  }
}

export const voteAnecdote = (id) => {
  return {
    type: 'VOTE',
    data: id
  }
}

export const createAnecdote = (text) => {
  return async (dispatch) => {
    const newAnecdote = await anecdotesService.create(asObject(text))
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    })
  }
}

export const initAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdotesService.getAll()
    dispatch({
      type: 'INIT_ANECDOTE',
      data: anecdotes
    })
  }
}

export default reducer
