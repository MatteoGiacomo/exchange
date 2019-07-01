import { FETCH_RATES } from '../actions/index'

export default (state = {}, action) => {
	switch(action.type) {
		case FETCH_RATES:
			return action.payload.data.rates
		default:
			return state
	}
}
