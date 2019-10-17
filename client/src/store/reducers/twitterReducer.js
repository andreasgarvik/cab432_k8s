import { TWITTER_STREAM, TWITTER_ANALYZE } from '../actions/types'

export default (state = '', action) => {
	switch (action.type) {
		case TWITTER_STREAM:
			return action.payload
		case TWITTER_ANALYZE:
			return [...state, action.payload]
		default:
			return state
	}
}
