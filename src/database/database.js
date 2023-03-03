let mongoose = require("mongoose");
let mongooseDynamic = require ('mongoose-dynamic-schemas');

let localString="mongodb://localhost:27017/BiometricLogs";

const url = process.env.DATABASE_URI;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(
    `${url}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
);

module.exports={
    mongoose
};
