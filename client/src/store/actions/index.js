import axios from 'axios'
import { TWITTER_STREAM, TWITTER_ANALYZE, NEW_SESSION, SEARCHED } from './types'

export const connectStream = q => async dispatch => {
	await axios.get('/api/connect', {
		params: {
			q
		}
	})
	dispatch({
		type: TWITTER_STREAM,
		payload: 'connected'
	})
}

export const disconnectStream = () => async dispatch => {
	const res = await axios.get('/api/disconnect')
	dispatch({
		type: TWITTER_STREAM,
		payload: res.data
	})
}

export const analyseStream = () => async dispatch => {
	const res = await axios.get('/api/analyse')
	dispatch({
		type: TWITTER_ANALYZE,
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

export const flushStore = () => dispatch => {
	dispatch({
		type: NEW_SESSION
	})
}
