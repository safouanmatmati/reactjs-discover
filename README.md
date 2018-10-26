# My Comments

My Comments is a mini project to test my ability to develop website from unknow technologies as ReactJS/Node.

The requested was to :
* Create a local JSON/YAML storage to store ratings
* A rating must contain a name of business / user name / comment / score (between 0 and 5)
* A form should be shown to submit ratings
* Display all the ratings stored
* Propose a method to sort them by their score
* Calculate, display and update the average score of the ratings
* Add a status on ratings in order to accept or reject a rating and only display the published ones
* Add  Latitude / Longitude fields on ratings in order to display them on an embedded google map

Technologies used :
* [NodeJS 10](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/en/) : NodeJS dependencies manager
* [ReactJS - CRA (Create React App) module](https://github.com/facebook/create-react-app) : a Javascript application framework
* [React Router module](https://github.com/ReactTraining/react-router) : routes manager
* [Flow module](https://flow.org/) : type checker
* [Reactstrap](https://reactstrap.github.io/) : easy to use React Bootstrap 4 components
* [Leaflet](https://leafletjs.com/) : a javascript library to use OpenStreetMap
* [Docker for Windows](https://docs.docker.com/docker-for-windows/install/) : isolate environment manager

## Installation
Project can be run through Docker or from Node installed localy.

### Requirements
* [Docker](https://www.docker.com/get-started)  or [NodeJS 10](https://nodejs.org/en/download/current/) with [Yarn](https://pecl.php.net/package/redis/2.2.7/windows) dependencies manager
* [Google Chrome > v.70](https://www.google.com/chrome/)

### Step
First, open a terminal

```
git clone https://github.com/safouanmatmati/reactjs-discover.git
cd reactjs-discover/
```
#### from Docker
```
docker-compose build
```
#### or locally with Yarn
```
yarn
```

## Usage

#### from Docker
```
docker-compose up
```
#### or locally with Yarn
```
yarn start
```

Visits [http://localhost:3000](http://localhost:3000).

## Extra
The application can be added to the home screen.
A banner should be displayed to propose you to install it.
