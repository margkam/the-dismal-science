class IndicatorsChart {
    constructor() {
        this.config = {
            width: 900,
            height: 500,
            axisWidth: 50,
        }

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
            //.domain([this.recessions[0].DATE, this.recessions[this.recessions.length - 1].DATE]) // make this change dynamically?
            .domain([Date.parse("1980-1-1"), Date.now()]) //for now, 1980 to today
            .range([0, this.config.width - this.config.axisWidth])
        ;       

        this.recessionTrue = this.recessions.filter(month => month.USREC == '1');

        // add rectangles for recessions (this adds rectangles for every MONTH of a recession)
        this.svg.selectAll('rect')
            .data(this.recessionTrue)
            .enter()
            .append('rect')
            .attr('x', d => timeScale(d.DATE) + this.config.axisWidth)
            .attr('y', 0)
            .attr('width', 2) // TODO: calculate a legitimate width value. In fact, filter data down even more
            .attr('height', this.config.height - this.config.axisWidth)
            .style('fill', 'red') //red for consistency across project (red indicates a recession)
            .style('opacity', 0.2) // it would be cool for opacity to encode severity of the recession. Perhaps measure severity by length of recession?
        ;

        //create and append x axis
        let xAxis = d3.axisBottom(timeScale);
        this.svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(${this.config.axisWidth}, ${this.config.height - this.config.axisWidth})`)
            .call(xAxis)
        ;

        //create indicator scales
        let yieldCurveScale = d3.scaleLinear()
            .domain([-1, 5])
            .range([this.config.height - this.config.axisWidth, 0])
        ;

        let investmentScale = d3.scaleLinear()
            .domain([0, 5000])
            .range([this.config.height - this.config.axisWidth, 0])
        ;

        //append path 
        this.svg.append('path')
            .attr('id', 'indicator-curve')
            .style('fill', 'transparent')
            .style('stroke', 'black')
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
            .style('fill', 'transparent')
            .style('stroke', 'gray')
            .style('stroke-width', 2)
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
