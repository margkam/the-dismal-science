//Much of this code is from Mike Bostock at https://observablehq.com/@d3/hierarchical-edge-bundling
//or adapted from his work.

class Dendrogram {
    constructor() {
        this.config = {
            width: 800,
        }

        this.svg = this.svg = d3.select('#trade-chart')
            .append('svg')
            .attr("viewBox", [-this.config.width / 2, -this.config.width / 2, this.config.width, this.config.width])
        ;
    }

    display(data) {
        this.data = data;
        console.log('dendrogram data');
        console.log(data);

        console.log(d3.hierarchy(data).leaves()[1])
        let tree = d3.cluster()
            .size([2 * Math.PI, this.config.width / 2 - 100]) // angle in radians
        ;
        console.log(tree);

        let root = tree(this.bilink(d3.hierarchy(data)
            .sort((a, b) => // this sorts the nodes alphabetically around the edge of the dendrogram.
                d3.ascending(a.height, b.height) || d3.ascending(a.data.name, b.data.name)
            )
        )); 
        
        console.log('dendrogram tree');
        console.log(root);
        
        const node = this.svg.append("g") // note that the nodes have no mark, just a label
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
            .each(function(d) { d.text = this; })
            //.on("mouseover", overed)
            //.on("mouseout", outed)
            //.call(text => text.append("title").text(d => `${id(d)} // for tooltip
                //${d.outgoing.length} outgoing
                // ${d.incoming.length} incoming`))
            ;

    }

    bilink(root) {
        const map = new Map(root.leaves().map(d => [d.data.name, d]));
        for (const d of root.leaves()) {
            d.incoming = [];
            if (d.data.abcfta) {
                d.outgoing = d.data.abcfta.map(i => [d, map.get(i.with)]);
            } else {
                d.outgoing = [];
            }
        }
        
        for (const d of root.leaves()) for (const o of d.outgoing) o[1].incoming.push(o);
        return root;
      }
}

