from os import sep
import numpy as np
import pandas as pd
import seaborn as sns
from fitter import Fitter, get_common_distributions, get_distributions

dataset = pd.read_csv("./data/EURUSD_H4.csv", sep="\t")

sns.set_style('whitegrid')
sns.set_context('paper', font_scale=2)

sns.displot(data=dataset, x="Time", y="Close", kind="hist", bins=100, aspect=1.5)