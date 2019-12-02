class IndicatorsChart {
    constructor() {
        this.config = {
            axisWidth: 50,
            graphHeight: 450, // 'graph' refers to the part of the svg that shows the line graph itself, not including axes
            graphWidth: 850, 
            paddingRight: 70,
            margin: 25,
            econTextWidth: 250,
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
            .attr('width', this.config.axisWidth + this.config.graphWidth + this.config.paddingRight)
            .attr('height', this.config.graphHeight + this.config.axisWidth)
            .style('margin-top', this.config.margin.toString() + 'px')
            .style('margin-left', this.config.margin.toString() + 'px')
        ;

        this.econText = {
            'Yield Curve' : '[A brief definition of the economic term "yield curve" for the benefit of the non-economist viewer]',
            'Business Investment' : '[A brief definition of the economic term "business investment" for the benefit of the non-economist viewer]',
            'Unemployment' : '[A brief definition of the economic term "unemployment" for the benefit of the non-economist viewer]',
        }
        
        this.econTextElement = d3.select('#indicators-chart')
            .append('div')
            .style('width', this.config.econTextWidth.toString() + 'px')
            .attr('id', 'econ-text')
        ;

        this.econTextElement.title = this.econTextElement.append('h3');
        this.econTextElement.text = this.econTextElement.append('p');

        this.yieldCurveShowing = false;
    }

    display(recessions, yieldCurve, investment, unemployment) {
        this.recessions = recessions;
        this.yieldCurve = yieldCurve;
        this.investment = investment;
        this.unemployment = unemployment;

        let timeScale = d3.scaleTime()
            .domain([this.config.startDate, this.config.endDate])
            .range([0, this.config.graphWidth])
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
            .attr('height', this.config.graphHeight)
            // it would be cool for opacity to encode severity of the recession. Perhaps measure severity by length of recession?
        ;

        //append a rect as a vertical line marking today
        this.svg.append('rect')
            .attr('id', 'today-line')
            .attr('x', timeScale(Date.now()) + this.config.axisWidth)
            .attr('y', 0)
            .attr('width', 1)
            .attr('height', this.config.graphHeight)
        ;
        
        this.addEventLabel("1990 Recession", timeScale(this.recessions[1].START), null);
        this.addEventLabel("Dot-Com Bust", timeScale(this.recessions[2].START), null);
        this.addEventLabel("The Great Recession", timeScale(this.recessions[3].START), null);
        this.addEventLabel("TODAY", timeScale(Date.now()), "today-label");

        //create and append x axis
        let xAxis = d3.axisBottom(timeScale)
            .tickSizeOuter(0)
        ;

        this.svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(${this.config.axisWidth}, ${this.config.graphHeight})`)
            .call(xAxis)
        ;

        //append x axis label
        this.svg.append('text')
            .html('Year')
            .attr('class', 'axis-label')
            .attr('x', this.config.axisWidth + this.config.graphWidth/2)
            .attr('y', this.config.graphHeight + this.config.axisWidth - 15)
        ;

        //create indicator scales
        let yieldCurveScale = d3.scaleLinear()
            .domain([-1.5, 5.1])
            .range([this.config.graphHeight, 0])
        ;

        let investmentScale = d3.scaleLinear()
            .domain([0, 4.8])
            .range([this.config.graphHeight, 0])
        ;

        let unemploymentScale = d3.scaleLinear()
            .domain([0, 15])
            .range([this.config.graphHeight, 0])
        ;

        //create indicator axes
        this.yieldCurveAxis = d3.axisLeft(yieldCurveScale)
            .tickSizeOuter(0)
        ;
        this.investmentAxis = d3.axisLeft(investmentScale)
            .tickSizeOuter(0)
        ;
        this.unemploymentAxis = d3.axisLeft(unemploymentScale)
            .tickSizeOuter(0)
        ;

        //append y axis element
        this.svg.append('g')
            .attr('id', 'y-axis')
            .attr('transform', `translate(${this.config.axisWidth},0)`)
        ;

        //append y axis label element
        let x = 15;
        let y = this.config.graphHeight/2;
        this.svg.append('text')
            .attr('id', 'y-axis-label')
            .attr('class', 'axis-label')
            .attr('x', x)
            .attr('y', y)
            .attr('transform', `rotate(270 ${x} ${y})`)
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

        
        // show line and tooltip on hover

        let tooltip = this.svg.append('g')
            .attr('display', 'none')
        ;

        tooltip.append('rect')
            .attr('id', 'hover-line')
            .attr('y', 0)
            .attr('width', 1)
            .attr('height', this.config.graphHeight)
        ;

        let hoverLabel = tooltip.append('g')
            .attr('id', 'hover-label')
        ;
        
        hoverLabel.append('rect')
            .attr('id', 'hover-label-rect')
            .attr('x', 1)
            .attr('y', -35)
            .attr('width', 70)
            .attr('height', 35)
        ;

        hoverLabel.append('text')
            .attr('id', 'hover-text-date')
            .attr('class', 'hover-text')
            .attr('x', 7)
            .attr('y', -20)
        ;

        hoverLabel.append('text')
            .attr('id', 'hover-text-data')
            .attr('class', 'hover-text')
            .attr('x', 7)
            .attr('y', -5)
        ;        

        this.tooltipDict = {};
        let bigThis = this;
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.svg.append('rect')
            .attr('class', 'overlay')
            .attr('x', this.config.axisWidth)
            .attr('width', this.config.graphWidth)
            .attr('height', this.config.graphHeight)
            .on('mouseover', function() {
                tooltip.attr('display', null);
            })
            .on('mousemove', function() {
                let x = d3.mouse(this)[0];
                let y = d3.mouse(this)[1];
                var date = timeScale.invert(x - bigThis.config.axisWidth);
                var dateString = `${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
                var data = bigThis.tooltipDict[dateString];
                
                d3.select('#hover-line')
                    .attr('x', x)
                ;

                d3.select('#hover-label')
                    .attr('transform', `translate(${x},${y})`)
                ;

                d3.select('#hover-text-date')
                    .html(`${dateString}:`)
                ;

                let dataDisplay = d3.select('#hover-text-data');
                if (data == undefined) {
                    dataDisplay.attr('display', 'none');
                } else {
                    dataDisplay.html(`${bigThis.tooltipDict['pre']}${data}${bigThis.tooltipDict['post']}`)
                        .attr('display', null)
                    ;
                }
            })
            .on('mouseout', function() {
                tooltip.attr('display', 'none');
            })
        ;

        //set up data access for tooltip
        this.yieldCurveDict = {};
        this.yieldCurve.map(d => {
            let date = new Date(d.DATE);
            let index = months[date.getUTCMonth()] + " " + date.getUTCFullYear().toString();
            this.yieldCurveDict[index] = d.T10Y3MM.toFixed(2);
        });
        this.yieldCurveDict['pre'] = "";
        this.yieldCurveDict['post'] = "%";
    
        this.investmentDict = {};
        this.investment.forEach(d => {
            let date = new Date(d.DATE);
            let month = date.getUTCMonth();
            let data = d.GPDI.toFixed(2);
            this.investmentDict[months[month] + " " + date.getUTCFullYear().toString()] = data;
            this.investmentDict[months[month+1] + " " + date.getUTCFullYear().toString()] = data;
            this.investmentDict[months[month+2] + " " + date.getUTCFullYear().toString()] = data;          
        });
        this.investmentDict['pre'] = "$";
        this.investmentDict['post'] = "T";
        this.investmentDict['Aug 2019'] = undefined; //compensate for showing data through whole quarter
        this.investmentDict['Sep 2019'] = undefined;
        
        this.unemploymentDict = {};
        this.unemployment.forEach(d => {
            let date = new Date(d.DATE);
            let index = months[date.getUTCMonth()] + " " + date.getUTCFullYear().toString();
            this.unemploymentDict[index] = d.UNRATE.toFixed(2);
        });
        this.unemploymentDict['pre'] = "";
        this.unemploymentDict['post'] = "%";

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

    setEconText(title) {
        this.econTextElement.title.html(title + ':');
        this.econTextElement.text.html(this.econText[title]);
    }

    showYieldCurve() {
        if (this.yieldCurveShowing) {
            return; // to avoid appending multiple zero-lines.
        }

        //highlight correct button
        d3.select('#indicators-buttons')
            .selectAll('button')
            .classed('selected', false)
        ;

        d3.select('#yield-curve-button')
            .classed('selected', true)
        ;

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

        d3.select('#y-axis-label')
            .html('10 Year Minus 3 Month Treasury Constant Maturity (%)')
        ;

        this.yieldCurveShowing = true;
        this.tooltipDict = this.yieldCurveDict;
        this.setEconText('Yield Curve');
    }

    showInvestment() {
        //highlight correct button
        d3.select('#indicators-buttons')
            .selectAll('button')
            .classed('selected', false)
        ;

        d3.select('#investment-button')
            .classed('selected', true)
        ;

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

        d3.select('#y-axis-label')
            .html('Gross Private Domestic Investment (USD, Trillions)')
        ;

        this.yieldCurveShowing = false;
        this.tooltipDict = this.investmentDict;
        this.setEconText('Business Investment');
    }

    showUnemployment() {
        //highlight correct button
        d3.select('#indicators-buttons')
            .selectAll('button')
            .classed('selected', false)
        ;

        d3.select('#unemployment-button')
            .classed('selected', true)
        ;

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

        d3.select('#y-axis-label')
            .html('Unemployment Rate (%)')
        ;

        this.yieldCurveShowing = false;
        this.tooltipDict = this.unemploymentDict;
        this.setEconText('Unemployment');
    }
}
