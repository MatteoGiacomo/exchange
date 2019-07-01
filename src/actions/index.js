// import axios from 'axios'

// const APP_ID = 'YOUR_APP_KEY'
// const ROOT_URL = `https://openexchangerates.org/api/latest.json?app_id=${APP_ID}`

export const FETCH_RATES = 'FETCH_RATES'
export const FETCH_POCKETS = 'FETCH_POCKETS'
export const UPDATE_EXCHANGE = 'UPDATE_EXCHANGE'
export const SET_EXCHANGE_POCKET = 'SET_EXCHANGE_POCKET'
export const SET_EXCHANGE_INPUT = 'SET_EXCHANGE_INPUT'
export const SET_POCKET_BALANCE = 'SET_POCKET_BALANCE'

const RATES = {
	'USD': {
		GBP: 0.79,
		EUR: 0.88,
		USD: 1
	},
	'GBP': {
		USD: 1.27,
		EUR: 1.11,
		GBP: 1
	},
	'EUR': {
		USD: 1.14,
		GBP: 0.9,
		EUR: 1
	}
}

/**
 * fetch rates with base passed as argument
 * @param base
 * @returns {Function}
 */
export const fetchRates = (base = 'USD') => async dispatch => {
	// const res = await axios.get( `${ROOT_URL}&base=${base}`)

	console.log('fetch rates with base: ', base)
	const resMock = {
		data: {
			rates: RATES[base]
		}
	}

	dispatch({
		type: FETCH_RATES,
		payload: resMock
	})
}

const pocketsMock = [
	{
		currencyCode: 'USD',
		balance: 300,
		symbol: '$'
	},
	{
		currencyCode: 'GBP',
		balance: 1200,
		symbol: '£'
	},
	{
		currencyCode: 'EUR',
		balance: 600,
		symbol: '€'
	}
]


export const fetchPockets = () => ({
	type: FETCH_POCKETS,
	payload: pocketsMock
})

/**
 * set exchange pocket
 * @param payload { section: 'from | to', pocket: { currencyCode, balance } }
 * @returns {{payload: *, type: string}}
 */
export const setExchangePocket = payload => ({
	type: SET_EXCHANGE_POCKET,
	payload
})

/**
 * set exchange input
 * @param payload { section: 'from | to', pocket: { currencyCode, balance } }
 * @returns {{payload: *, type: string}}
 */
export const setExchangeInput = payload => ({
	type: SET_EXCHANGE_INPUT,
	payload
})

/**
 * update exchange data
 * @param payload
 * @returns {{payload: array of pockets, type: string}}
 */
export const updateExchange = payload => ({
	type: UPDATE_EXCHANGE,
	payload
})

export const setPocketBalance = payload => ({
	type: SET_POCKET_BALANCE,
	payload
})






