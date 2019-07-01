import React, { Component } from 'react';
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
