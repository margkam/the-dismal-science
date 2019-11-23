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

        d3.select('#indicators-buttons')
            .append('button')
            .attr('id', 'yield-curve-button')
            .html('Yield Curve')
            .on('click', (d, i) => {
                this.showYieldCurve();
            })
        ;

        d3.select('#indicators-buttons')
            .append('button')
            .attr('id', 'investment-button')
            .html('Business Investment')
            .on('click', (d, i) => {
                this.showInvestment();
            })
        ;

        d3.select('#indicators-buttons')
        .append('button')
        .attr('id', 'unemployment-button')
        .html('Unemployment')
        .on('click', (d, i) => {
            this.showUnemployment();
        })
    ;

        this.svg = d3.select('#indicators-chart')
            .append('svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height)
        ;

        this.yieldCurveShowing = false;
    }

    display(recessions, yieldCurve, investment, unemployment) {
        this.recessions = recessions;
        this.yieldCurve = yieldCurve;
        this.investment = investment;
        this.unemployment = unemployment;

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

        //append a rect as a vertical line marking today
        this.svg.append('rect')
            .attr('id', 'today-line')
            .attr('x', timeScale(Date.now()) + this.config.axisWidth)
            .attr('y', 0)
            .attr('width', 1)
            .attr('height', this.config.height - this.config.axisWidth)
        ;
        
        this.addEventLabel("1990 Recession", timeScale(this.recessions[1].START), null);
        this.addEventLabel("Dot-Com Bust", timeScale(this.recessions[2].START), null);
        this.addEventLabel("The Great Recession", timeScale(this.recessions[3].START), null);
        this.addEventLabel("TODAY", timeScale(Date.now()), "today-label");

        //create and append x axis
        let xAxis = d3.axisBottom(timeScale);
        this.svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(${this.config.axisWidth}, ${this.config.height - this.config.axisWidth})`)
            .call(xAxis)
        ;

        //create indicator scales
        let yieldCurveScale = d3.scaleLinear()
            .domain([-1.5, 5.1])
            .range([this.config.height - this.config.axisWidth, 0])
        ;

        let investmentScale = d3.scaleLinear()
            .domain([0, 4800])
            .range([this.config.height - this.config.axisWidth, 0])
        ;

        let unemploymentScale = d3.scaleLinear()
            .domain([0, 15])
            .range([this.config.height - this.config.axisWidth, 0])
        ;

        //create indicator axes
        this.yieldCurveAxis = d3.axisLeft(yieldCurveScale);
        this.investmentAxis = d3.axisLeft(investmentScale);
        this.unemploymentAxis = d3.axisLeft(unemploymentScale);

        //append axis element
        this.svg.append('g')
            .attr('id', 'y-axis')
            .attr('transform', `translate(${this.config.axisWidth},0)`)
        ;

        //append path 
        this.svg.append('path')
            .attr('id', 'indicator-curve')
        ;
        
        // create indicator line generators
        this.yieldCurveGenerator = d3.line()
            .x(d => timeScale(d.DATE) + this.config.axisWidth)
            .y(d => yieldCurveScale(d.T10Y3MM))
        ;

        this.investmentGenerator = d3.line()
            .x(d => timeScale(d.DATE) + this.config.axisWidth)
            .y(d => investmentScale(d.GPDI))
        ;

        this.unemploymentGenerator = d3.line()
            .x(d => timeScale(d.DATE) + this.config.axisWidth)
            .y(d => unemploymentScale(d.UNRATE))
        ;

        this.showYieldCurve();
    }

    addEventLabel(name, scaledDate, id) {
        let x = scaledDate + this.config.axisWidth - 5;
        let y = 10;
        let text = this.svg.append('text')
            .html(name)
            .attr('class', 'event-label')
            .attr('x', x)
            .attr('y', y)
            .attr('transform', `rotate(270 ${x} ${y})`)
        ;

        if (id != null) {
            text.attr('id', id);
        }
    }

    showYieldCurve() {
        if (this.yieldCurveShowing) {
            return; // to avoid appending multiple zero-lines.
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
        // remove the zero line if there
        d3.select('#zero-line')
            .remove()
        ;

        // show investment
        d3.select('#indicator-curve')
            .attr('d', this.investmentGenerator(this.investment))
        ;

        // add the correct axis
        d3.select('#y-axis')
            .call(this.investmentAxis)
        ;

        this.yieldCurveShowing = false;
    }

    showUnemployment() {
        // remove the zero line if there
        d3.select('#zero-line')
            .remove()
        ;

        // show unemployment
        d3.select('#indicator-curve')
            .attr('d', this.unemploymentGenerator(this.unemployment))
        ;

        // add the correct axis
        d3.select('#y-axis')
            .call(this.unemploymentAxis)
        ;

        this.yieldCurveShowing = false;
    }
}
