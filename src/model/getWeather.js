import axios from 'axios';

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

export default currentWeather;
