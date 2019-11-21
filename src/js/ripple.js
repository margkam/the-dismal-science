class Ripple {
    constructor() {
        this.config = {
            scale: 180,
            width: 1200,
            height: 1200,
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
    }

    update(data, year, quarter) {
        console.log('Ripple chart updating with data ', data, ' year ', year, ' quarter ', quarter);
    }
    updateMap(worldcupData) {
        //Clear any previous selections;
        this.clearMap();

        // ******* TODO: PART V *******

        let map = d3.select("#map");
        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.

        // Select the host country and change it's color accordingly.
        // Iterate through all participating teams and change their color as well.
        map.selectAll(".countries")
            .attr("class", function (d) {
                let countryClass = "countries";
                // if the country was the host, set its class to host
                if (d.id == worldcupData.host_country_code) {
                    countryClass = "countries host"
                }
                // if the country's id is in the teams list, set its class to team
                else if (worldcupData.teams_iso.includes(d.id)) {
                    countryClass = "countries team"
                }
                return countryClass;
            });


        // We strongly suggest using CSS classes to style the selected countries.

        // Add a marker for gold/silver medalists
        // display a gold circle on the winner
        let winner = this.projection(worldcupData.win_pos);
        map.append('circle')
            .attr('r', 12)
            .attr('cx', winner[0])
            .attr('cy', winner[1])
            .attr('class', 'gold')
            .attr('id', 'selected-winner')
            ;

        // display a silver circle for the runner-up
        let second = this.projection(worldcupData.ru_pos);
        map.append('circle')
            .attr('r', 12)
            .attr('cx', second[0])
            .attr('cy', second[1])
            .attr('class', 'silver')
            .attr('id', 'selected-second')
            ;
    }

    /**
     * Renders the actual map
     * @param world the json data with the shape of all countries
     */
    drawMap(world) {
        //(note that projection is a class member
        // updateMap() will need it to add the winner/runner_up markers.)

        // ******* DONE: PART IV *******

        // Draw the background (country outlines; hint: use #map)
        let path = d3.geoPath().projection(this.projection);
        let geoJSON = topojson.feature(world, world.objects.countries);
        let map = d3.select("#map");

        // Make sure and add gridlines to the map
        // create a grid using d3's geoGraticule method.
        map.append('path')
            // A Graticule is a line representing major lat/lon lines
            // the .datum binds all the data to a single selection
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
            // Hint: assign an id to each country path to make it easier to select afterwards
            // we suggest you use the variable in the data element's .id field to set the id
            .attr('id', (d) => d.id)
            // Make sure and give your paths the appropriate class (see the .css selectors at
            // the top of the provided html file)
            .attr('class', 'countries')
            ;

    }

}
