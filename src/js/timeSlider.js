class TimeSlider {
    constructor() {
        this.subscribers = [];
        this.yearRange = {
            min: 1982,
            max: 2019
        }
    }

    addSubscriber(subscriber) {
        this.subscribers.push(subscriber);
    }

    init() {
        // Time
        let dataTime = d3.range(0, 40).map(function (d) {
            return new Date(1980 + d, 10, 3);
        });
        let yearRange = d3.range(this.yearRange.min, this.yearRange.max);
        let selectedDate = new Date(1998, 10, 3);

        let sliderTime = d3.select('#year-selector')
            .append('input')
            .attr('type', 'range')
            .attr('min', this.yearRange.min)
            .attr('max', this.yearRange.max)
            .classed('slider', true)
            .attr('step', 1)
            .style('width', "83%")
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
    }
}
