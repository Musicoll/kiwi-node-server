# kiwi-node-server
[![Build Status](https://travis-ci.org/Musicoll/kiwi-node-server.svg?branch=master)](https://travis-ci.org/Musicoll/kiwi-node-server)
[![Coverage Status](https://coveralls.io/repos/github/Musicoll/kiwi-node-server/badge.svg?branch=master)](https://coveralls.io/github/Musicoll/kiwi-node-server?branch=master)
[![Dependency Status](https://david-dm.org/Musicoll/kiwi-node-server.svg)](https://david-dm.org/Musicoll/kiwi-node-server)
[![devDependencies Status](https://david-dm.org/Musicoll/kiwi-node-server/dev-status.svg)](https://david-dm.org/Musicoll/kiwi-node-server?type=dev)
[![Documentation](https://img.shields.io/badge/KiwiAPI-documentation-blue.svg)](http://musicoll.github.io/kiwi-node-server/)

kiwi node.js server

## installation

To use this repository you'll need to have these dependencies installed :
 - Node.js
 - MongoDB
 - npm

clone this repository then:

install node package dependencies using

```shell
$ npm install
```

then start the mongo database by typing in another console process
```shell
$ sudo mongod

# (linux):
$ sudo service mongodb start
```

You can then start the server by typing:
```shell
$ npm start
```

And run the unit-test by typing:
```shell
$ npm test
```

Or the unit-test with coverage by typing:
```shell
$ npm run test-cov
```

## Kiwi REST API

| Route              | HTTP Method |               Description               |       Status       |
|--------------------|:-----------:|-----------------------------------------|:------------------:|
| [/api](https://musicoll.github.io/kiwi-node-server/index.html#api-Global-GetApiPaths)               | **GET**     | display API routes                      | :white_check_mark: |
| /api/auth          | **POST**    | Get an api access token                 | :white_check_mark: |
| [/api/documents](https://musicoll.github.io/kiwi-node-server/index.html#api-Documents-GetDocuments)     | **GET**     | Get all the documents                   | :white_check_mark: |
| [/api/documents](https://musicoll.github.io/kiwi-node-server/index.html#api-Documents-NewDocument)          | **POST**    | Create a new document                   | :white_check_mark: |
| [/api/documents/:id](https://musicoll.github.io/kiwi-node-server/index.html#api-Documents-GetDocument) | **GET**     | Get informations about a given document | :white_check_mark: |
| [/api/documents/:id](https://musicoll.github.io/kiwi-node-server/index.html#api-Documents-DeleteDocument) | **DELETE**  | Delete a document with a given id       | :white_check_mark: |
| [/api/documents/:id](https://musicoll.github.io/kiwi-node-server/index.html#api-Documents-UpdateDocument) | **PUT**     | Update a document with a given id       | :white_check_mark: |
| /api/users         | **GET**     | Get all the users                       | :white_check_mark: |
| /api/users         | **POST**    | Create a new user                       | :white_check_mark: |
| /api/users/:id     | **GET**     | Get informations about a given user     | :white_check_mark: |
| /api/users/:id     | **PUT**     | Update user informations                | :white_check_mark: |
| /api/users/:id     | **DELETE**  | Delete a user with a given id           | :white_check_mark: |

## API Documentation

The documentation of the Kiwi API can be regenerated using [apidoc](http://apidocjs.com/).  
Install apidoc using: `npm install apidoc -g`, then type:

```shell
$ npm run documentation
```

it will generate the documentation in ./docs. Open ./docs/index.html to see the documentation.
