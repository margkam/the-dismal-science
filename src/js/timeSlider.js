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

    addSubscriber(subscriber) {
        this.subscribers.push(subscriber);
    }

    updateSubscribers() {
        console.log('this.subscribers', this.subscribers);
        this.subscribers.forEach((subscriber) => {
            subscriber.update(this.selectedMonth, this.selectedYear);
        })
    }

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
        this.setValue(this.selectedMonth, this.selectedYear + 1);
    }

    startPlayMode() {
        this.keepPlaying = true;
        this.playModeImpl();
    }

    stopPlayMode() {
        this.keepPlaying = false;
    }

    playModeImpl() {
        if (!this.keepPlaying) {
            console.log('stopped in impl');
            return;
        }
        if (this.selectedYear < this.yearRange.max && this.keepPlaying) {
            this.nextMonth();
            var millisecondsToWait = 1;
            setTimeout(() => {
                console.log('Another loop');
                this.startPlayMode()
            }, millisecondsToWait);
        }
    }

    setValue(month, year) {
        if (year < this.yearRange.min || year > this.yearRange.max) {
            return;
        }

        let value = year + (month * 1 / 12);

        document.getElementById("time-slider-id").value = value;
        this.selectedYear = year;
        this.selectedMonth = month;
        this.updateSubscribers();
    }

    init() {
        // Time
        let dataTime = d3.range(0, 40).map(function (d) {
            return new Date(1980 + d, 10, 3);
        });
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

        let previousQuarterButton = d3.select('#year-selector')
            .append('button')
            .text('Previous Quarter')
            .on('click', () => {
                console.log('Previous');
                this.previousQuarter();
            })
            ;

        let previousMonthButton = d3.select('#year-selector')
            .append('button')
            .text('Previous Month')
            .on('click', () => {
                console.log('Previous');
                this.previousMonth();
            })
            ;

        let playButton = d3.select('#year-selector')
            .append('button')
            .text('Play')
            .on('click', () => {
                this.startPlayMode();
            })
            ;

        let stopButton = d3.select('#year-selector')
            .append('button')
            .text('Stop')
            .on('click', () => {
                this.stopPlayMode();
            })
            ;

        let nextMonthButton = d3.select('#year-selector')
            .append('button')
            .text('Next Month')
            .on('click', () => {
                this.nextMonth();
            })
            ;


        let nextQuarterButton = d3.select('#year-selector')
            .append('button')
            .text('Next Quarter')
            .on('click', () => {
                this.nextQuarter();
            })
            ;

        this.setValue(this.selectedMonth, this.selectedYear);
    }
}
