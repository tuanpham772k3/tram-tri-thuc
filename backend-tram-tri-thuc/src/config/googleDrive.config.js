const { google } = require("googleapis");
const path = require("path");

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "..", "..", process.env.GOOGLE_SERVICE_ACCOUNT_PATH),
    scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

module.exports = drive;
