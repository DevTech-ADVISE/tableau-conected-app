const express = require("express");
const app = express();
const port = 3000;
const nJwt = require("njwt");
const CryptoJS = require("crypto-js");
const secureRandom = require("secure-random");

const connectedAppSecretKey = "2kIdGlWiG+99DFEmBToWQBE0rfM13WLVM57zEV7MF6c="; //
const connectedAppClientId = "9831dc4f-60c8-4362-80f6-90dd8fb83ce9"; // Create a highly random byte array of 256 bytes
const connectedAppSecretId = "3fab4d21-ad75-4c07-9424-8aa79f6d68f7";
const user = "svalluru@usaid.gov"; //would use sso for this
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

/*app.get("/api/jwt", (req, res) => {
  let claims = {
    iss: connectedAppClientId,
    aud: "tableau",
    sub: user,
    scp: ["tableau:views:embed", "tableau:metrics:embed"],
  };

  var jwt = nJwt.create(claims, connectedAppSecretKey);
  jwt.setExpiration(new Date().getTime() + 5 * 60 * 1000); // 5 minutes from now
  jwt.setHeader("kid", connectedAppSecretId);
  jwt.setHeader("iss", connectedAppClientId);
  res.send(jwt.compact());
});*/

app.get("/api/jwt", (req, res) => {
  var header = {
    alg: "HS256",
    typ: "JWT",
    iss: connectedAppClientId,
    kid: connectedAppSecretId,
  };

  var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
  var encodedHeader = base64url(stringifiedHeader);

  var claimSet = {
    sub: user,
    aud: "tableau",
    nbf: Math.round(new Date().getTime() / 1000) - 100,
    jti: new Date().getTime().toString(),
    iss: connectedAppClientId,
    scp: ["tableau:views:embed", "tableau:metrics:embed"],
    exp: Math.round(new Date().getTime() / 1000) + 100,
  };

  var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(claimSet));
  var encodedData = base64url(stringifiedData);
  var token = encodedHeader + "." + encodedData;
  var signature = CryptoJS.HmacSHA256(token, connectedAppSecretKey);
  signature = base64url(signature);
  var signedToken = token + "." + signature;
  res.send(signedToken);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
