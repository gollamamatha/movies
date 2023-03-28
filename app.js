const express = require("express");
const path = require("path");
const app = express();

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;
const initialize = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initialize();

//get

app.get("/movies/", async (request, response) => {
  const movieDetails = `SELECT movie_name FROM Movie;`;
  const movie = await db.all(movieDetails);
  response.send(movie);
});

// post

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovie = `INSERT INTO Movie (director_id,movie_name,
        lead_actor)VALUES(${directorId},'${movieName}','${leadActor}');`;
  const dbResponse = await db.run(addMovie);
  const movieId = dbResponse.lastId;
  response.send("Movie Successfully Added");
});

//get movie
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovie = `SELECT * FROM Movie WHERE Movie_id=${movieId};`;
  const dbResponse = await db.get(getMovie);
  response.send(dbResponse);
});

//update

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const upDateDetails = request.body;

  const { directorId, movieName, leadActor } = upDateDetails;

  const getUpDate = `UPDATE Movie 
    SET 
    director_id=${directorId},
    movie_name='${movieName}',
    lead_actor='${leadActor}'
    WHERE 
    movie_id=${movieId};
    `;
  await db.run(getUpDate);
  response.send("Movie Details Updated");
});

//delete

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getDelete = `DELETE FROM Movie WHERE movie_id=${movieId};`;
  await db.run(getDelete);
  response.send("Movie Details Updated");
});

//get directors

app.get("/directors/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      Director
    ORDER BY
      director_id;`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

//get director and movie

app.get("/directors/:directorId/movies/,", async (request, response) => {
  const directorId = request.params;
  const getDirectorQuery = `
    SELECT
     movie_name
    FROM
     Movie
    WHERE
      director_id = ${directorId};`;
  const booksArray = await db.all(getDirectorQuery);
  response.send(booksArray);
});
