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

        this.positiveColorScale = d3.scaleLinear().domain([0.0, 4.0])
            .range(['white', 'green'])
        this.negativeColorScale = d3.scaleLinear().domain([-4.0, 0.0])
            .range(['red', 'white'])
    }

    display(gdpGrowthData, unemploymentData) {
        this.gdpGrowthData = gdpGrowthData;
        this.unemploymentData = unemploymentData;
        ripple.updateMap(gdpGrowthData, selectedYear, selectedQuarter);
        d3.select('#ripple-gdp')
            .on('click', () => {
                ripple.updateMap(this.gdpGrowthData, selectedYear, selectedQuarter);
            })
            ;
        d3.select('#ripple-unemployment')
            .on('click', () => {
                ripple.updateMap(this.unemploymentData, selectedYear, selectedQuarter);
            })
            ;
    }

    update(year) {
        console.log('Ripple chart updating with data ', this.data, ' year ', year.getFullYear());
        // this.updateMap(this.data, year, 'Q1');
    }

    getColor(value) {
        if (value < 0) {
            return this.negativeColorScale(value);
        } else {
            return this.positiveColorScale(value);
        }
    }

    getValue(data, id, year, quarter) {
        let countryMatch = data.filter(d => {
            return d.countryId == id;
        });
        let yearMatch = countryMatch.filter(d => {
            return d.year == year;
        });
        let quarterMatch = yearMatch.filter(d => {
            return d.quarter = quarter;
        })
        if (undefined == quarterMatch ||
            undefined == quarterMatch[0] ||
            undefined == quarterMatch[0].value) {
            return 0;
        }
        // console.log('match found: ', quarterMatch[0].value);
        return quarterMatch[0].value;
    }

    updateMap(data, year, quarter) {
        console.log('Ripple chart updating with data ', data, ' year ', year, ' quarter ', quarter);

        let map = d3.select("#map");

        let oneAustralia = this.getValue(data, 'AUS', year, quarter);
        console.log('one australia', oneAustralia);

        map.selectAll(".countries")
            .style('fill', (d) => {
                if (undefined == d) { return 'white'; }
                return this.getColor(
                    this.getValue(data, d.id, year, quarter)
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
