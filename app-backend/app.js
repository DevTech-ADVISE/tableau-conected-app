const express = require("express");
const app = express();
const port = 3000;
const nJwt = require("njwt");
const CryptoJS = require("crypto-js");
const secureRandom = require("secure-random");

const connectedAppSecretKey = "string"; //
const connectedAppClientId = "string"; // Create a highly random byte array of 256 bytes
const connectedAppSecretId = "string";
const user = "string"; //would use sso for this
const base64url = (source) => {
  encodedSource = CryptoJS.enc.Base64.stringify(source);
  encodedSource = encodedSource.replace(/=+$/, "");
  encodedSource = encodedSource.replace(/\+/g, "-");
  encodedSource = encodedSource.replace(/\//g, "_");
  return encodedSource;
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/jwt", (req, res) => {
  const header = {
    alg: "HS256",
    typ: "JWT",
    iss: connectedAppClientId,
    kid: connectedAppSecretId,
  };

  const encodedHeader = base64url(
    CryptoJS.enc.Utf8.parse(JSON.stringify(header))
  );

  const claimSet = {
    sub: user,
    aud: "tableau",
    nbf: Math.round(new Date().getTime() / 1000) - 100,
    jti: new Date().getTime().toString(),
    iss: connectedAppClientId,
    scp: ["tableau:views:embed", "tableau:metrics:embed"],
    exp: Math.round(new Date().getTime() / 1000) + 100,
  };

  const encodedData = base64url(
    CryptoJS.enc.Utf8.parse(JSON.stringify(claimSet))
  );
  const token = encodedHeader + "." + encodedData;
  const signature = base64url(
    CryptoJS.HmacSHA256(token, connectedAppSecretKey)
  );
  const signedToken = token + "." + signature;
  res.send(signedToken);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
