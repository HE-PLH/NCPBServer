let mongoose = require("mongoose");
let mongooseDynamic = require ('mongoose-dynamic-schemas');

// let localString="mongodb://localhost:27017/BiometricLogs";
let app_string="mongodb+srv://patrick:patricode@ncpblogs.jyktufi.mongodb.net/?retryWrites=true&w=majority";
// let app_string1="mongodb+srv://patrick:Mishtaniga0717%21@cluster0.vivum.mongodb.net/Cluster0?authSource=admin&replicaSet=atlas-10w1a9-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
// let app_string_1="mongodb+srv://patricode:test@rentappdb.pt2vo.mongodb.net/RentAppDb?retryWrites=true&w=majority";
// let app_string_1="mongodb+srv://Elperzideute:@2818Elperzideute@cluster0.7tpp5.mongodb.net/cluster0?retryWrites=true&w=majority";
// let online="mongodb+srv://test:test@cluster0.xvae9.mongodb.net/Agricoach?authSource=admin&replicaSet=atlas-13k2m2-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

const url = process.env.DATABASE_URI;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(
    `${app_string}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
);

module.exports={
    mongoose
};