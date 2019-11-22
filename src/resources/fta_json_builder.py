import csv
import json



world = {}
all_countries = set()
all_countries_in_regions = set() #

with open("List_of_treaties_dyadic.csv", "r") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    first_line = True;
    for row in csv_reader:
        # 0 and 1 are country names
        # 14 is region
        if first_line == False:
            # add countries to country set to make sure we don't drop any that are only in intercontinental treaties
            country1 = row[0]
            country2 = row[1]
            region = row[14]
            all_countries.add(country1)
            all_countries.add(country2)
          
            if region != "Intercontinental":
                all_countries_in_regions.add(country1) #
                all_countries_in_regions.add(country2) #
                if region not in world:
                    world[region] = set() 
                world[region].add(country1)
                world[region].add(country2)            
        first_line = False  


print("regions:")
for r in world:
    print(r)
if len(all_countries) != len(all_countries_in_regions):
    print("Error: Found country with unidentifiable region")
    for c in all_countries:
        if c not in all_countries_in_regions:
            print("What region is " + c + "?")
            inp = input()
            if inp not in world:
                    world[inp] = set()
            world[inp].add(c)
            
# convert to jsonable data structures
print("===================")
print("REGIONS:")
worldChildren = []
for r in world:
    print(r)
    world[r] = sorted(world[r]) # now world is a dict of key :  list pairs ("Asia" : ["China", "Russia"])
    for i in range(len(world[r])):
        world[r][i] = {
            "name" : world[r][i] # now each country is a dict
        }
    worldChildren.append({
        "name": r,
        "children": world[r]
    })

#now we have contructed the children of the world. Regions are not sorted. 
data = {}
data["name"] = "world"
data["children"] = worldChildren

# write dictionary to json file
with open("Countries_hierarchy.json", "w") as json_file:
    json.dump(data, json_file)

print("==================")
print("Done.")