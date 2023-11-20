import os
import pandas as pd

directory = './to_merge' # could be a input to absolute path

dataframes = []

for filename in os.listdir(directory):
    if filename.endswith(".csv"):
        file_path = os.path.join(directory, filename)
        df = pd.read_csv(file_path)
        dataframes.append(df)

merged_df = pd.concat(dataframes, ignore_index=True)

output_file = './output.csv' # i'd let as it is
merged_df.to_csv(output_file, index=False)

print("CSV files have been merged successfully.")
