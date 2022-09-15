require('dotenv').config()

const express = require('express')
const cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')


const app = express()

app.use(express.json())
app.use(cors())


let city = '' //Name of the city
let country = '' //Name of the country
let tempretureInCelsius = '' //Tempreture in Celsius
let tempretureInFahrenheit = '' //Tempreture in Fahrenheit
let condition = '' //Weather condition
let wind = '' //Wind speed
let highInCelsius = '' //highest tempreture in Celsius
let lowInCelsius = '' //Lowest tempreture in Celsius
let highInFahrenheit = '' //Hightest tempreture in Fahrenheit
let lowInFahrenheit = '' //Lowest tempreture in Fahrenheit
let visibilityInKM = '' //Visibility value in Km
let visibilityInMiles = '' //Visibility value in Miles
let humidity = '' //Humidity value
let UVIndex = '' //UV index value



let weatherData = {} //Object that stores the weather data and is send to the client


app.get('/', function (req, res) {
    res.send('Use the endpoint /api/cityname to get weather data')
})

app.get('/api/:searchText', function (req, res) {

    const cityName = req.params.searchText

    axios.get(`https://in.search.yahoo.com/search;_ylt=Awr1SXiCmCFjXAUGBNm7HAx.;_ylc=X1MDMjExNDcyMzAwMwRfcgMyBGZyA3NmcARmcjIDc2ItdG9wBGdwcmlkA0RpUHRpajdZUWkyYURTTjVCZjNDOUEEbl9yc2x0AzAEbl9zdWdnAzUEb3JpZ2luA2luLnNlYXJjaC55YWhvby5jb20EcG9zAzAEcHFzdHIDBHBxc3RybAMwBHFzdHJsAzEzBHF1ZXJ5A3dlYXRoZXIlMjBwYXJpcwR0X3N0bXADMTY2MzE0NjE1Ng--?p=weather+${cityName}&fr2=sb-top&fr=sfp&vm=r`).then(function (response) {

        const html = response.data
        const $ = cheerio.load(html)


        city = $('div.cptn-ctnt>p.txt').text()

        country = $('div.cptn-ctnt>p.subTxt').text()

        tempretureInCelsius = $('div>span.currTemp').text() + '°'

        tempretureInFahrenheit = convertClesiusToFahrenheit(tempretureInCelsius)

        condition = $('span.condition').text()

        wind = $('div.subInfo > span.txt>span.num').text()

        highInCelsius = $('span.temp-ctnt > span.high').text()

        highInFahrenheit = convertClesiusToFahrenheit(highInCelsius)

        lowInCelsius = $('span.temp-ctnt > span.low').text()

        lowInFahrenheit = convertClesiusToFahrenheit(lowInCelsius)

        UVIndex = $('#left > div > ol.cardReg.searchTop > li > div > div > div.compWeatherTextList.bb-1.toggle.plr-10 > ul.wthr-list.gnrl > li:nth-child(4) > span > span').text()

        humidity = $('#left > div > ol.cardReg.searchTop > li > div > div > div.compWeatherTextList.bb-1.toggle.plr-10 > ul.wthr-list.gnrl > li:nth-child(3) > span > span').text()

        visibilityInKM = $('#left > div > ol.cardReg.searchTop > li > div > div > div.compWeatherTextList.bb-1.toggle.plr-10 > ul.wthr-list.gnrl > li:nth-child(2) > span > span').text()

        visibilityInMiles = convertKmtoMiles(visibilityInKM)


        weatherData = {
            City: city,
            Country: country,
            Tempreture_in_Celsius: tempretureInCelsius,
            Tempreture_in_Fahrenheit: tempretureInFahrenheit,
            Weather_condition: condition,
            Wind_speed: wind,
            High_in_Celsius: highInCelsius,
            High_in_Fahrenheit: highInFahrenheit,
            Low_in_Celsius: lowInCelsius,
            Low_in_Fahrenheit: lowInFahrenheit,
            UV_index: UVIndex,
            Humidity: humidity,
            Visibility_In_Km: visibilityInKM,
            Visibility_In_Miles: visibilityInMiles

        }

        /**
         * Converts tempreture from celsius to fahrenheit.
         * Takes tempreture in celsius as a string and returns
         * tempreture in fahrenheit in string with degree symbol
         */
        function convertClesiusToFahrenheit(tempInC) {
            const tempCDouble = parseFloat(tempInC)
            const tempFDouble = tempCDouble * 1.8 + 32
            const tempFDouble2 = Math.round(tempFDouble * Math.pow(10, 2)) / Math.pow(10, 2);
            return tempFDouble2.toString() + '°'
        }

        /**
         * Converts distance from Km to Miles.
         * Takes distance as a string in Km and returns 
         * Double after converting into Miles
         */
        function convertKmtoMiles(disInKM) {
            const disInKMDouble = parseFloat(disInKM)
            const disInMilesDouble = disInKMDouble * 0.6
            const disInKMDouble2 = Math.round(disInMilesDouble * Math.pow(10, 2)) / Math.pow(10, 2);
            return disInKMDouble2.toString() + 'mi'
        }


        res.json(weatherData)
    })
})


app.listen(process.env.PORT || 5000, function () {
    console.log(`Server is running`)
})