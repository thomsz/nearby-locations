import React, { useState, useEffect } from 'react';
import geocode from 'react-geocode';
import axios from 'axios';
import { Input } from 'antd';
import './App.css';
import Map from './components/Map/Map';

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

						setCurrentLocation(searchQuery);
						setLat(lat);
						setLng(lng);
						setLoading(false);
						console.log(lat, lng);

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
									name,
									distance,
									population,
									lat,
									lng,
								});
							}
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
