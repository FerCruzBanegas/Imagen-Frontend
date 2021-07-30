let moment = require('moment')

module.exports = (function (date, type) {
	now = moment()
	time = now.diff(date, type)
	if (time === 0) {
		return 'El Día de hoy'
	} else {
		return `Hace ${time} Días`
	} 
})