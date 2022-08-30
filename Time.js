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
        const newSecond = (newTime % 60).toFixed(3);
        const newMinute = parseInt(newTime / 60) % 60;
        const newHour = parseInt(newMinute / 60);
        return ([newHour, newMinute, newSecond].join(':')).replace(/\./g, ',');
    }
}

// checking the class

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