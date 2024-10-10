# ClonerNews 

ClonerNews is a web application that replicates key features of Hacker News. It allows users to browse news stories, view comments, and receive live updates from the Hacker News API.

## Features

- **Story Browsing:** View a list of top stories, new stories, and more.
- **Load More Posts:** Additional posts can be loaded either by scrolling or clicking a button.
- **Comments Display:** Load and view comments for each story.
- **Live Updates:** Fetch and display the latest items and updated profiles.
- **Responsive Design:** Optimized for both large and small screens.

## Technologies Used

- **JavaScript:** For client-side scripting.
- **Fetch API:** For making HTTP requests.
- **HTML/CSS:** For page structure and styling.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/JosephOkumu/Clonernews_V2.git
   ```

2. **Navigate to Project Directory:**

   ```bash
   cd clonernews
   ```

3. **Open `index.html` in a Web Browser**

## Usage

- **Fetch Stories:** The application fetches top stories by default. Use the navigation bar to switch between different types of stories.
- **Load More Posts:** Click the "Load More" button or scroll down to load additional posts.
- **View Comments:** Click "Load Comments" under a story to view its comments.
- **Live Updates:** Click "Live Updates" to fetch new items and updates. Updates occur automatically every 5 seconds.
- **Navigation:** Use the navigation bar to filter between different story types such as top stories, new stories, etc.

## Code Overview

### `index.html`

Contains the HTML structure for the application, including the posts container, navigation, and buttons.

### `cloner-news.js`

- **Fetch Stories:** Retrieves stories from the Hacker News API.
- **Load More Posts:** Manages the loading of additional posts.
- **Load Comments:** Fetches and displays comments for each story.
- **Live Updates:** Fetches and displays new items and updates.

### `tests`
Directory containing the test files for the program that uses the Jest framework to test its functionalities.

## Testing
Given that the program interacts heavily with DOM elements and external APIs, both DOM manipulation and asynchronous functions like API calls are tested check on its UI improvements.

To test:

1. Navigate into the test directory and install Jest if it already doesnt exist for user testing by:
```bash
npm install --save-dev jest
```
2. Install Jest-DOM for DOM manipulation by:
```bash
npm install --save-dev @testing-library/jest-dom
```
3. Install Jest-fetch-mock for mocking http requests by:
```bash
npm install --save-dev jest-fetch-mock
```
4. Modify the package.json to include Jest setup:
```json
{
  "scripts": {
    "test": "jest"
  },
  "jest": {
    "setupFiles": ["jest-fetch-mock"],
    "testEnvironment": "jsdom"
  }
}
```
5. Then run all the tests using the command:
```bash
npm test
```

## Contributing

Contributions are welcome! Please open issues or submit pull requests to improve the project or fix bugs.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Authors

[JosephOkumu](https://github.com/JosephOkumu)
