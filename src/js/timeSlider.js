class TimeSlider {
    constructor() {
        this.subscribers = [];
        this.yearRange = {
            min: 1982,
            max: 2019
        }
        this.selectedYear = 2007;
        this.selectedMonth = 1;
    }

    // add a subscriber to this TimeSlider subject. The subscriber
    // must have an update method that takes a month and a year as params
    addSubscriber(subscriber) {
        this.subscribers.push(subscriber);
    }

    // send the updated month and year to all observers
    updateSubscribers() {
        this.subscribers.forEach((subscriber) => {
            subscriber.update(this.selectedMonth, this.selectedYear);
        })
    }

    previousYear() {
        this.selectedYear = Math.max(this.yearRange.min, this.selectedYear - 1);
        this.setValue(this.selectedMonth, this.selectedYear);
    }

    // several functions to advance the slider forward or backward a certain period
    previousQuarter() {
        let month = this.selectedMonth - 3;
        let year = this.selectedYear;
        if (month < 0) {
            month += 12;
            year--;
        }
        this.setValue(month, year);
    }

    previousMonth() {
        let month = this.selectedMonth - 1;
        let year = this.selectedYear;
        if (month < 0) {
            month = 12;
            year--;
        }
        this.setValue(month, year);
    }

    nextMonth() {
        let month = this.selectedMonth + 1;
        let year = this.selectedYear;
        if (month > 12) {
            month = 1;
            year++;
        }
        this.setValue(month, year);
    }

    nextQuarter() {
        let month = this.selectedMonth + 3;
        let year = this.selectedYear;
        if (month > 12) {
            month -= 12;
            year++;
        }
        this.setValue(month, year);
    }

    nextYear() {
        this.selectedYear = Math.min(this.yearRange.max, this.selectedYear + 1);
        this.setValue(this.selectedMonth, this.selectedYear);
    }

    // method to begin the slider incrementing its value and updating its observers
    startPlayMode() {
        this.playModeImpl();
    }

    stopPlayMode() {
        this.previouslySelectedYear = this.selectedYear;
        this.selectedYear = this.yearRange.max;
    }

    playModeImpl() {
        if (this.selectedYear < this.yearRange.max) {
            this.nextMonth();
            var millisecondsToWait = 1;
            setTimeout(() => {
                this.startPlayMode()
            }, millisecondsToWait);
        } else {
            this.selectedYear = this.previouslySelectedYear;
        }
    }

    setValue(month, year) {
        if (year < this.yearRange.min || year > this.yearRange.max) {
            return;
        }

        let value = +year + (+month * 1 / 12);

        console.log('setting value to ', value);
        console.log('year', year, 'month', month);
        document.getElementById("time-slider-id").value = value;
        this.selectedYear = year;
        this.selectedMonth = month;
        this.updateSubscribers();
    }

    // set up the time slider, including buttons
    init() {
        let yearRange = d3.range(this.yearRange.min, this.yearRange.max);

        let sliderTime = d3.select('#year-selector')
            .append('input')
            .attr('type', 'range')
            .attr('min', this.yearRange.min)
            .attr('max', this.yearRange.max)
            .attr('list', 'tickmarks')
            .attr('id', 'time-slider-id')
            .attr('step', 1 / 12)
            .classed('slider', true)
            .style('width', "83%")
            .on('change', (event) => {
                // determine month and year from slider value
                let value = document.getElementById('time-slider-id').value;
                let year = Math.trunc(value);
                let remainder = value - year;
                let month = Math.round(remainder * 12);

                // update self and subscribers
                this.selectedYear = year;
                this.selectedMonth = month;
                this.updateSubscribers();
            })
            ;

        let ticks = d3.select('#year-selector')
            .append('datalist')
            .attr('class', 'ticks')
            .selectAll('.tick')
            .data(yearRange)
            .enter()
            .append('option')
            .attr('class', 'tick')
            .attr('value', (d) => { return d; })
            .attr('label', (d) => { return d + ' '; })
            ;

        // add buttons to step forward and back through the vis
        let previousYearButton = d3.select('#step-buttons')
            .append('button')
            .text('Previous Year')
            .on('click', () => {
                this.previousYear();
            })
            ;

        let previousQuarterButton = d3.select('#step-buttons')
            .append('button')
            .text('Previous Quarter')
            .on('click', () => {
                this.previousQuarter();
            })
            ;

        let previousMonthButton = d3.select('#step-buttons')
            .append('button')
            .text('Previous Month')
            .on('click', () => {
                this.previousMonth();
            })
            ;

        let nextMonthButton = d3.select('#step-buttons')
            .append('button')
            .text('Next Month')
            .on('click', () => {
                this.nextMonth();
            })
            ;

        let nextQuarterButton = d3.select('#step-buttons')
            .append('button')
            .text('Next Quarter')
            .on('click', () => {
                this.nextQuarter();
            })
            ;

        let nextYearButton = d3.select('#step-buttons')
            .append('button')
            .text('Next Year')
            .on('click', () => {
                this.nextYear();
            })
            ;

        let playButton = d3.select('#play-stop-buttons')
            .append('button')
            .text('Play')
            .on('click', () => {
                this.startPlayMode();
            })
            ;

        let stopButton = d3.select('#play-stop-buttons')
            .append('button')
            .text('Stop')
            .on('click', () => {
                this.stopPlayMode();
            })
            ;

        let jumpToInput = d3.select('#play-stop-buttons')
            .append('text')
            .text('Jump To Time - ')
            .append('input')
            .attr('id', 'jump-to-time')
            .attr('type', 'text')
            .attr('class', 'validated-input valid')
            .on('change', () => {
                let val = document.getElementById('jump-to-time').value;
                try {
                    let parsed = this.parseDataTimeInput(val);
                    this.setValue(parsed.month, parsed.year);
                } catch(swallowed) { 
                    console.log('swallowing', swallowed);
                }
 
            })
            .on('input', () => {
                let val = document.getElementById('jump-to-time').value;
                try {
                    this.parseDataTimeInput(val);
                    d3.select('#jump-to-time')
                      .classed('valid', true);
                } catch(myException) {
                    d3.select('#jump-to-time')
                      .classed('valid', false)
                      ;
                }
            })
            ;

        // set the starting value for the slider
        this.setValue(this.selectedMonth, this.selectedYear);
    }

    // handle parsing of input from the jump to input box
    // warning: this method throws. Frequently. 
    parseDataTimeInput(input) {
        if(input.startsWith('Q')) {
            let splitTime = input.split(' ');
            return {
                year: splitTime[1],
                month: quarterToMonth(splitTime[0])
            }
        } else {
            let date = new Date(input);
            if(date.toString() == 'Invalid Date') {
                throw 'Invalid date';
            } else if(date.getFullYear() < this.yearRange.min) {
                throw 'Date before data range';
            } else if(date.getFullYear() > this.yearRange.max) {
                throw 'Date in future';
            }
            return {
                year: date.getFullYear(),
                month: date.getMonth()
            }
        }
    }
}
