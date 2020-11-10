import React, { useState } from 'react';
import { Input } from 'antd';
import './App.css';

const { Search } = Input;

const App = () => {
	const [searchQuery, setSearchQuery] = useState('');

	const onSearch = (input) => {
		setSearchQuery(input);
		console.log('submitted', input);
	};

	return (
		<div className="App">
			<Search
				placeholder="input search text"
				onSearch={onSearch}
				style={{ width: 200 }}
			/>
			<h2>{searchQuery}</h2>
		</div>
	);
};

export default App;
