import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import './App.css';
import getLocalities from './model/getLocalities';
import Map from './components/Map/Map';
import Header from './components/Header/Header';
import HomePanel from './components/HomePanel/HomePanel';

const App = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [currentLocation, setCurrentLocation] = useState({});
	const [nearbyCities, setNearbyCities] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (searchQuery) {
			setLoading(true);

			(async () => {
				// collect localities data
				const { statusText, geonames } = await getLocalities(
					searchQuery
				);

				if (statusText === 'OK' && geonames.length > 0) {
					const nearbyCities = [];

					for (let i = 0; i <= 3 && i < geonames.length; i++) {
						const {
							distance,
							lat,
							lng,
							name,
							population,
						} = geonames[i];

						if (i === 0) {
							// current location
							setCurrentLocation({
								name: searchQuery,
								distance: 0,
								population,
								lat,
								lng,
							});
						} else {
							// nearby cities
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

					setNearbyCities(nearbyCities);
					setLoading(false);
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
