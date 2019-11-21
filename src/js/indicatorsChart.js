class IndicatorsChart {
    constructor() {
        this.config = {
            width: 900,
            height: 500,
            axisWidth: 30,
        }

        this.svg = d3.select('#indicators-chart')
            .append('svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height)
        ;
    }

    display(recessions, yieldCurve) {
        this.recessions = recessions;
        this.yieldCurve = yieldCurve;

        this.timeScale = d3.scaleTime()
            //.domain([this.recessions[0].DATE, this.recessions[this.recessions.length - 1].DATE]) // make this change dynamically?
            .domain([Date.parse("1980-1-1"), Date.now()]) //for now, 1970 to today
            .range([0, this.config.width - this.config.axisWidth])
        ;

        this.yieldCurveScale = d3.scaleLinear()
            .domain([-1, 5])
            .range([this.config.height - this.config.axisWidth, 0])
        ;

        this.recessionTrue = this.recessions.filter(month => month.USREC == '1');

        // add rectangles for recessions (this adds rectangles for every MONTH of a recession)
        this.svg.selectAll('rect')
            .data(this.recessionTrue)
            .enter()
            .append('rect')
            .attr('x', d => this.timeScale(d.DATE) + this.config.axisWidth)
            .attr('y', 0)
            .attr('width', 2) // TODO: calculate a legitimate width value. In fact, filter data down even more
            .attr('height', this.config.height - this.config.axisWidth)
            .style('fill', 'red') //red for consistency across project (red indicates a recession)
            .style('opacity', 0.2) // it would be cool for opacity to encode severity of the recession. Perhaps measure severity by length of recession?
        ;

        //create and append x axis
        let xAxis = d3.axisBottom(this.timeScale);
        this.svg.append('g')
            .attr('id', 'xAxis')
            .attr('transform', `translate(${this.config.axisWidth}, ${this.config.height - this.config.axisWidth})`)
            .call(xAxis)
        ;

        //create and append y axis for yield curve chart
        let yieldCurveAxis = d3.axisLeft(this.yieldCurveScale);
        this.svg.append('g')
            .attr('id', 'yAxis')
            .attr('transform', `translate(${this.config.axisWidth},0)`)
            .call(yieldCurveAxis)
        ;

        // line generator for yield curve
        let yieldCurveGenerator = d3.line()
            .x(d => this.timeScale(d.DATE) + this.config.axisWidth)
            .y(d => this.yieldCurveScale(d.T10Y3MM))
        ;

        // data to create a horizontal line at 0
        this.zeroLine = [
            {
                DATE: 0,
                T10Y3MM: 0,
            },
            {
                DATE: Date.now(),
                T10Y3MM: 0,
            }
        ]

        // append the zero line
        this.svg.append('path')
            .attr('d', yieldCurveGenerator(this.zeroLine))
            .style('fill', 'transparent')
            .style('stroke', 'gray')
            .style('stroke-width', 2)
        ;

        // append the actual yield curve
        this.svg.append('path')
            .attr('d', yieldCurveGenerator(this.yieldCurve))
            .style('fill', 'transparent')
            .style('stroke', 'black')
        ;

    }

    update() {}
}
