# Description of Proposal Sketches
The purpose of this file is to explain the sketches in the project proposal. 

## Ripple Chart
This chart is a central part of the recession visualization. In the actual visualization, each country will be color coded with its GDP Growth for the year selected on the slider at the bottom. Positive GDP Growth will be colored green. Negative GDP Growth will be colored red. The value of these colors is scaled by the degree to which GDP Growth is positive or negative. 

This chart will support multiple views. The primary views will be GDP Growth and Unemployment because these are the views most likely to show insight into how recessions spread and linger around the globe. Once those are implemented, we will explore whether other views offer useful insights. 

## Yield Curve Inversion Chart for the United States
This is a pretty straight-forward chart and many versions of it have been created by economists, businesspeople, and magazines. Instead of creating a sketch, we included a version of the chart from Forbes. The chart displays the difference between the 10-year return on Treasury bonds and the 3-month  return on Treasury bonds. Periods of recession are shown in the chart using grey boxes. 
* S. Moore, “The Yield Curve Just Inverted, Putting The Chance Of A Recession At 30%,” Forbes, 28-Mar-2019. [Online]. Available: https://www.forbes.com/sites/simonmoore/2019/03/23/the-yield-curve-just-inverted-putting-the-chance-of-a-recession-at-30/#4718c9af13ab. [Accessed: 10-Nov-2019].

For our project, we will improve this chart in several ways, as listed below:
* Hovering over the title of the chart will display a tooltip with a basic explanation of why the chart is important and how to interpret the vis.
* Hovering over a recession box will display a tooltip with some information about that particular recession - how long the recession lasted, the difference between unemployment before the recession and unemployment at its peak during the recession. 

## Trade Interconnectedness Chart
Possibility - we're still undecided about this one. The goal would be to allow the user to see how the degree of global interconnectedness impacts the degree to which a financial crisis spreads between countries. The slider would be connected to the ripple chart slider so that both charts display the same year. 

The volume of trade between two countries would be shown using the the weight of the line connecting the two countries. We could also duplicate that encoding with the value of the line. To decrease clutter, countries will be grouped by continent and bundled accordingly. 
