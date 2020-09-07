# Movie_Rental_Web_MEN

"Port" / "Refactor" a previous java desktop project to a web project using MEN stack as backend (MongoDB, Express, Node), which gives us a opportunity to manage our movies, organize them by directors and/or movies etc.

#### Previous project:

https://github.com/NemesLaszlo/Movie_Rental

#### Endpoints of the Backend: (The application is using ejs.)

| Entity   | Type   | URL                | Description                                                            |
| -------- | ------ | ------------------ | ---------------------------------------------------------------------- |
| -        | GET    | /                  | Home Page with the recently added movies (with a limit (10)).          |
| Director | GET    | directors          | Read all directors with a search option.                               |
|          | GET    | directors/new      | "Read" - Get the create new director page.                             |
|          | POST   | directors/create   | Create a new director.                                                 |
|          | GET    | directors/:id      | Read a specific director by id.                                        |
|          | GET    | directors/:id/edit | "Read" - Get the update or editing page of the director.               |
|          | PUT    | directors/:id      | Update a director by id.                                               |
|          | DELETE | directors/:id      | Delete a director by id - delete every movies of the director as well. |
| Movie    | GET    | movies             | Read all movies with a search option.                                  |
|          | GET    | movies/available   | Read all available (not rented) movies.                                |
|          | GET    | movies/new         | "Read" - Get the create new movie page.                                |
|          | POST   | movies/create      | Create a new movie.                                                    |
|          | GET    | movies/:id         | Read a specific movie by id.                                           |
|          | GET    | movies/:id/edit    | "Read" - Get the update or editing page of the movie.                  |
|          | PUT    | movies/:id         | Update movie by id.                                                    |
|          | DELETE | movies/:id         | Delete a movie by id.                                                  |
