# Description of Proposal Sketches
The purpose of this file is to explain the sketches in the project proposal. 

## Ripple Vis
This chart is a central part of the recession visualization. The intended use is for the user to explore how recessions in one country spread/impact other countries in the world. This can be accomplished by dragging the scrubber or clicking a play button and watching the vis transition over time. Due to its central nature, several variations and views are included in this proposal. 

### Ripple Vis Basic
This is the basic template for the ripple chart vis. Pretty much, this is the set of elements that we're planning on including in the ripple vis, with other maps showing different alternatives for how the data is encoded.

### Ripple Vis GDP Colored 
This vis is one alternative for the ripple vis's GDP Growth view. In this variation, each country's GDP Growth rate is encoded using color. Positive GDP Growth will be colored green. Negative GDP Growth will be colored red. The value of these colors is scaled by the degree to which GDP Growth is positive or negative. 
* “GDP Growth (Annual %).” Data, https://data.worldbank.org/indicator/ny.gdp.mktp.kd.zg?view=map.

### Ripple Vis GDP Circles
In the above alternative for GDP Growth Rate, the user might be decieved because the amount of green/red on the map is more related to the land area of the countries, instead of the actual economic conditions. This effect is somewhat mitigated by the United States and China, who have both large economies and large land areas. However, if we are still worried about the landmass effect, we could create circles for each country and dual-encode the GDP growth data using both the color and the size of the circle. 

### Ripple Unemployment
This sketch shows what would happen if the clicked on the "Unemployment" button. The circles would change to all be the same color. Orange is used because it is somewhat similar to red, but less severe. Increasing unemployment is bad, but some unemployment is not as bad as slightly negative GDP growth. 

## Yield Curve Inversion Chart for the United States
This is a pretty straight-forward chart and many versions of it have been created by economists, businesspeople, and magazines. Instead of creating a sketch, we included a version of the chart from Forbes. The chart displays the difference between the 10-year return on Treasury bonds and the 3-month  return on Treasury bonds. Periods of recession are shown in the chart using grey boxes. 
* S. Moore, “The Yield Curve Just Inverted, Putting The Chance Of A Recession At 30%,” Forbes, 28-Mar-2019. [Online]. Available: https://www.forbes.com/sites/simonmoore/2019/03/23/the-yield-curve-just-inverted-putting-the-chance-of-a-recession-at-30/#4718c9af13ab. [Accessed: 10-Nov-2019].

For our project, we will improve this chart in several ways, as listed below:
* Hovering over the title of the chart will display a tooltip with a basic explanation of why the chart is important and how to interpret the vis.
* Hovering over a recession box will display a tooltip with some information about that particular recession - how long the recession lasted, the difference between unemployment before the recession and unemployment at its peak during the recession. 

## Trade Interconnectedness Chart
Possibility - we're still undecided about this one. The goal would be to allow the user to see how the degree of global interconnectedness impacts the degree to which a financial crisis spreads between countries. The slider would be connected to the ripple chart slider so that both charts display the same year. 

The volume of trade between two countries would be shown using the the weight of the line connecting the two countries. We could also duplicate that encoding with the value of the line. To decrease clutter, countries will be grouped by continent and bundled accordingly. 
