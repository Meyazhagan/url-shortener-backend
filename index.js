const express = require("express");
const cors = require("cors");
const auth = require("./routes/auth");
const urlShortener = require("./routes/urlShortener");
const FindUrl = require("./routes/urlFind");

const db = require("./shared/mongodb.connect");
const authVerify = require("./middleware/auth.middleware");
const noEndpoint = require("./middleware/noEndpoint");

const app = express();

db.connect();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.get("/find-url", FindUrl);

app.use("/user", auth);

app.use(authVerify);

app.use("/app/url-shortener", urlShortener);

app.use(noEndpoint);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening to Port ${port}`));
