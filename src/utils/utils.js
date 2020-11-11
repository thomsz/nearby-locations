export const format = (num) => {
	return num !== undefined ? num.toLocaleString() : 'n/a';
};

export const capitalize = (string) => {
	return string
		.split(' ')
		.map((string) => string.charAt(0).toUpperCase() + string.slice(1))
		.join(' ');
};
