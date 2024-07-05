# API 接口封装 (weatherApi.js)

- 函数 获取位置信息():

  - 调用高德地图 API 获取用户当前位置的经纬度和 adcode
  - 返回位置信息

- 函数 获取天气预报(adcode):

  - 调用高德地图 API 获取指定 adcode 的未来几天的天气预报信息
  - 返回天气预报数据

- 函数 获取实时天气(adcode):

  - 调用高德地图 API 获取指定 adcode 的实时天气信息
  - 返回实时天气数据

- 函数 搜索城市(关键词):

  - 调用高德地图 API 根据关键词搜索城市
  - 返回匹配的城市列表

- 函数 根据 adcode 搜索城市(adcode):
  - 调用高德地图 API 根据 adcode 搜索城市信息
  - 返回城市信息

# 数据存储与管理 (weatherStore.js)

- 状态 cities: 从 localStorage 读取已保存的城市列表，初始为空数组
- 状态 currentWeather: 当前城市的天气预报数据，初始为空数组
- 状态 liveWeather: 当前城市的实时天气数据，初始为空对象
- 状态 chartData: 用于图表展示的天气数据，初始为空对象

- 函数 setWeatherData(adcode):

  - 设置 loading 状态为 true
  - 调用 获取天气预报(adcode) 获取天气预报数据
  - 更新 currentWeather 状态
  - 格式化 chartData 数据并更新状态
  - 设置 loading 状态为 false

- 函数 setLiveWeatherData(adcode):

  - 调用 获取实时天气(adcode) 获取实时天气数据
  - 更新 liveWeather 状态

- 函数 addCity(城市信息):

  - 如果城市已存在，则不添加
  - 将城市信息添加到 cities 数组
  - 将 cities 数组保存到 localStorage

- 函数 deleteCity(adcode):

  - 从 cities 数组中删除指定 adcode 的城市
  - 将 cities 数组保存到 localStorage

- 函数 initialize():

  - 调用 获取位置信息() 获取用户当前位置
  - 调用 setWeatherData() 获取当前位置的天气预报数据
  - 调用 setLiveWeatherData() 获取当前位置的实时天气数据

- 函数 searchCity(关键词):

  - 调用 搜索城市(关键词) 搜索城市
  - 返回搜索结果

- 函数 getDayOfWeek(index):

  - 根据索引计算星期几
  - 返回星期几字符串

- 函数 formatDate(日期字符串):

  - 将日期字符串格式化为 MM-DD 格式
  - 返回格式化后的日期字符串

- 函数 formatWind(风力):
  - 将风力等级格式化为更易读的字符串
  - 返回格式化后的风力字符串
