import { combineReducers } from 'redux'
import twitterReducer from './twitterReducer'
import searchedReducer from './searched'

const appReducer = combineReducers({
	twitter: twitterReducer,
	searched: searchedReducer
})

const rootReducer = (state, action) => {
	if (action.type === 'NEW_SESSION') {
		state = undefined
	}
	return appReducer(state, action)
}

export default rootReducer
