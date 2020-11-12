import geocode from 'react-geocode';
import axios from 'axios';

const getLocalities = async (searchQuery) => {
	// set Geocode API key
	geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

	try {
		// fetch geocodes
		const geocodeRes = await geocode.fromAddress(searchQuery);

		if (geocodeRes) {
			const { lat, lng } = geocodeRes.results[0].geometry.location;

			const radius = 20;

			const { statusText, data } = await axios.get(
				`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&radius=${radius}&cities=cities15000&username=${process.env.REACT_APP_GEONAMES_USERNAME}`
			);

			const { geonames } = data;

			return { statusText, geonames };
		}
	} catch (error) {
		console.error(error);
	}
};

export default getLocalities;
