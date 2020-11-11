import React, { useState, useEffect } from 'react';
import geocode from 'react-geocode';
import axios from 'axios';
import { Input, Spin } from 'antd';
import './App.css';
import Map from './components/Map/Map';
import { capitalize } from './utils/utils';
import { ReactComponent as Placeholder } from './images/map1.svg';

const { Search } = Input;

const App = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [currentLocation, setCurrentLocation] = useState({});
	const [nearbyCities, setNearbyCities] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showPlaceholder, setShowPlaceholder] = useState(true);

	useEffect(() => {
		if (searchQuery === '') {
			setShowPlaceholder(true);
		} else {
			showPlaceholder && setShowPlaceholder(false);
			setLoading(true);

			// Set Geocode API key
			geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

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
								} else
									nearbyCities.push({
										id: i,
										name,
										distance,
										population,
										lat,
										lng,
									});
							}

							setLoading(false);
							setNearbyCities(nearbyCities);
						}
					}
				} catch (error) {
					console.log(error);
				}
			})();
		}
	}, [searchQuery]);

	const onSearch = (input) => {
		setSearchQuery(capitalize(input));
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
			{showPlaceholder ? (
				<div className="container">
					<Placeholder style={{ height: 400 }} />
					<h1 style={{ color: '#525252' }}>
						The modern approach to
						<br />
						<span className="placeholderBold">search</span> for cool
						places <span className="placeholderBold">near you</span>
					</h1>
				</div>
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
