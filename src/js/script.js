console.log('Starting vis');

let ripple = new Ripple();
ripple.display();

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