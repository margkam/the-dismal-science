# Proposal

## Basic Info

_Title:_   
Confessions of a Recessed Economy

_Repository:_  
https://github.com/marwtki/the-dismal-science

_Team members:_  
Steven Scott  
steven.scott@aggiemail.usu.edu  
A01535109

Margaret Watkins  
margaret.watkins@aggiemail.usu.edu  
A01983706


## Background and Motivation

For the average person, the economy is hard to understand. Economists are trusted little and liked less. The economy is a powerful force in our nation, community, and daily life. Despite its importance, politicians and voters alike have very limited understanding of economic principles and the effect of economic policy and mishaps. We believe an enhanced understanding of economic indicators and history will inform the general population and assuage fear of the unknown. 

While data visualization will not prevent the next recession, it can shed light on why current events are happening and what the future may bring. Economic indicators such as an inverted yield curve and declines in business investment lead business cycles and show that we may be headed into another recession right now. If so, the damage would reach far beyond the borders of the United States, and global recovery may take longer than we think.

We believe this information can and should be presented in ways that are easy to understand, even for those who are not trained economists. As dual majors in Economics and Computer Science, we know from experience that learning about the economy can lead us to care more and fear less. Our economics coursework has taught us how to understand the data we will visualize in this project and has inspired us to share the understanding we ourselves have gained.

## Project Objectives

Primary questions we would like to answer with our visualization:

- How quickly and strongly are countries around the globe affected when the one country enters a recession?  
- How long does it take for these countries to recover relative to the country that triggered the recession?
- What economic indicators are correlated with recessions in the United States?
- What economic indicators show that we may be headed into a recession?
- Where are these indicators at right now?
- When have recessions happened in the past and how severe were they?

Benefits:
- Develop a general understanding of how recessions happen based on economic indicators
- Learn when recessions have happened in the past century and how severe they were
- Show the current state of the United States economy
- Understand the links between national and global economies
- Build compassion for other countries who have recessions triggered by the United States

## Data

Datasets currently included:

#### From OECD - Organisation for Economic Co-operation and Development
- Quarterly National Accounts  : Quarterly Growth Rates of real GDP, change over previous quarter (https://stats.oecd.org/Index.aspx?DataSetCode=QNA_ARCHIVE#)
- Key Short-Term Economic Indicators  : Harmonised Unemployment Rate (https://stats.oecd.org/Index.aspx?DataSetCode=QNA_ARCHIVE#)

#### From FRED - Federal Reserve Bank of St. Louis
- NBER based Recession Indicators for the United States from the Period following the Peak through the Trough (https://fred.stlouisfed.org/series/USREC)
- 10-Year Treasury Constant Maturity Minus 3-Month Treasury Constant Maturity (https://fred.stlouisfed.org/series/T10Y3MM)
- Gross Private Domestic Investment (https://fred.stlouisfed.org/series/GPDI) 
- Unemployment Rate (https://fred.stlouisfed.org/series/UNRATE)

#### From DESTA - Design of Free Trade Agreements
- List of treaties in dyadic form (https://www.designoftradeagreements.org/downloads/)

### Data Processing

All of these datasets were downloadable in CSV format. For most of them, we used D3's CSV parser, and minimal additional data processing was needed. The US recession dataset contained a flag for every month indicating if it was a recession or not; this was converted into a much smallr dataset in which each item is a recession (with start and end dates) intead of a month.

We have also included a dyadic dataset of bi- and multilateral free trade agreements for our optional dendrogram. The src/resources directory contains a python script we wrote to parse the CSV and construct a JSON hierarchy of regions and countries of the world using the identifiers in this dataset. This tree structure in JSON format will enable us to use hierarchical edge bundling with a radial dendrogram. The JSON file we generated is in the src/data directory. 

## Exploratory Data Analysis: 

Initially we tolerated some online vis provided by our data sources to understand the data. Having also studied economics for some time, we had a decent idea that the yield curve would invert and business investment would decline before each recession, and that these have occured this year as well. We were interested to see that unemployment, which typically begins to rise before a recession, is currently still dropping. This contrasts to the other two indicators in the vis and for the sake of showing the data, the whole data, and nothing but the data, we decided it would add interest and accuracy to the vis to include unemployment as well. We expect that the global datasets will provide more surprises as we continue to explore the data through the map and slider vis we are building.

## Design Evolution

### Overview
Since we are creating a dashboard-style vis, there are multiple visualizations put together to communicate a complex message. This overview shows how the multiple views will fit together. Note that the year slider controls the year for all of the charts. This allows the user to see how different economic values are related to each other and how they evolve in tandem over time. 

![Overview Vis](./docs/proposal_docs/sketches/overview.jpeg)

### Ripple Vis
This chart is a central part of the recession visualization. The intended use is for the user to explore how recessions in one country spread/impact other countries in the world. This can be accomplished by dragging the scrubber or clicking a play button and watching the vis transition over time. Due to its central nature, several variations and views are included in this proposal. 

#### Ripple Vis Basic
![Basic Ripple Vis](./docs/proposal_docs/sketches/Ripple_Vis_Basic.png)

This is the basic template for the ripple chart vis. Pretty much, this is the set of elements that we're planning on including in the ripple vis, with other maps showing different alternatives for how the data is encoded.

#### Ripple Vis GDP Colored 
![Ripple Vis - Colored](./docs/proposal_docs/sketches/Ripple_Vis_GDP_Colored.png)

This vis is one alternative for the ripple vis's GDP Growth view. In this variation, each country's GDP Growth rate is encoded using color. Positive GDP Growth will be colored green. Negative GDP Growth will be colored red. The value of these colors is scaled by the degree to which GDP Growth is positive or negative. 
* “GDP Growth (Annual %).” Data, https://data.worldbank.org/indicator/ny.gdp.mktp.kd.zg?view=map.

#### Ripple Vis GDP Circles
![Ripple Vis - Circles](./docs/proposal_docs/sketches/Ripple_Vis_GDP_Circles.png)

In the above alternative for GDP Growth Rate, the user might be decieved because the amount of green/red on the map is more related to the land area of the countries, instead of the actual economic conditions. This effect is somewhat mitigated by the United States and China, who have both large economies and large land areas. However, if we are still worried about the landmass effect, we could create circles for each country and dual-encode the GDP growth data using both the color and the size of the circle. 

#### Ripple Unemployment
![Ripple Vis - Unemployment](./docs/proposal_docs/sketches/Ripple_Unemployment.png)

This sketch shows what would happen if the clicked on the "Unemployment" button. The circles would change to all be the same color. Orange is used because it is somewhat similar to red, but less severe. Increasing unemployment is bad, but some unemployment is not as bad as slightly negative GDP growth. 

### Yield Curve Inversion Chart for the United States
![Yield Curve Inversion Chart](./docs/proposal_docs/sketches/yield_curve_forbes.png)

This is a pretty straight-forward chart and many versions of it have been created by economists, businesspeople, and magazines. Instead of creating a sketch, we included a version of the chart from Forbes. The chart displays the difference between the 10-year return on Treasury bonds and the 3-month  return on Treasury bonds. Periods of recession are shown in the chart using grey boxes. 
* S. Moore, “The Yield Curve Just Inverted, Putting The Chance Of A Recession At 30%,” Forbes, 28-Mar-2019. [Online]. Available: https://www.forbes.com/sites/simonmoore/2019/03/23/the-yield-curve-just-inverted-putting-the-chance-of-a-recession-at-30/#4718c9af13ab. [Accessed: 10-Nov-2019].

For our project, we will improve this chart in several ways, as listed below:
* Hovering over the title of the chart will display a tooltip with a basic explanation of why the chart is important and how to interpret the vis.
* Hovering over a recession box will display a tooltip with some information about that particular recession - how long the recession lasted, the difference between unemployment before the recession and unemployment at its peak during the recession. 

### Trade Interconnectedness Chart
![Trade Interconnectedness Chart](./docs/proposal_docs/sketches/Trade_Interconnectedness.png)

Possibility - we're still undecided about this one. The goal would be to allow the user to see how the degree of global interconnectedness impacts the degree to which a financial crisis spreads between countries. The slider would be connected to the ripple chart slider so that both charts display the same year. 

The volume of trade between two countries would be shown using the the weight of the line connecting the two countries. We could also duplicate that encoding with the value of the line. To decrease clutter, countries will be grouped by continent and bundled accordingly. 

## Must-Have Features

- Charts displaying leading/trailing indicators of a recession:
  - Business Investment
  - Yield Curve (10-year treasury bond vs. Fed rates)
  - Unemployment
- Ripple Chart(s)
  - Chart(s) displaying how an economic downturn in a large economy (particularly a global hedgemond) propogates around the world. This chart/these charts should support the following views:
    - GDP Growth
    - Unemployment


## Optional Features

- Extra Ripple Charts/Views: 
    - Purchasing Power Parity
    - Inflation
    
- Free Trade Agreement Vis:
    - Interactive radial dendrogram with countries as nodes and links indicating an FTA between them
    - Slider for years to show change over time
    - On hover over a link, show accompanying line chart showing volume of trade over time as net exports in real USD 
    - This can help explain why President Trump's trade war with China is hurting the economy

- Happiness Vis:
    - Goal is to analyze how recessions impact happiness measures such as OECD's Life Satisfaction Index
    - Visualize if the index measures are the same before/after recessions in different countries
    - Which countries take longer to recover?
    - Ideas: Line chart showing happiness over time by country, bar chart showing how long it takes happiness to recover in different countries after a recession, scatterplot showing correlation (or lack thereof) between happiness and length of recession

- Year Comparator Vis:
    - Show 2 copies of map so you can compare 2 years at once
    - Alternately, choose a base year in a single map and show data relative to that year


## Updated Project Schedule

Week 0: Nov 3 - 9:
* Meet with Dr. Edwards to discuss proposal 
* Create project structure (data directory, scripts directory, etc)
* Write Proposal
  - Write this document
  - Draw layouts, rough sketches of vis
* Implement layout structure in html

Week 1: Nov 10 - 16:
* Turn in Proposal (Monday)
* Add World Map to Vis (Steve)
* Implement Business Investment Line Chart (Margaret)

Week 2: Nov 17 - 23:
* Put the datasets in (Margaret)
* Implement Yield Curve Inversion Chart (Margaret)
* Implement Unemployment Chart (Steve)
* Add scaled colors for GDP growth rate to World Map (Steve)
* Attempt Unemployment Ripple Chart (Steve)
* Write script to create countries hierarchy for dendrogram (Margaret)

Week 3: Nov 24 - 30:
* Attempt to find more robust life satisfaction dataset and add to map (team)
* Implement year slider (Steve)
* Implement play button (Steve)
* Look into map projection solutions (different projection? Cartogram?) (team)
* Add question icons and basic descriptions of economic concepts (Margaret)
* Add tooltip to indicators chart and maybe highlighting (Margaret)
* Attempt FTA dendrogram for current year (team effort)
* Attempt dendrogram change over time (Margaret)
* Attempt linked FTA trade volume vis (Steve)
* Write report (team)

Week 4: Dec 1 - 7:
* Style project to be beautiful with css (team)
* Finalize project, fix outstanding bugs, code clean up (team)
* Prep for Presentation
* Present
* Make screencast
* Finish process.md

Week 5: Dec 8 - 14
* Take finals

## Insights and Mishaps
_Section for Tales of Adventure while implementing the vis_
### Sliders: Potentially problematic
The year slider was suprisingly fraught with pitfalls. 

TODO:

Design Evolution: 
_What are the different visualizations you considered? Justify the design decisions you made using the perceptual and design principles you learned in the course. Did you deviate from your proposal?_
We considering switching the world map to be a cartogram, with country size scaled by GDP and colored by GDP Growth. The advantage of this switch would have been that countries with more of an impact on the global economy would have been emphasized in the vis. However, when we explored this option by looking at http://bl.ocks.org/emeeks/d57083a45e60a64fe976, it became apparent that the distortion would create several problems. European countries become unrecognizable as they grow. Given our dataset, Africa would have disappeared entirely. 

Implementation: 
_Describe the intent and functionality of the interactive visualizations you implemented. Provide clear and well-referenced images showing the key design and interaction elements._

Evaluation: 
_What did you learn about the data by using your visualizations? How did you answer your questions? How well does your visualization work, and how could you further improve it?_
