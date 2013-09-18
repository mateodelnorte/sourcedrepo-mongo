var mongo = require('./lib/mongo');

var types = [];

module.exports.register = function (type, cb) {
  types.push(type);
};

module.exports.init = function (cb) {
  var count = types.length;
  function checkDone () {
    if (inited === count) return cb();
  }
  types.forEach(function (type) {
    mongo.initCollection(type, function (err) {
      if (err) return cb(err);
      inited++;
      checkDone();
    });
  });
};

module.exports.save = function (aggregate, cb) {
  if (aggregate.version % aggregate.snapshotAt === 0)
    mongo.saveSnapshot(aggregate, cb);
  else
    mongo.exports.saveEvents(aggregate, cb);
};
