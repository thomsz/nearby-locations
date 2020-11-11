import React, { useState, useEffect } from 'react';
import geocode from 'react-geocode';
import axios from 'axios';
import { Spin } from 'antd';
import './App.css';
import Map from './components/Map/Map';
import Header from './components/Header/Header';
import HomePanel from './components/HomePanel/HomePanel';

const App = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [currentLocation, setCurrentLocation] = useState({});
	const [nearbyCities, setNearbyCities] = useState([]);
	const [loading, setLoading] = useState(true);

	// Set Geocode API key
	geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

	useEffect(() => {
		if (searchQuery) {
			setLoading(true);

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
								let i = 0;
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

								if (i === 0) {
									setCurrentLocation({
										name: searchQuery,
										distance: 0,
										population,
										lat,
										lng,
									});
								} else {
									nearbyCities.push({
										id: i,
										name,
										distance,
										population,
										lat,
										lng,
									});
								}
							}

							setLoading(false);
							setNearbyCities(nearbyCities);
						}
					}
				} catch (error) {
					console.error(error);
				}
			})();
		}
	}, [searchQuery]);

	return (
		<div className="App">
			{searchQuery && (
				<Header
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
				/>
			)}

			{!searchQuery ? (
				<HomePanel setSearchQuery={setSearchQuery} />
			) : loading ? (
				<div className="container">
					<Spin size="large" />
				</div>
			) : (
				<Map
					currentLocation={currentLocation}
					nearbyCities={nearbyCities}
				/>
			)}
		</div>
	);
};

export default App;
