# Proposal

_[As a ballpark number, your proposal should contain about 3-4 pages of text plus 5-6 pages of sketches. Your sketches can be made by computer, but it will probably be easier to brainstorm with your team members using pen and paper and then taking a picture and uploading it to your proposal.]_

## Basic Info

_Title (working):_   
Confessions of a Recessed Economy

_Title (alternative 1):_
Our Trash Will End Up In Your Yard: 
How Recessions Ripple Through the Global Economy

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

_[Provide the primary questions you are trying to answer with your visualization. What would you like to learn and accomplish? List the benefits.]_

## Data

_[From where and how are you collecting your data? If appropriate, provide a link to your data sources.]_
Potential Data Sources:
- Organization for Economic Cooperation and Development: https://data.oecd.org/economy.htm 
- World Bank: https://data.worldbank.org/
- US Government Data: https://catalog.data.gov/dataset/international-macroeconomic-data-set
- DataHub: several collections of data from the International Monetary Fund, World Bank, etc: https://datahub.io/collections/economic-data 

## Data Processing

_[Do you expect to do substantial data cleanup? What quantities do you plan to derive from your data? How will data processing be implemented?]_
We will use javascript Promises to ensure that the data is loaded before we attempt to create the visualization. D3's default CSV parser will be used for data processing. 

## Visualization Design

_[How will you display your data? Provide some general ideas that you have for the visualization design. Develop three alternative prototype designs for your visualization. Create one final design that incorporates the best of your three designs. Describe your designs and justify your choices of visual encodings. We recommend you use the [Five Design Sheet Methodology](http://fds.design/).]_

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

_[List the features without which you would consider your project to be a failure.]_
- Charts displaying leading/trailing indicators of a recession:
  - Business Investment
  - Yield Curve (10-year treasury bond vs. Fed rates)
  - Unemployment
- Ripple Chart(s)
  - Chart(s) displaying how an economic downturn in a large economy (particularly a global hedgemond) propogates around the world. This chart/these charts should support the following views:
    - GDP Growth
    - Unemployment


## Optional Features

_[List the features which you consider to be nice to have, but not critical.]_
- Extra Ripple Charts/Views: 
    - Purchasing Power Parity
    - Inflation


## Project Schedule

_[Make sure that you plan your work so that you can avoid a big rush right before the final project deadline, and delegate different modules and responsibilities among your team members. Write this in terms of weekly deadlines.]_

Week 0: Nov 3 - 9:
* Meet with Dr. Edwards to discuss proposal 
* Create project structure (data directory, scripts directory, etc)
* Write Proposal
  - Write this document
  - Draw layouts, rough sketches of vis
* _Optional: Implement layout structure in html_

Week 1: Nov 10 - 16:
* Turn in Proposal (Monday)
* Add World Map to Vis
* Implement Business Investment Line Chart

Week 2: Nov 17 - 23:
* Implement Yield Curve Inversion Chart
* Implement Unemployment Chart
* Add scaled colors for GDP growth rate to World Map

Week 3: Nov 24 - 30:
* Attempt Unemployement Ripple Chart
* Write report
* Finalize project, fix outstanding bugs, clean up and refactor

Week 4: Dec 1 - 7:
* Prep for Presentation 
* Present?

Week 5: Dec 8 - 14
* Take finals
