import React, { useState, useEffect } from 'react';
import geocode from 'react-geocode';
import { Input } from 'antd';
import './App.css';
import Map from './components/Map/Map';

const { Search } = Input;

const App = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [currentLocation, setCurrentLocation] = useState('');
	const [lat, setLat] = useState(null);
	const [lng, setLng] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isFirstRender, setIsFirstRender] = useState(true);

	useEffect(() => {
		isFirstRender && searchQuery !== '' && setIsFirstRender(false);
		setLoading(true);

		// Set Geocode API key
		geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

		searchQuery !== '' &&
			(async () => {
				try {
					const response = await geocode.fromAddress(searchQuery);

					if (response) {
						const {
							lat,
							lng,
						} = response.results[0].geometry.location;
						setCurrentLocation(searchQuery);
						setLat(lat);
						setLng(lng);
						setLoading(false);
					}
				} catch (error) {
					console.log(error);
				}
			})();
	}, [searchQuery]);

	const onSearch = (input) => {
		setSearchQuery(input);
	};

	return (
		<div className="App">
			<Search
				placeholder="input search text"
				onSearch={onSearch}
				style={{ width: 200 }}
			/>
			<h2>{searchQuery}</h2>
			{isFirstRender ? (
				<h2>Search for a location</h2>
			) : loading ? (
				<h2>Loading...</h2>
			) : (
				<Map currentLocation={currentLocation} lat={lat} lng={lng} />
			)}
		</div>
	);
};

export default App;
