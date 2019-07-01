import { combineReducers } from 'redux'
import pocketsReducer from './pocketsReducer'
import ratesReducer from './ratesReducers'
import exchangeReducer from './exchangeReducer'

const rootReducer = combineReducers({
	rates: ratesReducer,
	pockets: pocketsReducer,
	exchange: exchangeReducer
})

export default rootReducer
