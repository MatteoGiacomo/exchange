import React, { Component } from 'react';
import './Pocket.css';
import Dropdown from 'components/Dropdown/Dropdown'

const FLOAT_DIGITS_REGEXP = new RegExp(/^[0-9]{0,9}\.?[0-9]{0,2}$/g)

export default class Pocket extends Component {

	onInputChange (e) {
		if (e.target.value.match(FLOAT_DIGITS_REGEXP) !== null) {
			this.props.onChangeInput(e.target.value)
		}
	}

	render () {
		const { className, balance, pockets, symbol, label, inputValue, onChangeOption } = this.props

		return (
			<div className={`pocket ${className}`}>
				<div className='pocket__inner_box'>
					<Dropdown
						onChangeOption={onChangeOption}
						pockets={pockets}
						selected={label}
					/>
					<input
						placeholder='0'
						className='pocket__inner_box__input'
						value={inputValue}
						onChange={this.onInputChange.bind(this)}
					/>
				</div>
				<div className='pocket__inner_box'>
					<span className='pocket__inner_box__balance'>
						{ `You have ${symbol}${balance}` }
					</span>
				</div>
			</div>
		)
	}
}
