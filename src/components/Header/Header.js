import React from 'react';
import SearchField from '../SearchField/SearchField';

const Header = (props) => {
	const { searchQuery, setSearchQuery } = props;

	return (
		<div className="Header">
			<div className="column">
				<SearchField setSearchQuery={setSearchQuery} />
			</div>
			<div className="column" id="currentLocation">
				<h2>{searchQuery}</h2>
			</div>
		</div>
	);
};

export default Header;
