console.log('Starting vis');

let ripple = new Ripple();
let rippleSlider = new TimeSlider('ripple-slider', 1982, 2019, 2007, false);
let tradeSlider = new TimeSlider('trade-slider', 1948, 2019, 2003, true);
let indicatorsChart = new IndicatorsChart();
let dendrogram = new Dendrogram();

let ripplePromises = [];

d3.json("src/data/world.json")
.then(function(world) {
  ripple.drawMap(world);
});

ripplePromises.push(d3.csv('src/data/Quarterly_real_GDP_growth.csv', function(d) {
    let period = d['Period'].split('-');
    return {
        countryId: d['LOCATION'],
        quarter: period[0],
        year: period[1],
        value: d['Value']
    };
}))

ripplePromises.push(d3.csv('src/data/Harmonised_unemployment_rate.csv', function(d) {
    let period = d['TIME'].split('-');
    return {
        countryId: d['LOCATION'],
        month: period[1],
        year: period[0],
        value: d['Value']
    };
}))

// load all datasets for the ripple chart
Promise.all(ripplePromises).then(datasets => {
    rippleSlider.init();
    rippleSlider.addSubscriber(ripple);

    let gdpGrowth = datasets[0];
    let unemployment = datasets[1];

    ripple.init(gdpGrowth, unemployment);
})

//Load datasets and pass to indicatorsChart
Promise.all([
        d3.csv("src/data/US_recessions.csv"),
        d3.csv("src/data/US_real_GDP.csv"),
        d3.csv("src/data/US_yield_curve.csv"),
        d3.csv("src/data/US_investment.csv"),
        d3.csv("src/data/US_unemployment.csv"),
    ]).then(datasets => {
        // start each dataset at 1982 where yield curve data begins
        let recessionsMonthly = datasets[0].slice(748);
        let gdp = datasets[1]; 
        let yieldCurve = datasets[2];
        let investment = datasets[3].slice(140);
        let unemployment = datasets[4];

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

        gdp.map(entry => {
            entry.DATE = Date.parse(entry.DATE);
            entry.GDPC1 = +entry.GDPC1/1000;
        })
        
        yieldCurve.map(entry => {
            entry.DATE = Date.parse(entry.DATE);
            entry.T10Y3MM = +entry.T10Y3MM;

        })

        investment.map(entry => {
            entry.DATE = Date.parse(entry.DATE);
            entry.GPDI = +entry.GPDI/1000;
        })

        unemployment.map(entry => {
            entry.DATE = Date.parse(entry.DATE);
            entry.UNRATE = +entry.UNRATE;
        })

        tradeSlider.init();
        tradeSlider.addSubscriber(indicatorsChart);
        indicatorsChart.display(recessions, gdp, yieldCurve, investment, unemployment);
    })

    d3.json("src/data/Fta_country_hierarchy.json")
        .then(tree => dendrogram.display(tree))
    ;


;
