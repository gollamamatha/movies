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
        lead_actor)VALUES('${directorId}',${movieName},'${leadActor}');`;
  const dbResponse = await db.run(addMovie);
  const movieId = dbResponse.lastId;
  response.send({ movieId: movieId });
});
