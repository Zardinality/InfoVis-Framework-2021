import pandas as pd
import numpy as nd
from pandas.io import json


DATA_FILE = '../data/omniart_v3_datadump_1k.csv'
OUTPUT_FILE = './static/omniart_v3_1k_res.json'

LABEL_TO_CODE = {'dutch': 'NLD', 'Nederland': 'NLD', 'netherlandish': 'NLD', 'flemish': 'BEL', 'french': 'FRA', 'france métropolitaine, france': 'FRA', 'italia': 'ITA', 'german': 'DEU', 'english': 'GBR', 'japanese': 'JPN',
                 'american': 'USA', 'great britain, richmondshire, north yorkshire, yorkshire and the humber, england, uk': "GBR", 'austrian': 'AUT', 'spanish': "ESP" , 'catalan': "ESP", 'chinese': 'CHN', 'hungarian': 'HUN', 'danish': 'DNK', 'deutschland, europe': 'DEU'}


def top_places(df: pd.DataFrame):
    print(f"Unique geoid:  {df['school'].nunique()}")
    return df['school'].value_counts()[:100].to_dict().keys()

def aggregate_per_geo(df: pd.DataFrame):
    sliced_df = df[df['school'].isin(LABEL_TO_CODE)]
    sliced_df['school'] = sliced_df['school'].apply(lambda x: LABEL_TO_CODE[x])
    res = sliced_df.groupby(by='school').agg(list)
    res = res.drop(['Unnamed: 0'], axis=1)
    return res

def hex2rgb(s:str):
    h = s.lstrip('#')
    return [int(h[i:i+2], 16) for i in (0, 2, 4)]

def transform_items(row: dict):
    artist_to_item = {}
    for i in range(len(row['id'])):
        a_name = row['artist_full_name'][i]
        img_url = row['image_url'][i]
        crea_year = row['creation_year'][i]
        dom_color = hex2rgb(row['dominant_color'][i])
        if a_name not in artist_to_item:
            artist_to_item[a_name] = {'image_url':[], 'creation_year':[], 'dominant_color':[]}
        artist_to_item[a_name]['image_url'].append(img_url)
        artist_to_item[a_name]['creation_year'].append(crea_year)
        artist_to_item[a_name]['dominant_color'].append(dom_color)
    return {'artist_row': artist_to_item, 'creation_year':row['creation_year'], 'artist_full_name': row['artist_full_name'], 'artwork_name': row['artwork_name']}

def jsonify(df: pd.DataFrame):
    res = {}
    for ind,row in df.iterrows():
        res[ind] = transform_items(row.to_dict())
    with open(OUTPUT_FILE, 'w') as f:
        f.write(json.dumps(res))

def main():
    dataset = pd.read_csv(DATA_FILE)
    print(top_places(dataset))
    agg_ds = aggregate_per_geo(dataset)
    jsonify(agg_ds)
    print(hex2rgb("#949690"))


if __name__ == "__main__":
    main()
