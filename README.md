# iBookmark Chrome extension

This is a template for creating a Chrome extension using React and [Vite](https://vitejs.dev/) with TypeScript.

ui: https://wind-ui.com/


## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18+ or 20+) installed on your machine.

### Setup
```sh
npm install
```

## 🏗️ Development

To start the development server:

```sh
npm start
```

This will start the Vite development server and open your default browser.

## 📦 Build 

To create a production build:

```sh
npm run build
```

This will generate the build files in the `build` directory.

## 📂 Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" using the toggle switch in the top right corner.
3. Click "Load unpacked" and select the `build` directory.

Your React app should now be loaded as a Chrome extension!

## recommend dev method
1. open chrome-extension://{yourExtensionID}/index.html
2. run `npm run watch-build`

## License

This project is licensed under the MIT License.