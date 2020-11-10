import React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

const MapContainer = (props) => {
	const { google, currentLocation, lat, lng, nearbyCities } = props;

	const onMarkerClickHandler = () => {
		console.log('Clicked a marker');
	};

	const onInfoWindowCloseHandler = () => {
		console.log('Closed info window');
	};

	const nearbyMarkers = nearbyCities.map(
		({ name, lat, lng, distance, location }) => (
			<Marker key={name} name={name} position={{ lat, lng }} />
		)
	);

	return (
		<Map google={google} zoom={11} initialCenter={{ lat, lng }}>
			<Marker name={'Pin A'} position={{ lat, lng }} />
			{nearbyMarkers}

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
