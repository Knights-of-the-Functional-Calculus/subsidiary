# subsidiary
[![CircleCI](https://circleci.com/gh/j4qfrost/subsidiary.svg?style=svg)](https://circleci.com/gh/j4qfrost/subsidiary)
## Prerequisites

Here are the programs you want in your environment:
* [node](https://nodejs.org/en/) >=v11
* npm - The appropriate version should be bundled with node.
* [yarn](https://yarnpkg.com/en/docs/install) - Optional, LTS should do
* [docker](https://docs.docker.com/install/)

## Usage

```bash
# Get the project with submodules
git clone --recurse-submodules https://github.com/j4qfrost/subsidiary.git
```

```bash
npm install
npm start # For full view
# OR
yarn install
yarn start
```

If you plan on developing, you may want to set up the .env file and run the dev command.

```bash
cp .env-dist .env

npm dev # For full view
# OR
yarn dev 
```