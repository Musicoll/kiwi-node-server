let mongoose = require("mongoose");
let config = require("config");

// set Promise provider to bluebird
mongoose.Promise = require("bluebird");

// Connect to MongoDB and create/use database
connect = done => {
  // CONNECTION EVENTS
  // When successfully connected
  mongoose.connection.on("connected", function() {
    console.log("Mongoose default connection open to " + config.db_url);
    typeof done === "function" && done();
  });

  // If the connection throws an error
  mongoose.connection.on("error", function(err) {
    console.log("Mongoose default connection error: " + err);
    typeof done === "function" && done(err);
  });

  // When the connection is disconnected
  mongoose.connection.on("disconnected", function() {
    console.log("Mongoose default connection disconnected");
  });

  // If the Node process ends, close the Mongoose connection
  process.on("SIGINT", function() {
    mongoose.connection.close(function() {
      console.log(
        "Mongoose default connection disconnected through app termination"
      );
      process.exit(0);
    });
  });

  mongoose.set("useFindAndModify", false);

  mongoose.connect(
    config.db_url,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      socketTimeoutMS: 0,
      keepAlive: true,
      reconnectTries: 30
    }
  );
};

module.exports = {
  connect: connect
};
