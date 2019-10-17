import { TWITTER_STREAM } from '../actions/types'

export default (state = '', action) => {
	switch (action.type) {
		case TWITTER_STREAM:
			return action.payload
		default:
			return state
	}
}
