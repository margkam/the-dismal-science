class Ripple {
    constructor() {
        this.config = {
            scale: 180,
            width: 1200,
            height: 600,
            padding: {
                top: 10,
                left: 10,
                right: 10,
                bottom: 10
            }
        }
        this.projection = d3.geoEquirectangular()
            .scale(this.config.scale)
            //.translate([this.config.padding.left, this.config.padding.top])
            ;

        this.posGdpScale = d3.scaleLinear().domain([0.0, 4.0])
            .range(['white', 'green']);
        this.negativeColorScale = d3.scaleLinear().domain([-4.0, 0.0])
            .range(['red', 'white']);

        this.unemploymentColorScale = d3.scaleLinear().domain([0.0, 20.0])
            .range(['white', 'blue']);


        this.selectedYear = 2007;
        this.selectedQuarter = 'Q1';
        this.selectedMonth = 1;

        this.selectedPosColorScale = this.posGdpScale;
    }

    // initialize the vis, passing in the data that will be used in different modes
    init(gdpGrowthData, unemploymentData) {
        gdpGrowthData.isMonthly = false;
        unemploymentData.isMonthly = true;

        this.gdpGrowthData = gdpGrowthData;
        this.unemploymentData = unemploymentData;
        this.selectedData = this.gdpGrowthData;

        d3.select('#ripple-gdp')
            .on('click', () => {
                this.selectedData = this.gdpGrowthData;
                this.selectedPosColorScale = this.posGdpScale;
                d3.select('#ripple-buttons')
                    .selectAll('.selected')
                    .classed('selected', false)
                    ;
                d3.select('#ripple-gdp')
                  .classed('selected', true)
                  .attr('class', 'selected')
                  ;
                ripple.updateMap();
            })
            ;
        d3.select('#ripple-unemployment')
            .on('click', () => {
                this.selectedData = this.unemploymentData;
                this.selectedPosColorScale = this.unemploymentColorScale;
                d3.select('#ripple-buttons')
                    .selectAll('.selected')
                    .classed('selected', false)
                    ;
                d3.select('#ripple-unemployment')
                  .classed('selected', true)
                  .attr('class', 'selected')
                  ;
                ripple.updateMap();
            })
            ;
        ripple.updateMap();
    }

    monthToQuarter(month) {
        if(month == 12) { return 'Q4'; }
        let q = Math.trunc(month / 3) + 1; 
        return 'Q' + q;
    }

    // as a subscriber of the time slider, the ripple needs to have an update method
    update(month, year) {
        // early out - if the data is quarterly and the update doesn't change 
        // the year or the quarter, return
        if(!this.selectedData.isMonthly && this.selectedYear == year && 
            this.selectedQuarter == this.monthToQuarter(month)) {
                return;
            }

        this.selectedMonth = month;
        this.selectedYear = year;
        this.selectedQuarter = this.monthToQuarter(month);
        console.log('Ripple chart updating with data ', this.selectedData, 
          ' year ', this.selectedYear, 
          ' month ', this.selectedMonth,
          ' quarter ', this.selectedQuarter
          );
        this.updateMap();
    }

    // get the color corresponding to a target value
    getColor(value) {
        if(undefined == value) { return 'lightgrey'; }
        if (value < 0) {
            return this.negativeColorScale(value);
        } else {
            return this.selectedPosColorScale(value);
        }
    }

    // find the target value in the data
    getValue(data, id, year, month) {
        let countryMatch = data.filter(d => {
            return d.countryId == id;
        });
        let yearMatch = countryMatch.filter(d => {
            return d.year == year;
        });
        let targetValue = []; 
        if (data.isMonthly) {
            targetValue = yearMatch.filter(d => {
                return d.month == month;
            })

        } else {
            targetValue = yearMatch.filter(d => {
                return d.quarter == this.monthToQuarter(month);
            })
        }
        if (undefined == targetValue ||
            undefined == targetValue[0] ||
            undefined == targetValue[0].value) {
            return undefined;
        }
        return targetValue[0].value;
    }

    // color the map according to the {year} and {quarter} within the dataset {data}
    // updateMap(data, year, quarter) {
    updateMap() {
        let map = d3.select("#map");

        map.selectAll(".countries")
            .style('fill', (d) => {
                if (undefined == d) { return 'grey'; }
                return this.getColor(
                    this.getValue(this.selectedData, d.id, this.selectedYear, this.selectedMonth)
                );
            })
            ;
    }

    /**
     * Renders the actual map
     * @param world the json data with the shape of all countries
     */
    drawMap(world) {
        // Draw the background map
        let path = d3.geoPath().projection(this.projection);
        let geoJSON = topojson.feature(world, world.objects.countries);
        let map = d3.select("#map");

        map.append('path')
            .datum(d3.geoGraticule())
            .attr('d', path)
            .attr('fill', 'none')
            .attr('class', "grat")
            ;

        map.selectAll('path')
            .data(geoJSON.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('id', (d) => d.id)
            .attr('class', 'countries')
            .style('fill', 'rgb(211,211,211)')
            .style('stroke-width', 0.3)
            .style('stroke', 'black')
            ;
    }
}
