var request = require('superagent');
require('superagent-auth-bearer')(request);
var Promise = require('es6-promise').Promise;

var Api = {
  get: function(url) {
    return new Promise(function (resolve, reject) {
      request
        .get(url)
        .end(function (err, res) {
          if (err || !res.ok) {
            reject(err);
          } else {
            resolve(res.body);
          }
        });
    });
  },
  post: function(url, userData, token) {
    return new Promise(function (resolve, reject) {
      request
        .post(url)
        .authBearer(token)
        .send(userData)
        .end(function (err, res) {
          if (err || !res.ok) {
            var errorResponse = JSON.parse(err.response.text);
            reject(errorResponse);
          } else {
            resolve(res);
          }
        });
    });
  },
  postEmpty: function(url) {
    return new Promise(function (resolve, reject) {
      request
        .post(url)
        .send()
        .end(function (err, res) {
          // successfully returned token as raw response throws err rather than parsed response, so check for 200 status code
          if (err.statusCode !== 200) {
            reject(err);
          } else {
            var rawResponse = err.rawResponse;
            resolve(rawResponse);
          }
        });
    });
  },
}

module.exports = Api;