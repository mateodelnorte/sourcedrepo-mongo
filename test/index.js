var repo = require('../');
var User = require('../node_modules/sourced/examples/auth/user');
var App = require('../node_modules/sourced/examples/auth/app');
var util = require('util');

describe('souredrepo', function () {
  describe('saveEvents', function () {
    it('should save some stuff', function () {
      var agg = new User();
      console.log(util.inspect(agg));
      repo.save(agg, function (err, res) {
        if (err) throw err;
        console.log(res);
      });
    });
  });
});
