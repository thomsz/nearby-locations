import React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

const MapContainer = (props) => {
	const { google, currentLocation, lat, lng } = props;

	const onMarkerClickHandler = () => {
		console.log('Clicked a marker');
	};

	const onInfoWindowCloseHandler = () => {
		console.log('Closed info window');
	};

	return (
		<Map google={google} zoom={10} initialCenter={{ lat, lng }}>
			<Marker name={'Pin A'} position={{ lat, lng }} />
			<Marker name={'Pin B'} position={{ lat: 33.1, lng: 34.7018 }} />
			<Marker name={'Pin C'} position={{ lat: 33.1, lng: 34.7018 }} />

			<InfoWindow onClose={onInfoWindowCloseHandler}>
				<div>
					<h1>{currentLocation}</h1>
				</div>
			</InfoWindow>
		</Map>
	);
};

export default GoogleApiWrapper({
	apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(MapContainer);
