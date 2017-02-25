# kiwi-node-server
kiwi node.js server


## Kiwi REST API

| Route             | HTTP Method |               Description               | Status             |
|-------------------|:-----------:|:---------------------------------------:|--------------------|
| /api              | **GET**     | display API routes                      | :white_check_mark: |
| /api/documents    | **GET**     | Get all the documents                   | :white_check_mark: |
| /api/document/:id | **GET**     | Get informations about a given document | :no_entry:         |
| /api/document/:id | **POST**    | Create a document with a given id       | :no_entry:         |
| /api/document/:id | **DELETE**  | Delete a document with a given id       | :no_entry:         |
| /api/document/:id | **PUT**     | Update a document with a given id       | :no_entry:         |
| /api/users        | **GET**     | Get all the users                       | :no_entry:         |
| /api/user/:id     | **GET**     | Get informations about a given user     | :no_entry:         |
| /api/user/:id     | **POST**    | Create a user with a given id           | :no_entry:         |
| /api/user/:id     | **PUT**     | Update user informations                | :no_entry:         |
| /api/user/:id     | **DELETE**  | Delete a user with a given id           | :no_entry:         |
