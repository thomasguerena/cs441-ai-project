# CS441-AI Artificial Intelligence Course Project
## Growing Simulated Bacteria Colonies in Cellular Automata
### Summary
This project is a naive simulation of bacteria colony growth and evolution. The environment is confined to a Zn x Zn plane. The passage of time has been warped to both slow the rate of bacteria growth and to accelerate the rate of genetic diversification. The purpose of this project is to provide people with non-computer science backgrounds a tool for exploring cellular automata. With this purpose in mind, thirteen impactful simulation parameters are exposed for users to adjust. The design does not aim for realism, but instead to maximize readability, allowing users to recognize the effects of their input.
### Install and Build
1. The project is available on Github, right [here](github.com/thomasguerena/cs441-ai-project).
2. Clone or download a zip file of the repository.
3. Open _index.html_. For best results, use Chrome for desktop. _(note: I made no attempt at cross-browser or multi-device support)_

If you want to make changes to the Javascript files, refresh the browser and the project will be updated. If you want to make any changes to the project's UI via SASS files, follow these instructions.
1. Install [nodejs](nodejs.org). This now includes _npm_.
2. Install grunt.
    `npm install -g grunt`,
    `npm install -g grunt-cli`
4. Navigate to the project root directory.
5. Build.
    `grunt sass`
6. Automatically build when files change.
    `grunt watch`