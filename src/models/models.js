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

let StatusSchema = new Schema({
    Id: {
        type: String,
        unique: true,
    },
    Name: {
        type: String
    }
}, {versionKey: false});

let ItemsSchema = new Schema({
    Id: {
        type: String,
        unique: true,
    },
    Name: {
        type: String
    }
}, {versionKey: false});

let LogSchema = new Schema({
    Id: {
        type: String,
    },
    Name: {
        type: String
    },
    userSn: {
        type: String,
        unique: true,
    },
    deviceUserId: {
        type: String
    },
    Date: {
        type: String
    },
    Time: {
        type: String
    }
}, {versionKey: false});

let AllUsersModel = Model("_user", AllUsersSchema, "_user");
let RolesModel = Model("role", RolesSchema, "role");
let StatusModel = Model("status", StatusSchema, "status");
let ItemsModel = Model("items", ItemsSchema, "items");
let LogsModel = Model("logs", LogSchema, "logs");

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

function addAutoIdIfShotlisted(inputData, table, mdl, res) {
    const shotlistTables = ["Logs", "game-types", "odd-types", "items"];

    const f = function (array, item) {
        if (array.length > 0) {
            return array.find(i => i === item) === item;
        }
    };
    if (f(shotlistTables, table)) {
        mdl.find({}, (err, docs) => {
            if (err) {
                console.log(err);
                return 0;
            }
            let last = 0;
            if (docs === null || docs.length === 0) {
                console.log({
                    message: `No ${table} available`,
                    info: docs,
                });
                last = 1000;
            } else {
                let sorted = (docs.sort((a, b) => a.Id - b.Id))[docs.length - 1];

                last = parseInt(sorted.Id || 1000) + 1;

            }
            if (Array.isArray(inputData)) {
                for (let i = 0; i < inputData.length; i++) {
                    inputData[i].Id = last;
                    last++;
                }
            } else {
                inputData.Id = last;
            }
            mdl.insertMany(inputData, function (data) {
                res.send({info: `${table} item(${last}) created successfully`});
                console.log(`${table} item created successfully`);
            });
        })
    } else {
        mdl.insertMany(inputData, function (data) {
            res.send({info: `${table} item created successfully`});
            console.log(`${table} item created successfully`);
        });
    }
}

function TableMaster(table, mdl) {

    this.add = function (req, res) {
        const inputData = req.body;
        // let obj = getSchemaObject(inputData);
        addAutoIdIfShotlisted(inputData, table, mdl, res);

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


        res.send(
            {
                info: docs[0]
            }
        );
    })
};

const getPeriodLogs = (req, res, mdl) => {
    let start_date = req.body.Start_date;
    let end_date = req.body.End_date;

    let date = new Date(end_date);
    let date1 = new Date(start_date);

    LogsModel.find({}, (err, docs) => {
        if (err) {
            res.send({
                message: "Error Occured",
                info: docs,
            });
            // return 0;
        }

        if (docs === null || docs.length === 0) {
            res.send({
                message: "No Biometric Logs available",
                info: docs,
            });
            // return 0;
        }

        docs = docs.filter((item) => {
            let flag = false;
            if (date1 <= new Date(item.Date) && date >= new Date(item.Date)) {
                flag = true;
            } /*else if (date === new Date(item.end_date)) {
                        if (time < parseInt(item.End_time.replace(":", "")) && time > parseInt(item.Start_time.replace(":", ""))) {
                            flag = true
                        }
                    }*/
            return flag;
        });


        let result = {};

        const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})
        let table_head={};

        let individualLogs = groupIn(docs)
        result.groups = [];
        for (let i in individualLogs) {
            let t = {};
            t["p/No"] = i;
            t["Name"] = individualLogs[i][0].Name;
            t["Id"] = individualLogs[i][0].Id;
            t["_id"] = individualLogs[i][0]._id;
            t.items=[];
            let temp = groupIn(individualLogs[i], "userSn", "Date")

            // temp_date[temp[0].Date] = {};
            for (let j in temp) {
                if (!table_head.hasOwnProperty(j)) {
                    table_head[j] = "String";
                }
                let temp_date = {};
                temp_date["Date"] = j;
                let orderedLogs = temp[j].sort((a, b) => {
                    return a.Time > b.Time;
                })
                temp_date["startTime"] = orderedLogs[0].Time;
                temp_date["endTime"] = orderedLogs[orderedLogs.length - 1].Time;
                t.items.push(temp_date);
            }
            result.groups.push(t)

        }
        result.table_head = table_head;
        result.LogsLength = docs.length;
        result.Logs = [...docs];
        let len = docs.length;
        let counter = 0;
        res.send(
            {
                info: result
            }
        );


    });
    // }
};

const getTodayLogs = (req, res, mdl) => {
    let date1 = new Date(new Date().setDate(new Date().getDate() - 1));

    let date = new Date();

    console.log(date, date1)

    LogsModel.find({}, (err, docs) => {
        if (err) {
            res.send({
                message: "Error Occured",
                info: docs,
            });
            // return 0;
        }

        if (docs === null || docs.length === 0) {
            res.send({
                message: "No Logs available",
                info: docs,
            });
            // return 0;
        }

        docs = docs.filter((item) => {
            let flag = false;
            if (date1 <= new Date(item.Date) && date >= new Date(item.Date)) {
                flag = true;
            } /*else if (date === new Date(item.end_date)) {
                        if (time < parseInt(item.End_time.replace(":", "")) && time > parseInt(item.Start_time.replace(":", ""))) {
                            flag = true
                        }
                    }*/
            return flag;
        });


        let result = {};

        result.LogsLength = docs.length;
        const Logs = docs;
        let len = docs.length;
        let counter = 0;

        GameModel.find({}, (err, docs) => {
            if (err) {
                res.send({
                    message: "Error Occured",
                    info: docs,
                });
                // return 0;
            }

            if (docs === null || docs.length === 0) {
                res.send({
                    message: "No Gametypes available",
                    info: docs,
                });
                // return 0;
            }

            result.Logs = [];
            for (let i = 0; i < Logs.length; i++) {
                for (let j = 0; j < docs.length; j++) {
                    if (docs[j].Id === Logs[i].GameType) {
                        let temp = {};
                        for (let x in Logs[i]) {
                            if (Logs[i].hasOwnProperty(x)) {
                                temp[x] = Logs[i][x];
                            }
                        }


                        temp["GameTypeObj"] = docs[j];
                        let tmp = {};
                        tmp = temp._doc;
                        tmp["GameTypeObj"] = temp.GameTypeObj;
                        result.Logs.push(tmp);
                        break;
                    }
                }
            }

            res.send(
                {
                    info: result
                }
            );


        });


    });
    // }
};

/*const getFilteredLogs = (req, res, mdl) => {
    let q = req.query;

    let my_query = {};
    if (q["q"].indexOf("||")>-1){
        my_query = {};
        my_query["$or"] = [];

        let v = q["q"].split("||");
        for (let i = 0; i < v.length; i++) {
            let tmp = {};
            tmp[`${"Prediction"}`] = `${v[i]}`;
            my_query["$or"].push(tmp);
        }
    }else
    if (q["q"].indexOf("OR")>-1){
        my_query = {};
        my_query["$or"] = [];

        let v = q["q"].split(" OR ");
        for (let i = 0; i < v.length; i++) {
            let tmp = {};
            tmp[`${"Prediction"}`] = new RegExp(`^${v[i]}.?`, "gi");
            my_query["$or"].push(tmp);
        }
    }else if (q["q"].indexOf("-")>-1){
        my_query = {};
        my_query[`${"Prediction"}`] = new RegExp(`.?\-.?`, "gi");
    }else if (q["q"].indexOf("time")>-1){
        my_query = { $or: [{"Status": "Won"}, {"Status": "Lost"}, {"Status": new RegExp(`^HT.?`, "gi")}] };
    }else
    {
        my_query = {"Prediction": q["q"].toString()};
    }

    console.log(my_query)

    LogsModel.find(my_query, (err, docs) => {
        if (err) {
            res.send({
                message: "Error Occured",
                info: docs,
            });
            return 0;
        }

        if (docs === null || docs.length === 0) {
            res.send({
                message: "No Logs available",
                info: docs,
            });
            return 0;
        }

        let result = {};

        result.LogsLength = docs.length;
        const Logs = docs;
        let len = docs.length;
        let counter = 0;

        GameModel.find({}, (err, docs) => {
            if (err) {
                res.send({
                    message: "Error Occured",
                    info: docs,
                });
                // return 0;
            }

            if (docs === null || docs.length === 0) {
                res.send({
                    message: "No Gametypes available",
                    info: docs,
                });
                // return 0;
            }

            result.Logs = [];
            for (let i = 0; i < Logs.length; i++) {
                for (let j = 0; j < docs.length; j++) {
                    if (docs[j].Id === Logs[i].GameType) {
                        let temp = {};
                        for(let x in Logs[i]){
                            if (Logs[i].hasOwnProperty(x)) {
                                temp[x] = Logs[i][x];
                            }
                        }


                        temp["GameTypeObj"] = docs[j];
                        let tmp = {};
                        tmp = temp._doc;
                        tmp["GameTypeObj"] = temp.GameTypeObj;
                        result.Logs.push(tmp);
                        break;
                    }
                }
            }

            res.send(
                {
                    info: result
                }
            );


        });


    });
    // }
};*/


function groupIn(array, given = "userSn", group = "deviceUserId", q = 1) {
    let obj_list = {};
    let temp = {};
    for (let i = 0; i < array.length; i++) {
        if (!obj_list.hasOwnProperty(array[i][group])) {
            obj_list[array[i][group]] = [];
        }

        if ((temp = array[i])) {
            obj_list[array[i][group]].push(temp);
        }
    }
    return obj_list;
}


module.exports = {
    TableMaster,
    findUser,
    AllUsersModel,
    RolesModel,
    UserTable,
    StatusModel,
    ItemsModel,
    LogsModel,
    getPeriodLogs
};