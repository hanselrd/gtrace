# Trace

> Profile management system

[![Build Status](https://img.shields.io/travis/hanselrd/trace.svg?style=flat-square)](https://travis-ci.org/hanselrd/trace)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

Simple and easy to use profile system

## Installation

If you tested out our [live demo](https://traceapp.herokuapp.com) and want to setup your own version then follow the steps below to install it locally or on *Heroku*

_**Note**: The following guides assume you are on Ubuntu_

### Local

First, you need to provision a relational database so the `GraphQL` server can persist data.

For *Trace*, we used `PostgreSQL`, but any database supported by the `sequelize` package can be used like `MySQL`, `SQLite` and `MSSQ`.

#### PostgreSQL

To install `PostgreSQL` run

```sh
$ sudo apt install postgresql postgresql-contrib

```

Once installed, you need to set the password for the `postgres` account

```sh
$ sudo -u postgres psql postgres
$ \password postgres
$ \q
```

After the password is set, you need to create a database to persist data

```sh
$ sudo -u postgres psql
$ CREATE DATABASE trace;
$ \q
```

#### Client

The client was created using *React* and resides in the `client` folder. It can be run independently or served alongside the server if compiled.

##### Independently

To run the client independently run the following

```sh
$ cd client
$ npm install
$ npm start
```

This will start up the client on [http://localhost:3000](http://localhost:3000)

##### Alongside the Server

To run the client alongside the server you need to compile it and then launch your server normally

```sh
$ cd client
$ npm install
$ npm run build
```

To access the client you will need to start up the server.

#### Server

To start up the server run the following

```sh
$ npm install
$ npm start
```

This will start up the server on [http://localhost:5000](http://localhost:5000) and serve what is inside the `client/build` folder. You will be able to access the endpoints `/graphql` and `/graphiql` from here and any other endpoint will redirect to the `client/build` folder which is where the compiled client will be. If you did not compile the client and instead ran it independently then accessing any endpoints other than those two will display an error in your browser.

### Heroku

```sh
$ heroku
```

## Development setup

Describe how to install all development dependencies and how to run an automated test-suite of some kind. Potentially do this for multiple platforms.

```sh
$ make install
$ npm test
```

## Contributors

- [Hansel De La Cruz](https://github.com/hanselrd)
- [Devin Congdon](https://github.com/DevinCongdon)
- [Daniel Shapiro](https://github.com/DS2000g)
