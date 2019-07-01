import {
	FETCH_POCKETS,
	SET_POCKET_BALANCE
} from "../actions"

export default (state = [], action) => {
	switch(action.type) {
		case FETCH_POCKETS:
			return action.payload
		case SET_POCKET_BALANCE:
			return [
				...state.map(p => ( p.currencyCode === action.payload.currencyCode) ? action.payload : p )
			]
		default:
			return state
	}
}
