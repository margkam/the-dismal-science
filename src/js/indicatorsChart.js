class IndicatorsChart {
    constructor() {
        this.config = {
            width: 900,
            height: 500,
            axisWidth: 50,
            startDate: Date.parse("1982-1-1"),
            endDate: Date.parse("2021-1-1"),
        }

        // data to create a horizontal line at 0
        this.zeroLine = [
            {
                DATE: this.config.startDate,
                T10Y3MM: 0,
            },
            {
                DATE: this.config.endDate,
                T10Y3MM: 0,
            }
        ]

        d3.select('#indicators-chart')
            .append('button')
            .attr('id', 'yield-curve-button')
            .html('Yield Curve')
            .on('click', (d, i) => {
                this.showYieldCurve();
            })
        ;

        d3.select('#indicators-chart')
            .append('button')
            .attr('id', 'investment-button')
            .html('Business Investment')
            .on('click', (d, i) => {
                this.showInvestment();
            })
        ;

        this.svg = d3.select('#indicators-chart')
            .append('svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height)
        ;

        this.yieldCurveShowing = false;
    }

    display(recessions, yieldCurve, investment) {
        this.recessions = recessions;
        this.yieldCurve = yieldCurve;
        this.investment = investment;

        let timeScale = d3.scaleTime()
            .domain([this.config.startDate, this.config.endDate])
            .range([0, this.config.width - this.config.axisWidth])
        ;       

        // add rectangles for recessions 
        this.svg.selectAll('rect')
            .data(this.recessions)
            .enter()
            .append('rect')
            .attr('class', 'recession')
            .attr('x', d => timeScale(d.START) + this.config.axisWidth)
            .attr('y', 0)
            .attr('width', d => timeScale(d.END) - timeScale(d.START))
            .attr('height', this.config.height - this.config.axisWidth)
            // it would be cool for opacity to encode severity of the recession. Perhaps measure severity by length of recession?
        ;

        //create and append x axis
        let xAxis = d3.axisBottom(timeScale);
        this.svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(${this.config.axisWidth}, ${this.config.height - this.config.axisWidth})`)
            .call(xAxis)
        ;

        //append a rect as a vertical line marking today
        this.svg.append('rect')
            .attr('id', 'today-line')
            .attr('x', timeScale(Date.now()) + this.config.axisWidth)
            .attr('y', 0)
            .attr('width', 1)
            .attr('height', this.config.height - this.config.axisWidth)
        ;

        //create indicator scales
        let yieldCurveScale = d3.scaleLinear()
            .domain([-1, 4.8])
            .range([this.config.height - this.config.axisWidth, 0])
        ;

        let investmentScale = d3.scaleLinear()
            .domain([0, 4800])
            .range([this.config.height - this.config.axisWidth, 0])
        ;

        //append path 
        this.svg.append('path')
            .attr('id', 'indicator-curve')
        ;

        //append axis element
        this.svg.append('g')
            .attr('id', 'y-axis')
            .attr('transform', `translate(${this.config.axisWidth},0)`)
        ;
        
        //create indicator axes
        this.yieldCurveAxis = d3.axisLeft(yieldCurveScale);
        this.investmentAxis = d3.axisLeft(investmentScale);
        
        // create indicator line generators
        this.yieldCurveGenerator = d3.line()
            .x(d => timeScale(d.DATE) + this.config.axisWidth)
            .y(d => yieldCurveScale(d.T10Y3MM))
        ;

        this.investmentGenerator = d3.line()
            .x(d => timeScale(d.DATE) + this.config.axisWidth)
            .y(d => investmentScale(d.GPDI))
        ;

        this.showYieldCurve();
    }

    showYieldCurve() {
        //console.log("showing yield curve...");

        if (this.yieldCurveShowing) {
            return;
        }

        // append the zero line
        this.svg.append('path')
            .attr('id', 'zero-line')
            .attr('d', this.yieldCurveGenerator(this.zeroLine))
        ;

        // show the yield curve
        d3.select('#indicator-curve')
            .attr('d', this.yieldCurveGenerator(this.yieldCurve))
        ;

        // add the correct axis
        d3.select('#y-axis')
            .call(this.yieldCurveAxis)
        ;

        this.yieldCurveShowing = true;
    }

    showInvestment() {
        //console.log("showing investment...");
        
        if (!this.yieldCurveShowing) {
            return;
        }

        // remove the zero line
        d3.select('#zero-line')
            .remove()
        ;

        // show the yield curve
        d3.select('#indicator-curve')
            .attr('d', this.investmentGenerator(this.investment))
        ;

        // add the correct axis
        d3.select('#y-axis')
            .call(this.investmentAxis)
        ;

        this.yieldCurveShowing = false;
    }
}
