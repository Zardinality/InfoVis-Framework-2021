import pandas as pd

df = pd.read_csv("data/omniart_v3_datadump_1k.csv", index_col=0)

def return_url_list():
    urls = df.iloc[0:5]['image_url'].values

    return urls


# def return_attributes(url):
#     row = df.loc[df['image_url'] == url]
#
#     return row["artwork_name"].value
