# subsidiary
[![Build Status](https://travis-ci.org/Knights-of-the-Functional-Calculus/subsidiary.svg?branch=develop)](https://travis-ci.org/Knights-of-the-Functional-Calculus/subsidiary)
## What is this?
My goal is to create a work of fiction that highlights the whacky world of tech. This is the personal story told through the lens of a not quite naive, not quite cynical, recent college grad.
### The Audience
**The Layman**: If you have no intention in engaging in the the coding portion of the game, that is totally fine. You won't be able to fully experience the story, but there will be a mechanic that will ferry you through the game. You may also be able to copy and paste solutions, but you still won't get the full experience.

**The Student**: You are my priority. The projects within the game are intended to introduce you to various real world situations. Many of which are integral to even creating this game. This means that contributing to designing this game and improving it are part of the game. Is that *meta* enough for you? In addition to the technical experience, this is also a small window (not sure how dramatized my retelling is) into work culture.

**The Veteran**: Did I get it right? I don't think I'm quite a fledgling developer anymore, but my first year out was definitely a unique experience.

**The Boss**: There is a lesson to be learned here. Don't assume anything about what your developers do. Ask as stupid a question as you need. You pay us to answer. A professional will answer you honestly. Though engineers tend to be a bit weird on etiqutte, you will know when you've earned their respect, and it's not by trying to look like the smartest guy in the room.
## Prerequisites
### Prior Knowledge
In order to fully experience this game, you should know how to use git and be able to program in at least one ubiquitous programming language (I recommend Python). In order to contribute to this project, Javascript knowledge is needed and Docker knowledge is recommended. I may migrate some of the code base to a native language in the future (looking to learn Rust), but for now I want to use a language that has a bunch of nice toys and actually renderers an iframe. Working with iframe has cut out a lot of the hassle of programming my own viewport UI for the programming environment.
### Installation
Here are the programs you want in your environment:
* [node](https://nodejs.org/en/) >=v11
* npm - The appropriate version should be bundled with node.
* [yarn](https://yarnpkg.com/en/docs/install) - Optional, LTS should do
* [docker](https://docs.docker.com/install/)

## Usage

```bash
# Get the project with submodules
git clone --recurse-submodules https://github.com/Knights-of-the-Functional-Calculus/subsidiary.git

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

## Special Thanks
[jeromeetienne](https://github.com/jeromeetienne/threex.htmlmixer/blob/master/examples/basic.html)
