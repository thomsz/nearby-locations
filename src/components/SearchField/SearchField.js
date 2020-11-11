import React from 'react';
import { Input } from 'antd';
import { capitalize } from '../../utils/utils';

const { Search } = Input;

const SearchField = (props) => {
	const { setSearchQuery } = props;

	const onSearch = (input) => {
		setSearchQuery(capitalize(input));
	};

	return (
		<Search
			placeholder="Discover a City"
			onSearch={onSearch}
			style={{ width: 200 }}
			allowClear={true}
		/>
	);
};

export default SearchField;
