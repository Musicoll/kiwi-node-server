# kiwi-node-server
[![Build Status](https://travis-ci.org/Musicoll/kiwi-node-server.svg?branch=master)](https://travis-ci.org/Musicoll/kiwi-node-server)
[![Coverage Status](https://coveralls.io/repos/github/Musicoll/kiwi-node-server/badge.svg?branch=master)](https://coveralls.io/github/Musicoll/kiwi-node-server?branch=master)
[![Dependency Status](https://david-dm.org/Musicoll/kiwi-node-server.svg)](https://david-dm.org/Musicoll/kiwi-node-server)

kiwi node.js server

## installation

To use this repository you'll need to have these dependencies installed :
 - Node.js
 - MongoDB
 - npm

clone this repository then type:

```shell
# install node package dependencies
$ npm install

# start mongoDB
$ mongo

# start the server
$ npm start
```


## Kiwi REST API

| Route              | HTTP Method |               Description               | Route status       |
|--------------------|:-----------:|:---------------------------------------:|--------------------|
| /api               | **GET**     | display API routes                      | :white_check_mark: |
| /api/auth          | **POST**    | Get an api access token                 | :white_check_mark: |
| /api/documents     | **GET**     | Get all the documents                   | :white_check_mark: |
| /api/documents     | **POST**    | Create a new document                   | :white_check_mark: |
| /api/documents/:id | **GET**     | Get informations about a given document | :white_check_mark: |
| /api/documents/:id | **DELETE**  | Delete a document with a given id       | :white_check_mark: |
| /api/documents/:id | **PUT**     | Update a document with a given id       | :white_check_mark: |
| /api/users         | **GET**     | Get all the users                       | :white_check_mark: |
| /api/users         | **POST**    | Create a new user                       | :white_check_mark: |
| /api/user/:id      | **GET**     | Get informations about a given user     | :white_check_mark: |
| /api/user/:id      | **PUT**     | Update user informations                | :white_check_mark: |
| /api/user/:id      | **DELETE**  | Delete a user with a given id           | :white_check_mark: |
