const express = require("express");
const https = require("https");
const app = express();
const PORT = process.env.PORT;
const SERVER_NAME = "Chimp";

// load css in node
app.use(express.static(__dirname + "/public"));

// get user data from the sign up page
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {

    res.sendFile(__dirname + "/signUp.html");
});

app.post("/", (req, res) => {

    const firstName = req.body.first;
    const lastName = req.body.last;
    const email = req.body.email;

    console.log(firstName, lastName, email);

    // create a data object that will comfort to mailchimp data storing format
    var data = {
        "members": [
            {
                "email_address": email,
                "status": "subscribed",
                "merge_fields": {
                    "FNAME": firstName,
                    "LNAME": lastName
                }
            }
        ]
    }

    // convert the json object to flat pack data that mailchimp will use
    var jsonData = JSON.stringify(data);

    // make request to mailchimp to store our data
    const chimpUrl = "https://us1.api.mailchimp.com/3.0/lists/6100854aba";
    const options = {
        method: "POST",
        auth: "andrews1:10a369bf2ae0ae658a90a420665a5bae-us1"
    }

    const request = https.request(chimpUrl, options, (response) => {
        // tap into the status code from the https request
        var checker = response.statusCode;
        if (checker === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

// start the server
app.listen(PORT || 3000, () => {
    console.log(SERVER_NAME + " is running on port: " + PORT);
});

// Mailchimp api key
// 7486d8c0e933454682b712445711f5b7-us1

// mailchimp list id
// 6100854aba
// link: https://sheltered-plains-70329.herokuapp.com/