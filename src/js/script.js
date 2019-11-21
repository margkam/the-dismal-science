console.log('Starting vis');

let selectedYear = 2018;
let selectedQuarter = "Q3";
let ripple = new Ripple();

console.log('About to load data');
d3.csv('data/Quarterly_real_GDP_growth.csv').then(data => {
    console.log('data', data);
    ripple.update(data, selectedYear, selectedQuarter);
})

d3.json("data/world.json")
.then(function(world) {
  ripple.drawMap(world);
});
