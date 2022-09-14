/*
const db = require("../database/database");
const {v4} = require("uuid");
// const { default: axios } = require("axios");
const Schema = db.mongoose.Schema;
const Model = db.mongoose.model;

let AllUsersSchema = new Schema({
    Id: {
        type: String,
        unique: true,
    },
    FirstName: {
        type: String
    },
    LastName: {
        type: String
    },
    PhoneNumber: {
        type: String
    },
    Occupation: {
        type: String
    },
    "Postal Address": {
        type: String
    },
    County: {
        type: String
    },
    "Next of kin Name": {
        type: String
    },
    "Next of kin Phone Number": {
        type: String
    },
    "Next of kin Nature Of RelationShip": {
        type: String
    },
    Email: {
        type: String
    },
    Password: {
        type: String
    },
    Role: {
        type: String
    },
    ApartmentId: {
        type: String
    },
    HouseId: {
        type: String
    },
    IsVerified: {
        type: String
    },
    Status: {
        type: String
    },
    Image: {
        type: String
    },
    ThumbUrl: {
        type: String
    }
}, {versionKey: false});

let RolesSchema = new Schema({
    Id: {
        type: String,
        unique: true,
    },
    Name: {
        type: String
    }
}, {versionKey: false});

let ApartmentSchema = new Schema({
    Id: {
        type: String,
        unique: true,
    },
    Name: {
        type: String
    },
    Location: {
        type: String
    },
    Status: {
        type: String
    },
    Image: {
        type: String
    },
    ThumbUrl: {
        type: String
    },
    Amenities: {
        type: Map,
        of: String
    }
}, {versionKey: false});

let BillsSchema = new Schema({
    Id: {
        type: String,
        unique: true,
    },
    Name: {
        type: String
    },
    Amount: {
        type: String
    },
    Date: {
        type: String
    },
    Time: {
        type: String
    },
    ApartmentId: {
        type: String
    },
    HouseId: {
        type: String
    },
    IsVerified: {
        type: String
    },
    Status: {
        type: String
    },
    Image: {
        type: String
    },
    ThumbUrl: {
        type: String
    },
    __v: {
        type: Number,
        select: false
    }
}, {versionKey: false});

let HouseSchema = new Schema({
    Id: {
        type: String,
        unique: true,
    },
    Type: {
        type: String
    },
    ApartmentId: {
        type: String
    },
    Status: {
        type: String
    },
    Image: {
        type: String
    },
    ThumbUrl: {
        type: String
    },
    Description: {
        type: String
    },
    Price: {
        type: String
    },
    PriceSale: {
        type: String
    },
    Features: {
        type: Map,
        of: String
    }
}, {versionKey: false});



let ConditionSchema = new Schema({
    Id: {
        type: String,
        unique: true,
    },

    UserId: {
        type: String,
    },
    "Condition of the Key and its Holder": {
        type: String
    },
    "Condition of the Electricity Remote": {
        type: String
    },
    "Number of bulb": {
        type: String
    },
    "Condition of the Bulbs": {
        type: String
    },
    "Condition of the paint on the wall": {
        type: String
    },
    "Condition of the Windows": {
        type: String
    },
    "Condition of the Toilet Sink": {
        type: String
    },
    "Condition of the Normal Sink": {
        type: String
    },
    "Condition of the Door Lock": {
        type: String
    },
    "Condition of the Toilet Door Lock": {
        type: String
    },
    "HouseId": {
        type: String
    },
    "ApartmentId": {
        type: String
    },
    Date: {
        type: String
    },
}, {versionKey: false});


let TenantOutSchema = new Schema({
    Id: {
        type: String,
        unique: true,
    },
    UserId: {
        type: String,
    },
    "Condition of the Key and its Holder": {
        type: String
    },
    "Condition of the Electricity Remote": {
        type: String
    },
    "Number of bulb": {
        type: String
    },
    "Condition of the Bulbs": {
        type: String
    },
    "Condition of the paint on the wall": {
        type: String
    },
    "Condition of the Windows": {
        type: String
    },
    "Condition of the Toilet Sink": {
        type: String
    },
    "Condition of the Normal Sink": {
        type: String
    },
    "Condition of the Door Lock": {
        type: String
    },
    "Condition of the Toilet Door Lock": {
        type: String
    },
    "HouseId": {
        type: String
    },
    "ApartmentId": {
        type: String
    },
    Date: {
        type: String
    },
}, {versionKey: false});

let StatusSchema = new Schema({
    Id: {
        type: String,
        unique: true,
    },
    Name: {
        type: String
    },
    Type: {
        type: String
    },

}, {versionKey: false});

let ConditionStateSchema = new Schema({
    Id: {
        type: String,
        unique: true,
    },
    Name: {
        type: String
    },
}, {versionKey: false});


let AllUsersModel = Model("_user", AllUsersSchema, "_user");
let RolesModel = Model("role", RolesSchema, "role");
let ApartmentModel = Model("apartment", ApartmentSchema, "apartment");
let HouseModel = Model("house", HouseSchema, "house");
let BillsModel = Model("bill", BillsSchema, "bill");
let StatusModel = Model("status", StatusSchema, "status");
let ConditionModel = Model("condition", ConditionSchema, "condition");
let TenantOutModel = Model("TenantOut", TenantOutSchema, "TenantOut");
let ConditionStateModel = Model("conditionState", ConditionStateSchema, "conditionState");


function getSchemaObject(inputData) {
    let obj = {};
    for (let i in inputData[0]) {
        if (inputData[0].hasOwnProperty(i)) {
            obj[i] = {
                type: String,
                select: false
            }
        }
    }
    obj["__v"] = {
        type: Number,
        select: false
    };
    return obj;
}

function TableMaster(table, mdl) {

    this.add = function (req, res) {
        const inputData = req.body;
        // let obj = getSchemaObject(inputData);

        mdl.insertMany(inputData, function (data) {
            res.send({info: `${table} item created successfully`});
            console.log(`${table} item created successfully`);
        });
    };


    this.delete = function (req, res) {
        const inputData = req.body;
        // let obj = getSchemaObject(inputData);
        inputData.forEach((obj) => {
            mdl.findByIdAndDelete(obj._id, function (err) {
                if (err) console.log(err);
                console.log(`${table} item deleted successfully`);
                res.send({info: `${table} item deleted successfully`});
            });
        });
    };

    this.deleteAll = function (req, res) {
        const inputData = req.body;
        // let obj = getSchemaObject(inputData);
        mdl.deleteMany({}, function (err) {
            if (err) console.log(err);
            console.log(`All ${table} item deleted successfully`);
            res.send({info: `All ${table} item deleted successfully`});
        });
    };

    this.update = function (req, res) {
        const inputData = req.body;
        if (Array.isArray(inputData)) {
            for (let i = 0; i < inputData.length; i++) {
                const query = {"_id": inputData[i]["_id"]};
                mdl.findOneAndUpdate(query, inputData[i], {upsert: true}, function (err, docs) {
                    if (err) {
                        res.send({
                            message: "Error Occured",
                            info: docs,
                        });
                        return 0;
                    }

                    if (docs === null || docs.length === 0) {
                        res.send({
                            message: `No ${table} available`,
                            info: docs,
                        });
                        return 0;
                    }
                });
            }
            res.send({
                info: `${table} item updated successfully`
            });
        } else {
            const query = {"_id": inputData["_id"]};
            mdl.findOneAndUpdate(query, inputData, {upsert: true}, function (err, docs) {
                if (err) {
                    res.send({
                        message: "Error Occured",
                        info: docs,
                    });
                    return 0;
                }

                if (docs === null || docs.length === 0) {
                    res.send({
                        message: `No ${table} available`,
                        info: docs,
                    });
                    return 0;
                }

                res.send({
                    info: `${table} item updated successfully`
                });
            });
        }


    };

    this.retrieve = function (req, res) {
        // const inputData = req.body;
        // let obj = getSchemaObject(inputData);

        mdl.find(req.query, (err, docs) => {
            if (err) {
                console.log(err);
                res.send({
                    message: "Error Occured",
                    info: docs,
                });
                return 0;
            }

            if (docs === null || docs.length === 0) {
                res.send({
                    message: `No ${table} available`,
                    info: docs,
                });
                return 0;
            }

            res.send(
                {
                    info: docs
                }
            );
        })
    };
    return this
}


function UserTable(table, mdl) {

    this.add = function (req, res) {
        const inputData = req.body;
        let users = inputData.map((user) => {
            let temp = user;
            temp["Id"] = v4();
            return temp;
        });
        // let obj = getSchemaObject(inputData);
        console.log(inputData)
        mdl.insertMany(users, function (data) {
            console.log(data)
            res.send({info: `${table} item created successfully`});
            console.log(`${table} item created successfully`);
        });
    };

    this.delete = function (req, res) {
        const inputData = req.body;
        // let obj = getSchemaObject(inputData);
        inputData.forEach((obj) => {
            mdl.findByIdAndDelete(obj._id, function (err) {
                if (err) console.log(err);
                console.log(`${table} item deleted successfully`);
                res.send({info: `${table} item deleted successfully`});
            });
        });
    };


    this.update = function (req, res) {
        const inputData = req.body;
        if (Array.isArray(inputData)) {
            for (let i = 0; i < inputData.length; i++) {
                const query = {"_id": inputData[i]["_id"]};
                mdl.findOneAndUpdate(query, inputData[i], {upsert: true}, function (err, docs) {
                    if (err) {
                        res.send({
                            message: "Error Occured",
                            info: docs,
                        });
                        return 0;
                    }

                    if (docs === null || docs.length === 0) {
                        res.send({
                            message: `No ${table} available`,
                            info: docs,
                        });
                        return 0;
                    }
                });
            }
            res.send({
                info: `${table} item updated successfully`
            });
        } else {
            const query = {"_id": inputData["_id"]};
            mdl.findOneAndUpdate(query, inputData, {upsert: true}, function (err, docs) {
                if (err) {
                    res.send({
                        message: "Error Occured",
                        info: docs,
                    });
                    return 0;
                }

                if (docs === null || docs.length === 0) {
                    res.send({
                        message: `No ${table} available`,
                        info: docs,
                    });
                    return 0;
                }

                res.send({
                    info: `${table} item updated successfully`
                });
            });
        }


    };

    this.retrieve = function (req, res) {
        // const inputData = req.body;
        // let obj = getSchemaObject(inputData);

        mdl.find(req.query, (err, docs) => {
            if (err) {
                console.log(err);
                res.send({
                    message: "Error Occured",
                    info: docs,
                });
                return 0;
            }

            if (docs === null || docs.length === 0) {
                res.send({
                    message: `No ${table} available`,
                    info: docs,
                });
                return 0;
            }

            res.send(
                {
                    info: docs
                }
            );
        })
    };
    return this
}

const findUser = async (req, res) => {
    // res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
    AllUsersModel.find(req.query, (err, docs) => {
        if (err) {
            res.send({
                message: "Error Occured",
                info: docs,
            });
            return 0;
        }

        if (docs === null || docs.length === 0) {
            res.send({
                message: "No User available",
                info: docs,
            });
            return 0;
        }

        /!*for (let i in docs[0]) {
            if (docs[0].hasOwnProperty(i)){
                console.log(docs[0][i]==="token");
                console.log(docs[0],docs[0][i])
            }
        }*!/
        res.send(
            {
                info: docs[0]
            }
        );
    })
};

module.exports = {
    TableMaster,
    findUser,
    AllUsersModel,
    RolesModel,
    ApartmentModel,
    HouseModel,
    UserTable,
    BillsModel,
    StatusModel,
    ConditionModel,
    ConditionStateModel,
    TenantOutModel
};*/
