import pandas as pd
import numpy as nd
import matplotlib.pyplot as plt
from pandas.io import json


DATA_FILE = '../data/omniart_v3_datadump_1k.csv'
OUTPUT_FILE = '../data/omniart_v3_1k_res.json'

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

def jsonify(df: pd.DataFrame):
    res = {}
    for ind,row in df.iterrows():
        res[ind] = row.to_dict()
    with open(OUTPUT_FILE, 'w') as f:
        f.write(json.dumps(res))

def main():
    dataset = pd.read_csv(DATA_FILE)
    print(top_places(dataset))
    agg_ds = aggregate_per_geo(dataset)
    jsonify(agg_ds)



if __name__ == "__main__":
    main()
