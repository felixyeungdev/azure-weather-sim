from matplotlib import pyplot as plt
import os
import json

stats_dir = './stats'

def plot_rows_stats():
  time_taken_list = []

  for entry in sorted(os.listdir(stats_dir)):
    if not entry.endswith('.json'):
      continue
    if not entry.startswith('rows'):
      continue
    full_path = os.path.join(stats_dir, entry)
    
    with open(full_path) as file:
      data = json.load(file)
      time_taken_list += data

  x = list(map(lambda x: x*20, range(len(time_taken_list))))
  y = time_taken_list

  average_time_taken = sum(time_taken_list) / len(time_taken_list)



  plt.clf()

  plt.title("How well database rows scales")
  plt.ylabel("Time taken (ms)")
  plt.xlabel("Number of rows before running function")

  plt.plot(x, y, '.', markersize=1)
  plt.axhline(y = average_time_taken, color = 'r', linestyle = '-')
  plt.savefig('stats-rows.png', dpi=1600)

def plot_sensors_stats():
  time_taken_list = []

  for entry in sorted(os.listdir(stats_dir)):
    if not entry.endswith('.json'):
      continue
    if not entry.startswith('sensors'):
      continue
    full_path = os.path.join(stats_dir, entry)
    
    with open(full_path) as file:
      data = json.load(file)
      time_taken_list += data

  x = list(map(lambda x: x*20, range(1, len(time_taken_list) + 1)))
  y = time_taken_list


  plt.clf()

  plt.title("How well number of sensors scales")
  plt.ylabel("Time taken (ms)")
  plt.xlabel("Number of sensors collected in function")

  plt.plot(x, y, '.', markersize=1)
  plt.savefig('stats-sensors.png')

plot_rows_stats()
plot_sensors_stats()