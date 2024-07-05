# Weather App

This repository contains a simple weather application built with Vue.js that allows users to check the weather forecast and live weather conditions for multiple cities. The app utilizes the AMap (高德地图) API for fetching weather data and location information.

## Features

- **Weather Forecasts**: View detailed weather forecasts for the next few days.
- **Live Weather Updates**: Get real-time weather updates including temperature, humidity, and wind conditions.
- **City Management**: Add and remove cities to track weather conditions.
- **Search Functionality**: Search for cities to add to your weather tracking list.
- **Data Visualization**: Visualize weather data using charts for better understanding.

## Technologies Used

- **Vue.js**: Frontend framework for building user interfaces.
- **Axios**: Promise-based HTTP client for making API requests.
- **AMap API**: For fetching location and weather data.
- **LocalStorage**: For storing user's city preferences.

## Project Structure

- **App.vue**: The main Vue component that serves as the entry point of the application.
- **weatherStore.js**: Vuex store for managing application state, including weather data and city management.
- **Pseudocode.md**: Documentation providing an overview of the project, setup instructions, and usage guidelines.

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/weather-app.git
   ```

2. Install dependencies:

   ```bash
   cd weather-app
   npm install
   ```

3. Create a `.env` file in the root directory and add your AMap API key:

   ```
   VUE_APP_AMAP_KEY=your_amap_api_key_here
   ```

4. Run the application:

   ```bash
   npm run serve
   ```

5. Open your browser and navigate to `http://localhost:8080` to view the app.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
