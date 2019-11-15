class Ripple {
    constructor() {
        this.config = {
            scale: 50,
            width: 900,
            height: 500,
            padding: {
                top: 10,
                left: 10,
                right: 10,
                bottom: 10
            }
        }
        this.projection = d3.geoConicConformal()
            .scale(this.config.scale)
            .translate([this.config.width / 2, this.config.height / 2])
            ;
    }

    display() {}

    update(year) {
        console.log('Ripple chart updating with year ', year);
    }
}
