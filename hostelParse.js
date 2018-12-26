const genders = require('./genders.js').genders
const dates = require('./dates.js').birthDates
const cities = require('./cities.js').cities
const comingDates = require('./comingDates.js').comingDates

const 
	male = 'м',
	female = 'ж'

const UNKNOWN = 'unknown'

function getDates() { return dates.split('\n') }
function getCities() { return cities.split('\n') }
function getGenders() { return genders.split('\n') }
function getComingDates() { return comingDates.split('\n') }

function formattedDate(date) {
	if (date === UNKNOWN) { return false }

	const splittedDate = date.split('/')
	
	let day = splittedDate[0]

	let year = splittedDate[2]
	if (year.length === 2) {
		year = `20${year}`
	}

	let month = splittedDate[1]
	if (month.length === 2 && month[0] === '0') {
		month = month[1]
	}
	if (parseInt(month) > 12) {
		month = splittedDate[0]
		day = splittedDate[1]
	}

	return {
		day: day,
		month: month,
		year: year
	}
}

function printNumberSign(relativeLength) {
	let stringOfNumberSigns = ''
	for (let i = 0; i < relativeLength; i++) {
		stringOfNumberSigns += '#'
	}

	return stringOfNumberSigns
}

//получили список объектов город - дата рождения - пол
function getObjectsList() {
	const objectstArr = []

	const splittedGenders = getGenders()
	const splittedDates = getDates()
	const splittedCities = getCities()
	const splittedComingDates = getComingDates()

	let noCity = 0

	splittedCities.forEach( (city, key) => {
		if (!city) { noCity++ }
		objectstArr.push({
			city: city 
				? city.trim()
				: UNKNOWN,
			date: splittedDates[key] && splittedDates[key].length > 2 
				? splittedDates[key] 
				: UNKNOWN,
			gender: splittedGenders[key] 
				? splittedGenders[key].trim()
				: UNKNOWN,
			comingDate: splittedComingDates[key]
				? splittedComingDates[key]
				: UNKNOWN
		})
	})

	//console.log('Всего объектов: ', objectstArr.length)
	//console.log('noCity: ', noCity)

	return objectstArr
}

function genderAnalysis(objectsList) {
	const genders = {
		male: [],
		female: []
	}


	objectsList.forEach(object => {
		let gender = object.gender
		if (gender !== UNKNOWN) {
			if (gender === male) {
				genders.male.push(object)
			}

			if (gender === female) {
				genders.female.push(object)	
			}
		}
	})


	console.log('Мужчин:', genders.male.length);
	console.log('Женщин:', genders.female.length, '\n');

	console.log('Оценка по мужчинам')
	ageAnalysis(genders.male);
	console.log('\n')
	console.log('Оценка по женщинам')
	ageAnalysis(genders.female);
}

function averageAge() {
	let objectsList = getObjectsList()
	let averageAge = 0
	let totalAge = 0
	let two = 0
	let four = 0
	let total = 0

	objectsList.forEach(object => {
		let date = object.date
		if (date !== UNKNOWN) {
			const year = date.split('/')[2]
			if (year) {
				if (year.length === 2) {
					two++
					total++
					totalAge += 2018 - parseInt('19' + year)
				}

				if (year.length === 4) {
					four++
					total++
					totalAge += 2018 - parseInt(year)
				}
			}
		}
	})

	//console.log('total: ', total, '\ntwo: ', two, '\nfour: ', four)
	//console.log('Нет данных по людям в количестве:', objectsList.length - total + '(чел)')
	console.log('**** Средний возраст:', (totalAge/ total).toFixed(1), 'лет')
	console.log('\n')
}

function ageAnalysis(objectsList) {
	const cat18_24 = []
	const cat25_30 = []
	const cat31_35 = []
	const cat36_40 = []
	const cat41_45 = []
	const cat46_100 = []

	objectsList.forEach(object => {
		let date = object.date
		if (date !== UNKNOWN) {
			const year = date.split('/')[2]
			if (year) {
				if (year.length === 2) {
					let age = 2018 - parseInt('19' + year)
					if (age > 17 && age <= 24) { cat18_24.push(object) }
					if (age > 24 && age <= 30) { cat25_30.push(object) }
					if (age > 30 && age <= 35) { cat31_35.push(object) }
					if (age > 35 && age <= 40) { cat36_40.push(object) }
					if (age > 40 && age <= 45) { cat41_45.push(object) }
					if (age > 45) { cat46_100.push(object) }			
				}

				if (year.length === 4) {
					let age = 2018 - parseInt(year)
					if (age > 17 && age <= 24) { cat18_24.push(object) }
					if (age > 24 && age <= 30) { cat25_30.push(object) }
					if (age > 30 && age <= 35) { cat31_35.push(object) }
					if (age > 35 && age <= 40) { cat36_40.push(object) }
					if (age > 40 && age <= 45) { cat41_45.push(object) }
					if (age > 45) { cat46_100.push(object) }
				}
			}
		}
	})

	console.log('Аналитика возрастов:')
	console.log('18-24:', (cat18_24.length/objectsList.length * 100).toFixed(1) + '% ->', cat18_24.length + ('чел'))
	console.log('25-30:', (cat25_30.length/objectsList.length * 100).toFixed(1) + '% ->', cat25_30.length + ('чел'))
	console.log('31-35:', (cat31_35.length/objectsList.length * 100).toFixed(1) + '% ->', cat31_35.length + ('чел'))
	console.log('36-40:', (cat36_40.length/objectsList.length * 100).toFixed(1) + '% ->', cat36_40.length + ('чел'))
	console.log('41-45:', (cat41_45.length/objectsList.length * 100).toFixed(1) + '% ->', cat41_45.length + ('чел'))
	console.log('46+:', (cat46_100.length/objectsList.length * 100).toFixed(1) + '% ->', cat46_100.length + ('чел'))
}

function citiesAnalysis(objectsList) {
	const citiesMap = new Map()

	objectsList.forEach(object => {
		if (object.city !== UNKNOWN) {
			//если людей в городе еще нет, то начнем добавлять, иначем просто добавим
			if (!citiesMap.get(object.city)) {
				citiesMap.set(object.city, [object])
			} else {
				let mapObject = citiesMap.get(object.city)
				mapObject.push(object)
				citiesMap.set(object.city, mapObject)
			}
		}
	})

	console.log('**** Аналитика городов:')
	console.log('Всего городов:', citiesMap.size)

	const threshold = 5
	const cities = []
	for (let city of citiesMap.keys()) {
		const peopleFromCity = citiesMap.get(city)
		if (peopleFromCity.length > threshold) {
			cities.push({
				city: city,
				people: peopleFromCity
			})
		}
	}

	const sortedCities = cities.sort((a, b) => {
	  if (a.people.length < b.people.length) { return 1 }
	  if (a.people.length >= b.people.length) { return -1 }
	})

	sortedCities.forEach(cityAndPeople => {
		console.log(`${cityAndPeople.city}: ${cityAndPeople.people.length}`)
	})


	sortedCities.forEach(cityAndPeople => {
		console.log('****',cityAndPeople.city)
		ageAnalysis(cityAndPeople.people)
		console.log('\n')
		genderAnalysis(cityAndPeople.people)
		console.log('\n')
	})
}


function analizeByYear(data) {
	const years = []

	data.forEach(object => {
		const date = formattedDate(object.comingDate)
		if (date) {
			const year = date.year
			if (!years[year]) {
				years[year] = []
			}
			years[year].push(object)
		}
	})

	Object.keys(years).forEach(year => {
		console.log(`******** ${year}: ${years[year].length}`)
		analizeByMonth(years[year])
	})
}

function analizeByMonth(yearObjects) {
	const months = [];
	let summVisitsInYear = 0

	yearObjects.forEach(object => {
		const date = formattedDate(object.comingDate);
		const month = date.month

		if (!months[month]) { months[month] = [] }

		months[month].push(object)
	})

	months.forEach(visitorsInMonth => {
		summVisitsInYear += visitorsInMonth.length
	})

	Object.keys(months).forEach(month => {
		const monthVisits = months[month].length
		const relativeLength = (monthVisits/summVisitsInYear * 100).toFixed(0)
		console.log(`${month}${(month.length === 1) ? ' ' : ''}: ${printNumberSign(relativeLength)} (${monthVisits})`)
	})
}

function main() {
	let objectsList = getObjectsList()
	//ageAnalysis(objectsList)
	//averageAge()
	//citiesAnalysis(objectsList)
	analizeByYear(objectsList)
}

main()