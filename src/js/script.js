console.log('Starting vis');

let selectedYear = 2018;
let selectedQuarter = "Q3";
let ripple = new Ripple();

console.log('About to load data');
d3.csv('data/Quarterly_real_GDP_growth.csv', function(d) {
    return {
        countryId: d['Location'],
    }
}).then(data => {
    console.log('data', data);
    ripple.update(data, selectedYear, selectedQuarter);
})

d3.json("data/world.json")
.then(function(world) {
  ripple.drawMap(world);
});
let indicatorsChart = new IndicatorsChart();

//Load datasets and pass to indicatorsChart
Promise.all([
        d3.csv("data/US_recessions.csv"),
        d3.csv("data/US_yield_curve.csv"),
    ]).then(datasets => {
        let recessions = datasets[0];
        let yieldCurve = datasets[1];

        recessions.map(entry => {
            entry.DATE = Date.parse(entry.DATE);
        });
        
        yieldCurve.map(entry => {
            entry.DATE = Date.parse(entry.DATE);
            entry.T10Y3MM = Number.parseFloat(entry.T10Y3MM);
        })

        //console.log(recessions);
        //console.log(yieldCurve);
        indicatorsChart.display(recessions, yieldCurve);
    })
;
