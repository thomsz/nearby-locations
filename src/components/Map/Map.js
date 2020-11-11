import React, { useState } from 'react';
import axios from 'axios';
import { format } from '../../utils/utils';
import { Statistic, Row, Col } from 'antd';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

const MapContainer = (props) => {
	const { google, currentLocation, nearbyCities } = props;
	const { lat, lng } = currentLocation;

	const [showInfo, setShowInfo] = useState(false);
	const [selectedMarker, setSelectedMarker] = useState(null);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [selectedLocationInfo, setSelectedLocationInfo] = useState({});

	const currentWeather = async (position) => {
		const unit = 'metric';
		const { lat, lng } = position;

		try {
			const response = await axios.get(
				`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}&units=${unit}`
			);

			if (response.status === 200) {
				const temperature = response.data.current.temp;

				return temperature;
			} else throw new Error('Could not fetch temperature');
		} catch (error) {
			console.error(error);
		}
	};

	const onMarkerClickHandler = async (props, marker) => {
		let { name, distance, population, position } = props;

		// format population 000,000 / n/a
		population = format(population);

		// validate distance and restrict it to 3 digits after the dot
		distance = distance
			? distance.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0]
			: 'n/a';

		// get weather
		const temperature = await currentWeather(position);

		setSelectedMarker(marker);
		setSelectedLocation(name);
		setSelectedLocationInfo({ distance, population, temperature });
		setShowInfo(true);
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

	const valueStyle = { fontSize: 16 };

	return (
		<Map
			google={google}
			zoom={11}
			initialCenter={{ lat, lng }}
			onClick={clickMapHandler}
			containerStyle={{ height: 'calc(100vh - 90px)' }}
		>
			<Marker
				name={currentLocation.name}
				position={{ lat, lng }}
				distance={currentLocation.distance}
				population={currentLocation.population}
				onClick={onMarkerClickHandler}
			/>
			{nearbyMarkers}
			<InfoWindow marker={selectedMarker} visible={showInfo}>
				<div>
					<h2>{selectedLocation}</h2>
					<Row gutter={20} style={{ margin: 0 }}>
						<Col span={8}>
							<Statistic
								title="Temperature"
								value={`${selectedLocationInfo.temperature}`}
								suffix="°C"
								valueStyle={valueStyle}
							/>
						</Col>
						<Col span={8}>
							<Statistic
								title="Population"
								value={selectedLocationInfo.population}
								valueStyle={valueStyle}
							/>
						</Col>
						<Col span={8}>
							<Statistic
								title="Distance"
								value={`${selectedLocationInfo.distance}km`}
								valueStyle={valueStyle}
							/>
						</Col>
					</Row>
				</div>
			</InfoWindow>
		</Map>
	);
};

export default GoogleApiWrapper({
	apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(MapContainer);
