const http = require('tns-core-modules/http');

module.exports.get = async function (URL) {
    try {
        // NATIVESCRIPT ISSUE... response is HTTPResponse object
        let response = await http.request({
            url: URL,
            method: "GET"
        });

        // alert("RESPONSE: " + JSON.stringify(response.content));
        return JSON.parse(JSON.stringify(response.content));
    } catch (err) {
        alert("ERROR: " + err.message);
        return err;
    }
};