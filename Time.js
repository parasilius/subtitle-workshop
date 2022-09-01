class Time {
    constructor(string) {
        this.string = string;
    }

    get second() {
        return this.calcSecond();
    }

    get minute() {
        return this.calcMinute();
    }

    get hour() {
        return this.calcHour();
    }

    calcSecond() {
        return parseFloat(this.string.split(':')[2].replace(/,/g, '.'));
    }

    calcMinute() {
        return this.string.split(':').map(Number)[1];
    }

    calcHour() {
        return this.string.split(':').map(Number)[0];
    }

    convertToSeconds() {
        return this.calcSecond() + 60 * this.calcMinute() + 3600 * this.calcHour();
    }

    addSeconds(seconds) {
        this.seconds = parseFloat(seconds.replace(/,/g, '.'));
        const newTime = this.convertToSeconds() + this.seconds;
        const newSecond = ('0' + (newTime % 60).toFixed(3)).slice(-6);
        const newMinute = ('0' + (parseInt(newTime / 60) % 60)).slice(-2);
        const newHour = ('0' + parseInt(newMinute / 60)).slice(-2);
        return ([newHour, newMinute, newSecond].join(':')).replace(/\./g, ',');
    }
}

module.exports = { Time }

/****************** checking the class ******************

const myTimeString = "00:14:31,134"
const myTime = new Time(myTimeString);

console.log(`${myTimeString} is:`)
console.log(`Hour: ${myTime.hour}`);
console.log(`Minute: ${myTime.minute}`);
console.log(`Second: ${myTime.second}`);

// results can be checked with https://www.calculator.net/time-calculator.html
let seconds = "91.712";
console.log(`Adding ${seconds} seconds from ${myTimeString} results in ${myTime.addSeconds(seconds)}`);
seconds = "-91.712";
console.log(`Adding ${seconds} seconds from ${myTimeString} results in ${myTime.addSeconds(seconds)}`);

******************* checking the calass ******************/