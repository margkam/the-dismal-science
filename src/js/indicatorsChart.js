class IndicatorsChart {
    constructor() {
        this.config = {
            width: 900,
            height: 500,
            axisWidth: 20,
        }

        this.svg = d3.select('#indicators-chart')
            .append('svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height)
        ;
    }

    display(recessions) {
        this.recessions = recessions;

        this.timeScale = d3.scaleTime()
            .domain([this.recessions[0].DATE, this.recessions[this.recessions.length - 1].DATE])
            .range([0, this.config.width - this.config.axisWidth])
        ;

        this.recessionTrue = this.recessions.filter(month => month.USREC == '1');

        this.svg.selectAll('rect')
            .data(this.recessionTrue)
            .enter()
            .append('rect')
            .attr('x', d => this.timeScale(d.DATE) + this.config.axisWidth)
            .attr('y', 0)
            .attr('width', 2) // TODO: calculate a legitimate width value. In fact, filter data down even more
            .attr('height', this.config.height - this.config.axisWidth)
            .style('fill', 'red') //red for consistency across project (red indicates a recession)
            .style('opacity', 0.2)
        ;

        let xAxis = d3.axisBottom(this.timeScale);

        this.svg.append('g')
            .attr('id', 'xAxis')
            .attr('transform', `translate(${this.config.axisWidth}, ${this.config.height - this.config.axisWidth})`)
            .call(xAxis)
        ;
    }

    update() {}
}
