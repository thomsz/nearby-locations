import React, { useState } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

const MapContainer = (props) => {
	const { google, currentLocation, lat, lng, nearbyCities } = props;

	const [showInfo, setShowInfo] = useState(false);
	const [selectedMarker, setSelectedMarker] = useState(null);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [selectedLocationInfo, setSelectedLocationInfo] = useState({});

	const onMarkerClickHandler = (props, marker, e) => {
		const { name, distance, population } = props;
		setSelectedMarker(marker);
		setSelectedLocation(name);
		setSelectedLocationInfo({ distance, population });
		setShowInfo(true);
	};

	const onInfoWindowCloseHandler = () => {
		console.log('Closed info window');
	};

	const nearbyMarkers = nearbyCities.map(
		({ name, lat, lng, distance, population }) => (
			<Marker
				key={name}
				name={name}
				position={{ lat, lng }}
				distance={distance}
				population={population}
				onClick={onMarkerClickHandler}
			/>
		)
	);

	const clickMapHandler = () => {
		if (showInfo) {
			setShowInfo(false);
			setSelectedLocation(null);
			setSelectedMarker(null);
		}
	};

	return (
		<Map
			google={google}
			zoom={11}
			initialCenter={{ lat, lng }}
			onClick={clickMapHandler}
		>
			<Marker
				name={currentLocation}
				position={{ lat, lng }}
				onClick={onMarkerClickHandler}
			/>
			{nearbyMarkers}
			<InfoWindow
				marker={selectedMarker}
				onClose={onInfoWindowCloseHandler}
				visible={showInfo}
			>
				<div>
					<h1>{selectedLocation}</h1>
					Temperature:
					<br />
					Population: {selectedLocationInfo.population}
					<br />
					Distance: {selectedLocationInfo.distance}
					<br />
				</div>
			</InfoWindow>
		</Map>
	);
};

export default GoogleApiWrapper({
	apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(MapContainer);
