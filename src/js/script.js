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
let indicatorsChart = new IndicatorsChart();

//Load datasets and pass to indicatorsChart
Promise.all([
        d3.csv("data/US_recessions.csv"),
        d3.csv("data/US_yield_curve.csv"),
        d3.csv("data/US_investment.csv"),
    ]).then(datasets => {
        // start each dataset at 1982 where yield curve data begins
        let recessionsMonthly = datasets[0].slice(748); 
        let yieldCurve = datasets[1];
        let investment = datasets[2].slice(140);

        //console.log(investment);
        //console.log(recessions);
        //console.log(yieldCurve);

        let recessions = new Array();
        let duration = 0;
        let recStart = null;
        for (let i = 0; i < recessionsMonthly.length; ++i) {
            if (recessionsMonthly[i].USREC == "0") {
                if (duration > 0) {
                    recessions.push({
                        START: recStart,
                        END: Date.parse(recessionsMonthly[i].DATE),
                    });
                    duration = 0;
                }     
            } else {
                ++duration;
            }
            
            if (duration == 1) {
                recStart = Date.parse(recessionsMonthly[i].DATE);
            }
        }
        
        yieldCurve.map(entry => {
            entry.DATE = Date.parse(entry.DATE);
            entry.T10Y3MM = +entry.T10Y3MM;

        })

        investment.map(entry => {
            entry.DATE = Date.parse(entry.DATE);
            entry.GPDI = +entry.GPDI;
        })

        indicatorsChart.display(recessions, yieldCurve, investment);
    })
;
