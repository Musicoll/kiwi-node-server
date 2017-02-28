# kiwi-node-server
kiwi node.js server

## installation

To use this repository you'll need to have these dependencies installed :
 - Node.js
 - MongoDB
 - npm

clone this repository, add your `config.js` file in the `private` directory as explained [here](private), then:

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
