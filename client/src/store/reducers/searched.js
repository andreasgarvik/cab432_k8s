import { SEARCHED, NEW_SEARCH } from '../actions/types'

export default (state = [], action) => {
	switch (action.type) {
		case SEARCHED:
			return action.payload
		case NEW_SEARCH:
			const before = state.find(t => t === action.payload)
			if (before) {
				return state
			} else {
				return [...state, action.payload]
			}
		default:
			return state
	}
}
