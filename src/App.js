import React, { useState, useEffect } from 'react';
import geocode from 'react-geocode';
import axios from 'axios';
import { Input, Spin } from 'antd';
import './App.css';
import Map from './components/Map/Map';
import { ReactComponent as Placeholder } from './images/map1.svg';

const { Search } = Input;

const App = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [currentLocation, setCurrentLocation] = useState('');
	const [lat, setLat] = useState(null);
	const [lng, setLng] = useState(null);
	const [nearbyCities, setNearbyCities] = useState([]);
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
					const geocodeRes = await geocode.fromAddress(searchQuery);

					if (geocodeRes) {
						const {
							lat,
							lng,
						} = geocodeRes.results[0].geometry.location;

						const radius = 20;

						const { statusText, data } = await axios.get(
							`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&radius=${radius}&cities=cities15000&username=${process.env.REACT_APP_GEONAMES_USERNAME}`
						);
						const { geonames } = data;

						if (statusText === 'OK' && geonames.length > 0) {
							const nearbyCities = [];
							for (
								let i = 1;
								i <= 3 && i < geonames.length;
								i++
							) {
								const {
									distance,
									lat,
									lng,
									name,
									population,
								} = geonames[i];

								nearbyCities.push({
									id: i,
									name,
									distance,
									population,
									lat,
									lng,
								});
							}

							setCurrentLocation(searchQuery);
							setLat(lat);
							setLng(lng);
							setLoading(false);
							setNearbyCities(nearbyCities);
						}
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
			<div className="Header">
				<div className="column">
					<Search
						placeholder="input search text"
						onSearch={onSearch}
						style={{ width: 200 }}
						allowClear={true}
					/>
				</div>
				<div className="column">
					<h2>{searchQuery}</h2>
				</div>
			</div>
			{isFirstRender ? (
				<div className="container">
					<Placeholder style={{ height: 500 }} />
					<h2>Search for a location to get started</h2>
				</div>
			) : loading ? (
				<div className="container">
					<Spin size="large" />
				</div>
			) : (
				<Map
					currentLocation={currentLocation}
					lat={lat}
					lng={lng}
					nearbyCities={nearbyCities}
				/>
			)}
		</div>
	);
};

export default App;
