// UTILS: several functions that are used throughout these files

// given a month, return the quarter it is in
function monthToQuarter(month) {
    if (month == 12) { return 'Q4'; }
    let q = Math.trunc(month / 3) + 1;
    return 'Q' + q;


}

// given a quarter, return a month within that quarter.
// Note: this should only be used in cases where the precise month doesn't matter
function quarterToMonth(quarter) {
    if(!quarter.startsWith('Q')) { throw `Invalid quarter format ${quarter}`; }
    let q = quarter.slice(1, 2) - 1;
    return q * 3;
}
