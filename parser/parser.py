import requests
from bs4 import BeautifulSoup as BS 
import json

base_url = 'https://kubik.in.ua'

# response = requests.get('https://kubik.in.ua/catalog/dir_kubik_rubika/dir_kubik_rubika_4x4/')




# with open('site.html', 'w',  encoding="utf-8") as write_file:
#     write_file.write(response.text)


html = ''

with open('site.html', 'r', encoding='utf-8') as file:
    html = BS(file.read(), 'html.parser')

cubes = []

for el in html.select('.product-item'):
    img =   base_url + el.select('img')[0]['src']
    price = el.select('.elem_item_price_cur')[0].text
    name =  el.select('.elem_item_name')[0].text
    # print(el.select('.elem_item_price_old'))
    cube_data = {
        "name": name.split('|')[0].strip(), 
        "price": int(price.split(' ')[0]), 
        "photoUrl": base_url + img, 
        "typeId": '5dab4df10bfb184afe4d51ff', 
        'manufacturerId': '5dab34b65d4d1d3ea98ae5ea'
    }
    cubes.append(cube_data)

with open("cubes.json", "w") as file:
    json.dump(cubes, file, indent=4)
