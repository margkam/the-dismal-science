console.log('Starting vis');

let selectedYear = 2009;
let selectedQuarter = "Q4";
let ripple = new Ripple();

d3.csv('data/Quarterly_real_GDP_growth.csv', function(d) {
    let period = d['Period'].split('-');
    return {
        countryId: d['LOCATION'],
        quarter: period[0],
        year: period[1],
        value: d['Value']
    };
}).then(data => {
    console.log('data', data);
    d3.select('#ripple-gdp')
      .on('click', () => {
        ripple.updateMap(data, selectedYear, selectedQuarter);
      })
      ;
    ripple.updateMap(data, selectedYear, selectedQuarter);
})

d3.csv('data/Harmonised_unemployment_rate.csv', function(d) {
    let period = d['TIME'].split('-');
    return {
        countryId: d['LOCATION'],
        month: period[1],
        year: period[0],
        value: d['Value']
    };
}).then(data => {
    console.log('unemployment data', data);
    d3.select('#ripple-unemployment')
      .on('click', () => {
        ripple.updateMap(data, selectedYear, selectedQuarter);
      })
      ;
})

var img = document.createElement("img");
img.width = 600;
img.height = 600;
img.src = "resources/Trade_Interconnectedness.png";

var src = document.getElementById("placeholder");
src.appendChild(img);


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
