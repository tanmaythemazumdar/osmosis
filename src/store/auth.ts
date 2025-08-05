import type { Action } from 'redux'

const initialState = {
  error: null,
  loading: false,
  token: null,
  user: null,
}

export const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    default:
      return state
  }
}
