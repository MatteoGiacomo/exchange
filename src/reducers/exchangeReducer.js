import {
	UPDATE_EXCHANGE,
	SET_EXCHANGE_POCKET,
	SET_EXCHANGE_INPUT
} from "../actions"

export default (state = {}, action) => {
	switch(action.type) {
		case UPDATE_EXCHANGE:
			return {
				from: {
					...action.payload[0],
					inputValue: ''
				},
				to: {
					...action.payload[1],
					inputValue: ''
				}
			}
		case SET_EXCHANGE_POCKET:
			return {
				...state,
				[action.payload.section]: {
					...state[action.payload.section],
					...action.payload.pocket,
					inputValue: ''
				}
			}
		case SET_EXCHANGE_INPUT:
			return {
				...state,
				[action.payload.section]: {
					...state[action.payload.section],
					inputValue: action.payload.value
				}
			}
		default:
			return state
	}
}
