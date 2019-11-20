console.log('Starting vis');

let ripple = new Ripple();
ripple.display();

let indicatorsChart = new IndicatorsChart();

//Load US recession data and pass to indicatorsChart
d3.csv("data/US_recessions.csv")
    .then(recessionData => {
        recessionData.map(entry => {
            entry.DATE = Date.parse(entry.DATE);
        })
        console.log(recessionData);
        indicatorsChart.display(recessionData);
    })
;