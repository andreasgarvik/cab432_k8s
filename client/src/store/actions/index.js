import axios from 'axios'
import io from 'socket.io-client'
import { TWITTER_STREAM } from './types'

/* // client
const socket = io({
	path: '/api'
})

export const connectStreamIO = () => dispatch => {
	socket.on('data', t => {
		dispatch({
			type: TWITTER_STREAM,
			payload: t.data
		})
	})
}

export const disconnectStreamIO = () => dispatch => {
	socket.disconnect()
	dispatch({
		type: TWITTER_STREAM,
		payload: ''
	})
} */

export const connectStream = () => async dispatch => {
	const res = await axios.get('/api/connect')
	dispatch({
		type: TWITTER_STREAM,
		payload: 'Connected to stream'
	})
}

export const disconnectStream = () => async dispatch => {
	const res = await axios.get('/api/disconnect')
	dispatch({
		type: TWITTER_STREAM,
		payload: 'Disconnected to stream'
	})
}

export const analyseStream = () => async dispatch => {
	const res = await axios.get('/api/analyse')
	dispatch({
		type: TWITTER_STREAM,
		payload: 'Analysing'
	})
}
