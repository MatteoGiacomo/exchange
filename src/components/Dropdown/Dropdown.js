import React from 'react';
import PropTypes from 'prop-types'
import './Dropdown.css';


const Dropdown = props => {
	return (
		<select
			className='dropdown'
			onChange={props.onChangeOption}
			defaultValue={props.selected}
		>
			{ props.pockets.map(p => (
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

Dropdown.propTypes = {
	pockets: PropTypes.array,
	onChangeOption: PropTypes.func,
	selected: PropTypes.string
}

export default Dropdown;
