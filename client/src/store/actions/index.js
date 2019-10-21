import axios from 'axios'
import { TWITTER_STREAM, NEW_SESSION, SEARCHED, NEW_SEARCH } from './types'

export const connectStream = q => async dispatch => {
	const res = await axios.get('/api/connect', {
		params: {
			q
		}
	})
	dispatch({
		type: TWITTER_STREAM,
		payload: res.data
	})
}

export const searchedTerms = () => async dispatch => {
	const res = await axios.get('/api/searched')
	dispatch({
		type: SEARCHED,
		payload: res.data
	})
}

export const newSearch = q => dispatch => {
	dispatch({
		type: NEW_SEARCH,
		payload: q
	})
}

export const flushTweets = () => dispatch => {
	dispatch({
		type: TWITTER_STREAM,
		payload: {}
	})
}

export const flushStore = () => dispatch => {
	dispatch({
		type: NEW_SESSION
	})
}
