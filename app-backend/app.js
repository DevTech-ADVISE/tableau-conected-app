const express = require("express");
const app = express();
const port = 8080;
const nJwt = require("njwt");
const secureRandom = require("secure-random");

const connectedAppSecretKey = "string"; //
const connectedAppClientId = "string"; // Create a highly random byte array of 256 bytes
const connectedAppSecretId = "string";
const user = "username"; //would use sso for this

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/jwt", (req, res) => {
  let claims = {
    iss: connectedAppClientId,
    aud: "tableau",
    sub: user,
    scope: "tableau:views:embed, tableau:metrics:embed",
  };

  var jwt = nJwt.create(claims, connectedAppSecretKey);
  jwt.setExpiration(new Date().getTime() + 60 * 60 * 1000); // One hour from now
  res.send(jwt);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
