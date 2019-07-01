import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './Dropdown.css';


export default class Dropdown extends Component {

	render () {
		return (
			<select
				onChange={this.props.onChangeOption}
				className='dropdown'
				defaultValue={this.props.selected}
			>
				{ this.props.pockets.map(p => (
					<option
						key={p.currencyCode}
						value={p.currencyCode}
					>
						{ p.currencyCode }
					</option>
				)) }
			</select>
		)
	}
}

Dropdown.propTypes = {
	pockets: PropTypes.array,
	onChangeOption: PropTypes.func,
	selected: PropTypes.string
}
