var log = require('debug')('sourced:mongo');
var mongoose = require('mongoose');
var url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sourced';

mongoose.connect(url, {
  db: { native_parser: true }
});

var connection = module.exports.connection = mongoose.connection;

connection.on('error', function (err) {
  log('error: %s', err);
});

connection.on('open', function () {
  log('connection to mongo established at %s', url);
});

module.exports.db = mongoose;

module.exports.collections = {};

module.exports.initCollection = function (type, cb) {
  var eventType = type + '-events';
  var eventSchema = new mongoose.Schema({
    version: Number,
    data: mongoose.Schema.Types.Mixed
  });
  eventSchema.pre('save', function (next) {
    this.markModified('data');
    next();
  });
  var snapshotType = type + '-snapshots';
  var snapshotSchema = new mongoose.Schema({
    version: Number,
    data: mongoose.Schema.Types.Mixed
  });
  snapshotSchema.pre('save', function (next) {
    this.markModified('data');
    next();
  });
  module.exports.collections[eventType] = mongoose.model(eventType, eventSchema);
  module.exports.collections[snapshotType] = mongoose.model(snapshotType, snapshotSchema);
  cb();
};

module.exports.saveEvents = function (aggregate, cb) {
  var Collection = module.exports.collections[aggregate.type + '-events'];
  Collection.updateById(aggregate.id, cb);
};

module.exports.saveSnapshot = function (aggregate, cb) {
  var Collection = module.exports.collections[aggregate.type + '-events'];
  Collection.updateById(aggregate.id, cb);
};
