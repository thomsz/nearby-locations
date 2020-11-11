import React from 'react';
import SearchField from '../SearchField/SearchField';
import { ReactComponent as Placeholder } from '../../images/map1.svg';

const HomePanel = (props) => {
	const { setSearchQuery } = props;

	return (
		<div className="container" style={{ paddingTop: 50 }}>
			<Placeholder id="placeholder" style={{ height: 400 }} />
			<div style={{ padding: 20 }}>
				<SearchField setSearchQuery={setSearchQuery} />
			</div>
			<h1 style={{ color: '#525252' }}>
				The modern approach to
				<br />
				<span className="placeholderBold">discover</span> cool places{' '}
				<span className="placeholderBold">near you</span>
			</h1>
		</div>
	);
};

export default HomePanel;
