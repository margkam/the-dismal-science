console.log('Starting vis');

let ripple = new Ripple();
ripple.display();

let indicatorsChart = new IndicatorsChart();

//Load datasets and pass to indicatorsChart
Promise.all([
        d3.csv("data/US_recessions.csv"),
        d3.csv("data/US_yield_curve.csv"),
        d3.csv("data/US_investment.csv"),
    ]).then(datasets => {
        let recessions = datasets[0];
        let yieldCurve = datasets[1];
        let investment = datasets[2];

        recessions.map(entry => {
            entry.DATE = Date.parse(entry.DATE);
        });
        
        yieldCurve.map(entry => {
            entry.DATE = Date.parse(entry.DATE);
            entry.T10Y3MM = +entry.T10Y3MM;

        })

        investment.map(entry => {
            entry.DATE = Date.parse(entry.DATE);
            entry.GPDI = +entry.GPDI;
        })

        //console.log(investment);
        //console.log(recessions);
        //console.log(yieldCurve);
        indicatorsChart.display(recessions, yieldCurve, investment);
    })
;