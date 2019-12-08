let nextInstanceId = 0;

class TimeSlider {
    constructor(attachId, minYear, maxYear, selectedYear, yearsOnly) {
        this.subscribers = [];
        this.attachId = attachId;
        this.instanceId = nextInstanceId++;

        this.config = {
            width: 1200,
            height: 200,
            padding: {
                left: 10,
                right: 10
            },
            circle: {
                radius: 10,
                color: 'grey'
            }
        }

        this.yearRange = {
            min: minYear,
            max: maxYear
        }
        this.selectedYear = selectedYear;
        this.selectedMonth = 1;
        this.yearsOnly = yearsOnly;
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
            var millisecondsToWait = 1;
            if (this.yearsOnly) {
                this.nextYear();
                millisecondsToWait = 700;
            } else {
                this.nextMonth();
            }
            
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
        document.getElementById(`time-slider-id${this.instanceId}`).value = value;
        this.selectedYear = year;
        this.selectedMonth = month;
        this.updateSubscribers();
    }

    // set up the time slider, including buttons
    init() {
        let yearRange = d3.range(this.yearRange.min, this.yearRange.max + 1);

        let yearLabelConfig = {
            width: this.config.width,
            height: 25
        }

        let yearLabel = d3.select(`#${this.attachId}`)
            .select('.year-selector')
            .append('svg')
            .attr('height', yearLabelConfig.height)
            .attr('width', yearLabelConfig.width)
            .append('text')
            .text('Year')
            .attr('transform',
                  `translate(${(yearLabelConfig.width/2)} ,${(yearLabelConfig.height - 10)})`)
            .style("text-anchor", "middle")
            ;

        let sliderTime = d3.select(`#${this.attachId}`)
            .select('.year-selector')
            .append('input')
            .attr('type', 'range')
            .attr('min', this.yearRange.min)
            .attr('max', this.yearRange.max)
            .attr('list', 'tickmarks')
            .attr('id', `time-slider-id${this.instanceId}`)
            .attr('step', () => {
                return this.yearsOnly ? 1 : 1 / 12;
            })
            .classed('slider', true)
            .style('width', "83.9%")
            .on('change', (event) => {
                // determine month and year from slider value
                let value = document.getElementById(`time-slider-id${this.instanceId}`).value;
                let year = Math.trunc(value);
                let remainder = value - year;
                let month = Math.round(remainder * 12); // should always be 0 for yearly slider

                // update self and subscribers
                this.selectedYear = year;
                this.selectedMonth = month;
                this.updateSubscribers();
            })
            ;

        let ticks = d3.select(`#${this.attachId}`)
            .select('.year-selector')
            .append('datalist')
            .attr('class', 'ticks')
            .selectAll('.tick')
            .data(yearRange)
            .enter()
            .append('option')
            .attr('class', 'tick')
            .attr('value', (d) => { return d; })
            .attr('label', (d) => { return d + ' '; })
            //.attr('transform', 'rotate(270)')
            // .style('writing-mode', 'vertical-lr')
            // .style('text-orientation', 'mixed')
            ;


        let tickText = d3.select(`#${this.attachId}`)
            .select('option')
            .attr('transform', 'rotate(270)');
        console.log('YOU GOT is');
        console.log(tickText);

        // add buttons to step forward and back through the vis
        let previousYearButton = d3.select(`#${this.attachId}`)
            .select('.step-buttons')
            .append('button')
            .text('<< Previous Year')
            .on('click', () => {
                this.previousYear();
            })
            ;

        if (!this.yearsOnly) {
            let previousQuarterButton = d3.select(`#${this.attachId}`)
                .select('.step-buttons')
                .append('button')
                .text('< Previous Quarter')
                .on('click', () => {
                    this.previousQuarter();
                })
                ;

                /*
            let previousMonthButton = d3.select(`#${this.attachId}`)
                .select('.step-buttons')
                .append('button')
                .text('Previous Month')
                .on('click', () => {
                    this.previousMonth();
                })
                ;

            let nextMonthButton = d3.select(`#${this.attachId}`)
                .select('.step-buttons')
                .append('button')
                .text('Next Month')
                .on('click', () => {
                    this.nextMonth();
                })
                ;
                */

            let nextQuarterButton = d3.select(`#${this.attachId}`)
                .select('.step-buttons')
                .append('button')
                .text('Next Quarter >')
                .on('click', () => {
                    this.nextQuarter();
                })
                ;
        }

        let nextYearButton = d3.select(`#${this.attachId}`)
            .select('.step-buttons')
            .append('button')
            .text('Next Year >>')
            .on('click', () => {
                this.nextYear();
            })
            ;

        let playButton = d3.select(`#${this.attachId}`)
            .select('.play-stop-buttons')
            .append('button')
            .attr('class', 'play')
            .text('Play')
            .on('click', () => {
                this.startPlayMode();
            })
            ;

        playButton.append('svg')
            .attr('height', 15)
            .attr('width', 20)
            .append('path')
            .attr('d', 'M 8 4 20 10 8 16')
            .attr('fill', 'green')
            ;

        let stopButton = d3.select(`#${this.attachId}`)
            .select('.play-stop-buttons')
            .append('button')
            .text('Stop')
            .on('click', () => {
                this.stopPlayMode();
            })
            ;

        stopButton.append('svg')
            .attr('height', 15)
            .attr('width', 20)
            .append('path')
            .attr('d', 'M 5 5 5 17 17 17 17 5')
            .attr('fill', 'rgb(204, 0, 0)')

        let jumpToInput = d3.select(`#${this.attachId}`)
            .select('.play-stop-buttons')
            .append('text')
            .text('Jump To Time - ')
            .append('input')
            .attr('id', `jump-to-time-${this.attachId}`)
            .attr('type', 'text')
            .attr('class', 'validated-input valid')
            .on('change', () => {
                let val = document.getElementById(`jump-to-time-${this.attachId}`).value;
                try {
                    let parsed = this.parseDataTimeInput(val);
                    this.setValue(parsed.month, parsed.year);
                } catch (swallowed) {
                    console.log('swallowing', swallowed);
                }

            })
            .on('input', () => {
                let val = document.getElementById(`jump-to-time-${this.attachId}`).value;
                try {
                    this.parseDataTimeInput(val);
                    d3.select(`#jump-to-time-${this.attachId}`)
                        .classed('valid', true);
                } catch (myException) {
                    d3.select(`#jump-to-time-${this.attachId}`)
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
        if (input.startsWith('Q')) {
            let splitTime = input.split(' ');
            return {
                year: splitTime[1],
                month: quarterToMonth(splitTime[0])
            }
        } else {
            let date = new Date(input);
            if (this.yearsOnly) date = new Date(input, 0);
            if (date.toString() == 'Invalid Date') {
                throw 'Invalid date';
            } else if (date.getFullYear() < this.yearRange.min) {
                throw 'Date before data range';
            } else if (date.getFullYear() > this.yearRange.max) {
                throw 'Date in future';
            }
            return {
                year: date.getFullYear(),
                month: date.getMonth()
            }
        }
    }
}
