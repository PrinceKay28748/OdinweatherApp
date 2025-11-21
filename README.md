# OdinweatherApp

A modern weather dashboard built with vanilla JavaScript, HTML, and CSS. Fetches live weather data from the Visual Crossing API and displays current conditions and a multi-day forecast with dynamic icons and a dark glassmorphism theme.

## Features
- Search for any city and get real-time weather
- Current conditions and 5-day forecast
- Dynamic SVG icons for sun, cloud, rain, snow, and unknown
- Responsive, dark-themed UI with glassmorphism effects
- Loading indicator for slow networks
- Accessible form and keyboard navigation

## Demo
![Screenshot](screenshot.png)

## Getting Started
1. **Clone or download this repo**
2. **Open `index.html` in your browser**
	- No build step required
	- All assets are local
3. **Type a city name and click Search**

## Project Structure
```
OdinweatherApp/
├── index.html         # Main HTML file
├── index.js           # App logic (fetch, process, render)
├── index.css          # Dark theme styles
├── icons/             # SVG weather icons
│   ├── sun.svg
│   ├── cloud.svg
│   ├── rain.svg
│   ├── snow.svg
│   └── unknown.svg
└── README.md          # This file
```

## API
- Uses [Visual Crossing Weather API](https://www.visualcrossing.com/weather-api)
- You can change the API key in `index.js` if needed

## Customization
- **Theme:** Edit `index.css` for colors, layout, or glassmorphism
- **Icons:** Add more SVGs to `icons/` and update the mapping in `index.js`
- **Units:** Default is metric (Celsius); you can change to imperial in the API URL

## Accessibility
- Keyboard-friendly form
- Focus outlines for inputs and buttons
- Responsive layout for mobile and desktop

## License
MIT

---
Built for The Odin Project and personal learning.