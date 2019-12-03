//Much of this code is adapted from https://observablehq.com/@d3/hierarchical-edge-bundling by Mike Bostock

class Dendrogram {
    constructor() {
        this.config = {
            listWidth: 50,
            width: 900,
            startYear: 1948,
            endYear: 2018,
        }

        this.cumulative = false;
        this.year = 2018;

        d3.select('#cumulative-checkbox')
            .on('click', (d, i) => {
                this.cumulative = !this.cumulative;
                this.updateYear(this.year);
            })
        ;

        /*this.listSvg = d3.select('#trade-chart')
            .append('svg')
            .attr('width', this.config.listWidth)
            .attr('height', this.config.width)
        ;*/
        
        this.dendroSvg = d3.select('#trade-chart')
            .append('svg')
            .attr('width', this.config.width)
            .attr('height', this.config.width)
            .attr("viewBox", [-this.config.width / 2, -this.config.width / 2, this.config.width, this.config.width])
        ;

        
        /*this.yearList = this.listSvg.append('g')
            .attr('id', 'year-list')
        ;*/
    }

    display(data) {
        this.data = data;

        let tree = d3.cluster()
            .size([2 * Math.PI, this.config.width / 2 - 120]) // angle in radians
        ;

        let root = tree(this.bilink(d3.hierarchy(data)
            .sort((a, b) => // this sorts the nodes alphabetically around the edge of the dendrogram.
                d3.ascending(a.height, b.height) || d3.ascending(a.data.name, b.data.name)
            )
        )); 

        //add region labels
        this.dendroSvg.append("g")
            .attr('id', 'dendrogram-region-label')
            .selectAll("g")
            .data(root.children)
            .join("g")
            .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${this.config.width/2 - 5},0)`)
            .append("text")
            .attr("dy", "0.31em")
            .attr("x", d => d.x < Math.PI ? 6 : -6)
            .attr("text-anchor", 'middle')
            .attr("transform", d => {
                if ((d.x - Math.PI/2) >= Math.PI || d.x < Math.PI/2) {
                    return "rotate(90)";
                } else {
                    return "rotate(270)";
                }
            })
            .text(d => d.data.name)
        ;
        
        this.dendroSvg.append("g") // note that the nodes have no mark, just a label
            .attr('id', 'dendrogram-node-label')
            .selectAll("g")
            .data(root.leaves())
            .join("g")
            .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
            .append("text")
            .attr("dy", "0.31em")
            .attr("x", d => d.x < Math.PI ? 6 : -6)
            .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
            .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
            .text(d => d.data.name)
            .each(function(d) { d.text = d.data.name; })
            .on('click', (d, i) => {
                let clicked = d3.select(d3.event.target);
               
                if (clicked.classed('selected')) {
                    clicked.classed('selected', false);
                } else {
                    clicked.classed('selected', true);
                }

                this.updateYear(this.year);
            })
            //.on("mouseover", overed)
            //.on("mouseout", outed)
            //.call(text => text.append("title").text(d => `${id(d)} // for tooltip
                //${d.outgoing.length} outgoing
                // ${d.incoming.length} incoming`))
        ;

        //let colorin = "#00f";
        //let colorout = "#f00";
        
        let line = d3.lineRadial()
            .curve(d3.curveBundle.beta(0.85))
            .radius(d => d.y)
            .angle(d => d.x)
        ;
       
        this.linksByYear = {};
        //let y = 10;
        //let dy = this.config.width / 75;
        for (let i = this.config.startYear; i <= this.config.endYear; ++i) {
            this.linksByYear[i] = [];
            /*let t = this.yearList.append('text')
                .attr('x', 20)
                .attr('y', y)
                .html(i)
                .on('click', (d, z) => {
                    this.updateYear(i);
                })
            ;
            y += dy;*/
        }

        //note that outgoing = [myselfnode, linkdestinationnodej, treatyname, yearsigned]
        let linkData = root.leaves().flatMap(leaf => leaf.outgoing);
    
        for (const o of linkData) {
            let year = o[3];
            let d = line(o[0].path(o[1]));
            if (year != "") {
                o.push(d);
                this.linksByYear[year].push(o);
            }
        }

        let colornone = "#ccc";
        this.dendroSvg.append("g")
            .attr('id', 'dendro-links')
            .attr("stroke", colornone)
            .attr("fill", "none")
        ;

        this.cumulativeHelper = {};
        this.updateYear(2003);
    }

    filterByCountries(outgoing) {
        let filterCountries = [];
        d3.select('#dendrogram-node-label')
            .selectAll('.selected')
            .each(d => {
                filterCountries.push(d.text);
            })
        ;

        if (filterCountries.length == 0) return true;
        if (filterCountries.indexOf(outgoing[0].data.name) != -1) return true;
        if (filterCountries.indexOf(outgoing[1].data.name) != -1) return true;
        return false;
    }

    updateYear(year) {
        d3.select('#fta-selected-year')
            .html('Selected year: ' + year)
        ;

        let data = this.linksByYear[year];
        if (this.cumulative == true) {
            for (let i = year - 1; i >= this.config.startYear; --i) {
                if (i in this.cumulativeHelper) {
                    data = data.concat(this.cumulativeHelper[i]);
                    break;
                } else {
                    data = data.concat(this.linksByYear[i]);
                }
                
            }
            if (!(year in this.cumulativeHelper)) {
                this.cumulativeHelper[year] = data;
            }
        }

        data = data.filter(this.filterByCountries);

        d3.select('#dendro-links')
            .selectAll("path")
            .data(data)
            .join('path')
            .style("mix-blend-mode", "multiply")
            .attr('d', ([n1, n2, name, year, path]) => path)
            //.each(function(d) { d.path = this; })
        ;
        
        this.year = year;
    }

    update(month, year) {
        this.updateYear(year);
    }

    bilink(root) {
        const map = new Map(root.leaves().map(d => [d.data.name, d]));
        for (const d of root.leaves()) {
            //d.incoming = [];

            //create outgoing array. outgoing = [myselfnode, linkdestinationnodej, treatyname, yearsigned]
            if (d.data.abcfta) {
                d.outgoing = d.data.abcfta.map(fta => [d, map.get(fta.with), fta.treaty, fta.year]);
            } else {
                d.outgoing = [];
            }
        }
        
        //for (const d of root.leaves()) for (const o of d.outgoing) o[1].incoming.push(o);
        return root;
      }
}

