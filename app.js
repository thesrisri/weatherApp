// imports and requirements
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}))


//  request methods
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html');
})

app.post("/", function(req, res) {
  // uses openweathermap.org for getting data using api call
  const query = req.body.location;
  const appid = "4d337ff3d2eccc21ff2750ca6dd086eb";
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appid + "&units=" + units + "";
  https.get(url, function(response) {
    response.on("data", function(data) {
      const dataJson = JSON.parse(data);
      // if data is not received from api due to any reason
      if (dataJson.cod != 200 ){
        res.write("<h1> Opps! check the error</h1>");
        res.write(dataJson.message);
        res.send();
        return
      }
      const temp = dataJson.main.temp;
      const feels_like = dataJson.main.feels_like;
      const description = dataJson.weather[0].description;
      const icon = dataJson.weather[0].icon;
      const imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<div><h1>the temp at " + query + " is " + temp + "</h1>");
      res.write("<img src=" + imgUrl + "></div>");
      res.send();
    })
  })
})

//  app starts listening to port 3000
app.listen(3000, function() {
  console.log("Server is running on port 3000");
})
