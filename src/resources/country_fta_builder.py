import csv
import json

# get dyadic fta links by country. only include link for country that appears first alphabetically, hence the name abcfta

all_countries = {}
all_treaties = {}

with open("List_of_treaties_dyadic.csv", "r") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    first_line = True;
    for row in csv_reader:
        # 0 and 1 are country names
        # 5 is treaty id
        # 6 is treaty name
        # l0 is signing year
        # 14 is region
        if first_line == False:
            countryCombo = {row[0], row[1]}
            id = row[5]
            
            if id not in all_treaties:
                all_treaties[id] = []
            
            if countryCombo not in all_treaties[id]:
                all_treaties[id].append(countryCombo)

                country1 = min(countryCombo)
                country2 = max(countryCombo)

                if country1 not in all_countries:
                    all_countries[country1] = [] 
                
                all_countries[country1].append({
                    "treaty": row[6],
                    "with": country2,
                    "year": row[10],
                })

        first_line = False  





# add the ftas to the json tree

with open("Countries_hierarchy.json", "r") as json_file:
    world = json.load(json_file)

for region in world['children']:
    for country in region['children']:
        name = country['name']
        if name in all_countries:
            country['abcfta'] = all_countries[name]
        
# write dictionary to json file
with open("Fta_country_hierarchy.json", "w") as json_dest_file:
    json.dump(world, json_dest_file)