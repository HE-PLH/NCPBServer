const db = require("../database/database");
const {v4} = require("uuid");
var moment = require('moment');
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

let SettingsSchema = new Schema({
    Id: {
        type: String,
        unique: true,
    },
    Name: {
        type: String
    },
    items: {
        type: Array
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
        unique: true,
    },
    Name: {
        type: String
    },
    userSn: {
        type: String
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
let SettingsModel = Model("settings", SettingsSchema, "settings");
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
    const shotlistTables = ["items"];

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
        console.log(inputData)
        try {
            mdl.insertMany(inputData, function (data, result) {
                console.log(data)
                res.send({info: `${table} item created successfully`});
                console.log(`${table} item created successfully`);
            });
        } catch (e) {
            console.log(e)
        }
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


    /*var a = moment(end_date);
    var b = moment(start_date);
    let _days = a.diff(b, 'days') // 1
    console.log(_days)*/
    let _days = 0;

    const addDays = (date, days = 1) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    const dateRange = (start, end, range = []) => {
        if (start > end) return range;
        const next = addDays(start, 1);
        return dateRange(next, end, [...range, start]);
    };

    const range = dateRange(new Date(start_date), new Date(end_date));
    for (let i = 0; i < range.length; i++) {
        if (!isWeekend(new Date(range[i]))) {
            _days++
        }
    }
    console.log(_days)

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


        SettingsModel.find({}, (err, settings) => {

            let my_pairs = [];
            settings.map(({Name, items}) => {
                if (Name === "Working Hours") {
                    my_pairs = items.reduce(function (result, value, index, array) {
                        if (index % 2 === 0) {
                            let _arr = array.slice(index, index + 2);
                            let temp = [_arr[0].Name, _arr[1] ? _arr[1].Name : _arr[0].Time];
                            result.push(temp);
                        }
                        return result;
                    }, []);
                }
            })
            let result = {};

            const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})
            let table_head = {};

            let individualLogs = sortObject(groupIn(docs))
            result.groups = [];
            for (let i in individualLogs) {
                let my_days = _days;
                let t = {};
                t["p/No"] = i;

                if (individualLogs[i][0].Name && individualLogs[i][0].Name !== "ADMIN1") {
                    t["Name"] = individualLogs[i][0].Name;
                    // console.log(t["Name"])
                    t["Id"] = individualLogs[i][0].Id;
                    t["_id"] = individualLogs[i][0]._id;
                    t.items = [];
                    t["Variance"] = 0;
                    t["LIEOReport"] = 0;
                    // t["Variance"] = "";
                    let temp = sortObject(groupIn(individualLogs[i], "userSn", "Date"))

                    // temp_date[temp[0].Date] = {};
                    let len = 0;

                    for (let j in temp) {
                        if (!isWeekend(new Date(j))) {
                            // console.log(j);
                            len++;
                            if (!table_head.hasOwnProperty(j)) {
                                table_head[j] = "String";
                            }
                            let temp_date = {};
                            temp_date["Date"] = j;
                            let orderedLogs = temp[j].sort((a, b) => {
                                return new Date(a.Time) > new Date(b.Time);
                            });

                            temp_date["startTime"] = orderedLogs[0].Time;
                            temp_date["endTime"] = orderedLogs[orderedLogs.length - 1].Time;
                            if (temp_date["endTime"] === temp_date["startTime"]) {
                                temp_date["endTime"] = ""
                            }
                            t.items.push(temp_date);


                            let timePairsObj = [];
                            let time_pairs = []
                            let count = 0;

                            timePairsObj = orderedLogs.reduce(function (result, value, index, array) {
                                if (index % 2 === 0) {
                                    let _arr = array.slice(index, index + 2);
                                    let temp = [_arr[0].Time, _arr[1] ? _arr[1].Time : _arr[0].Time];
                                    result.push(temp);
                                }
                                return result;
                            }, []);
                            /*for (let k = 0; k < orderedLogs.length; k++) {
                                console.log(orderedLogs[k].Time)
                                if (count !== 1) {
                                    timePairsObj.push(time_pairs)
                                    time_pairs = [];
                                    count = 0;
                                }
                                time_pairs.push(orderedLogs[k].Time)

                                count++;
                            }*/

                            let b_t_l = my_pairs,
                                diff = 0;

                            // console.log(timePairsObj)

                            /*for (let l = 0; l < b_t_l.length; l++) {
                                let lower_limit = setDateTime(new Date(j), b_t_l[l][0]),
                                    lower_found = false,
                                    upper_limit = setDateTime(new Date(j), b_t_l[l][1]);

                                console.log(lower_limit, upper_limit)
                                let previous_time = {start:"", end: ""};
                                if (timePairsObj.length) {
                                    for (let k = 0; k < timePairsObj.length; k++) {
                                        let last_time, first_time, deficit=0;
                                        if (timePairsObj[k].length < 2) {
                                            timePairsObj[k].push(timePairsObj[k][0]);
                                            deficit=0;
                                        }else {
                                            last_time = setDateTime(new Date(j), timePairsObj[k][1]);
                                            first_time = setDateTime(new Date(j), timePairsObj[k][0]);
                                            console.log(timePairsObj[k])
                                            console.log("beyond", (new Date(first_time) >= new Date(upper_limit)), new Date(first_time) , new Date(upper_limit))
                                            if (!(new Date(first_time) >= new Date(upper_limit) && new Date(last_time) >= new Date(upper_limit))) {
                                                if (!lower_found) {
                                                    if (new Date(last_time) >= new Date(lower_limit) && new Date(last_time) <= new Date(upper_limit)) {
                                                        lower_found = true;
                                                        previous_time.start = lower_limit;
                                                        previous_time.end = last_time;
                                                        if (new Date(first_time) >= new Date(lower_limit)) {
                                                            deficit = (new Date(first_time) - new Date(lower_limit)) / 1000;
                                                        } else {
                                                            deficit = 0
                                                        }

                                                    } else {
                                                        deficit = 0
                                                    }
                                                } else {
                                                    if (new Date(first_time) <= new Date(upper_limit) && new Date(first_time) >= previous_time.end) {
                                                        deficit = (new Date(first_time) - new Date(previous_time.end)) / 1000;
                                                    } else {
                                                        if (new Date(first_time) > new Date(upper_limit)) {
                                                            if (new Date(previous_time.end) <= new Date(upper_limit)) {
                                                                deficit = (new Date(upper_limit) - new Date(previous_time.end)) / 1000;
                                                            }
                                                        }
                                                    }
                                                    /!*if (new Date(last_time) <= new Date(upper_limit)&&new Date(first_time) >= new Date(lower_limit)) {
                                                        deficit = (new Date(last_time) - new Date(first_time)) / 1000;
                                                    }
                                                    else{
                                                        deficit=0;
                                                    }*!/
                                                }

                                            }else{
                                                break;
                                            }
                                            console.log(lower_found)
                                            console.log(secondsToDhms(deficit))
                                            if (deficit > 0 && deficit < (8 * 24 * 60)) {
                                                diff += deficit;
                                            }
                                        }

                                    }
                                } else {

                                }
                            }*/
                            // t["Variance"] += ((diff));
                            t["Variance"] += computeValidHours(b_t_l, timePairsObj);

                        } else {
                            // console.log("weekend here")
                            // console.log(my_days)
                            my_days -= 1;
                            // console.log(my_days - 1)
                        }
                    }

                    // console.log(my_days)
                    // console.log(len)

                    if (my_days >= len) {
                        let _d = (my_days - len) * 8 * 60 * 60;
                        // console.log(t["Variance"])
                        t["Variance"] += _d;
                    }
                    if (t["Variance"] === 0) {
                        t["Variance"] = "Excellent Attendance"
                    } else {
                        t["Variance"] = (secondsToDhms(t["Variance"]));
                    }

                    result.groups.push(t)
                }

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


    });
    // }
};


const getLateInAndEarlyOutPeriodLogs = (req, res, mdl) => {
    let start_date = req.body.Start_date;
    let end_date = req.body.End_date;

    let date = new Date(end_date);
    let date1 = new Date(start_date);


    /*var a = moment(end_date);
    var b = moment(start_date);
    let _days = a.diff(b, 'days') // 1
    console.log(_days)*/
    let _days = 0;

    const addDays = (date, days = 1) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    const dateRange = (start, end, range = []) => {
        if (start > end) return range;
        const next = addDays(start, 1);
        return dateRange(next, end, [...range, start]);
    };

    const range = dateRange(new Date(start_date), new Date(end_date));
    for (let i = 0; i < range.length; i++) {
        if (!isWeekend(new Date(range[i]))) {
            _days++
        }
    }
    console.log(_days)

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


        SettingsModel.find({}, (err, settings) => {

            let my_pairs = [];
            settings.map(({Name, items}) => {
                if (Name === "Working Hours") {
                    my_pairs = items.reduce(function (result, value, index, array) {
                        if (index % 2 === 0) {
                            let _arr = array.slice(index, index + 2);
                            let temp = [_arr[0].Name, _arr[1] ? _arr[1].Name : _arr[0].Time];
                            result.push(temp);
                        }
                        return result;
                    }, []);
                }
            })
            let result = {};

            const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})
            let table_head = {};

            let individualLogs = sortObject(groupIn(docs))
            result.groups = [];
            for (let i in individualLogs) {
                let my_days = _days;
                let t = {};
                t["p/No"] = i;

                if (individualLogs[i][0].Name && individualLogs[i][0].Name !== "ADMIN1") {
                    t["Name"] = individualLogs[i][0].Name;
                    // console.log(t["Name"])
                    t["Id"] = individualLogs[i][0].Id;
                    t["_id"] = individualLogs[i][0]._id;
                    t.items = [];
                    t["Variance"] = 0;
                    t["LIEOReport"] = 0;
                    // t["Variance"] = "";
                    let temp = sortObject(groupIn(individualLogs[i], "userSn", "Date"))

                    // temp_date[temp[0].Date] = {};
                    let len = 0;

                    for (let j in temp) {
                        if (!isWeekend(new Date(j))) {
                            // console.log(j);
                            len++;
                            if (!table_head.hasOwnProperty(j)) {
                                table_head[j] = "String";
                            }
                            let temp_date = {};
                            temp_date["Date"] = j;
                            let orderedLogs = temp[j].sort((a, b) => {
                                return new Date(a.Time) > new Date(b.Time);
                            });

                            temp_date["startTime"] = orderedLogs[0].Time;
                            temp_date["endTime"] = orderedLogs[orderedLogs.length - 1].Time;
                            let person_extremes = [[temp_date.startTime, temp_date.endTime]];
                            if (temp_date["endTime"] === temp_date["startTime"]) {
                                person_extremes[0][1] = temp_date["startTime"];
                                temp_date["endTime"] = ""
                            }


                            t.items.push(temp_date);


                            let timePairsObj = [];
                            let time_pairs = [];
                            let count = 0;

                            timePairsObj = orderedLogs.reduce(function (result, value, index, array) {
                                if (index % 2 === 0) {
                                    let _arr = array.slice(index, index + 2);
                                    let temp = [_arr[0].Time, _arr[1] ? _arr[1].Time : _arr[0].Time];
                                    result.push(temp);
                                }
                                return result;
                            }, []);


                            let b_t_l = my_pairs,
                                diff = 0;


                            let extreme_times = [[b_t_l[0][0], b_t_l[b_t_l.length - 1][1]]];

                            t["LIEOReport"] += computeValidHours(extreme_times, person_extremes);

                            t["Variance"] += computeValidHours(b_t_l, timePairsObj);

                        } else {
                            // console.log("weekend here")
                            // console.log(my_days)
                            my_days -= 1;
                            // console.log(my_days - 1)
                        }
                    }

                    // console.log(my_days)
                    // console.log(len)

                    if (my_days >= len) {
                        let _d = (my_days - len) * 8 * 60 * 60;
                        // console.log(t["Variance"])
                        t["Variance"] += _d;
                        t["LIEOReport"] += _d;
                    }
                    if (t["LIEOReport"] <= 0) {

                    } else {
                        if (t["Variance"] === 0) {
                            t["Variance"] = "Excellent Attendance";
                            t["LIEOReport"] = "Excellent Attendance"
                        } else {
                            t["Variance"] = (secondsToDhms(t["Variance"]));
                            t["LIEOReport"] = (secondsToDhms(t["LIEOReport"]));
                        }
                        result.groups.push(t)
                    }
                }

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


    });
    // }
};

const onSchedule = (req, res, mdl) => {
    let start_date = req.body.Start_date;
    let end_date = req.body.End_date;

    let date = new Date(end_date);
    let date1 = new Date(start_date);


    /*var a = moment(end_date);
    var b = moment(start_date);
    let _days = a.diff(b, 'days') // 1
    console.log(_days)*/
    let _days = 0;

    const addDays = (date, days = 1) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    const dateRange = (start, end, range = []) => {
        if (start > end) return range;
        const next = addDays(start, 1);
        return dateRange(next, end, [...range, start]);
    };

    const range = dateRange(new Date(start_date), new Date(end_date));
    for (let i = 0; i < range.length; i++) {
        if (!isWeekend(new Date(range[i]))) {
            _days++
        }
    }
    console.log(_days)

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


        SettingsModel.find({}, (err, settings) => {

            let my_pairs = [];
            settings.map(({Name, items}) => {
                if (Name === "Working Hours") {
                    my_pairs = items.reduce(function (result, value, index, array) {
                        if (index % 2 === 0) {
                            let _arr = array.slice(index, index + 2);
                            let temp = [_arr[0].Name, _arr[1] ? _arr[1].Name : _arr[0].Time];
                            result.push(temp);
                        }
                        return result;
                    }, []);
                }
            })
            let result = {};

            const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})
            let table_head = {};

            let individualLogs = sortObject(groupIn(docs))
            result.groups = [];
            for (let i in individualLogs) {
                let my_days = _days;
                let t = {};
                t["p/No"] = i;

                if (individualLogs[i][0].Name && individualLogs[i][0].Name !== "ADMIN1") {
                    t["Name"] = individualLogs[i][0].Name;
                    // console.log(t["Name"])
                    t["Id"] = individualLogs[i][0].Id;
                    t["_id"] = individualLogs[i][0]._id;
                    t.items = [];
                    t["Variance"] = 0;
                    t["LIEOReport"] = 0;
                    // t["Variance"] = "";
                    let temp = sortObject(groupIn(individualLogs[i], "userSn", "Date"))

                    // temp_date[temp[0].Date] = {};
                    let len = 0;

                    for (let j in temp) {
                        if (!isWeekend(new Date(j))) {
                            // console.log(j);
                            len++;
                            if (!table_head.hasOwnProperty(j)) {
                                table_head[j] = "String";
                            }
                            let temp_date = {};
                            temp_date["Date"] = j;
                            let orderedLogs = temp[j].sort((a, b) => {
                                return new Date(a.Time) > new Date(b.Time);
                            });

                            temp_date["startTime"] = orderedLogs[0].Time;
                            temp_date["endTime"] = orderedLogs[orderedLogs.length - 1].Time;
                            let person_extremes = [[temp_date.startTime, temp_date.endTime]];
                            if (temp_date["endTime"] === temp_date["startTime"]) {
                                person_extremes[0][1] = temp_date["startTime"];
                                temp_date["endTime"] = ""
                            }


                            t.items.push(temp_date);


                            let timePairsObj = [];
                            let time_pairs = [];
                            let count = 0;

                            timePairsObj = orderedLogs.reduce(function (result, value, index, array) {
                                if (index % 2 === 0) {
                                    let _arr = array.slice(index, index + 2);
                                    let temp = [_arr[0].Time, _arr[1] ? _arr[1].Time : _arr[0].Time];
                                    result.push(temp);
                                }
                                return result;
                            }, []);


                            let b_t_l = my_pairs,
                                diff = 0;


                            let extreme_times = [[b_t_l[0][0], b_t_l[b_t_l.length - 1][1]]];

                            t["LIEOReport"] += computeValidHours(extreme_times, person_extremes);

                            t["Variance"] += computeValidHours(b_t_l, timePairsObj);

                        } else {
                            // console.log("weekend here")
                            // console.log(my_days)
                            my_days -= 1;
                            // console.log(my_days - 1)
                        }
                    }

                    // console.log(my_days)
                    // console.log(len)

                    if (my_days >= len) {
                        let _d = (my_days - len) * 8 * 60 * 60;
                        // console.log(t["Variance"])
                        t["Variance"] += _d;
                        t["LIEOReport"] += _d;
                    }
                    if (t["LIEOReport"] > 0) {

                    } else {
                        if (t["Variance"] === 0) {
                            t["Variance"] = "Excellent Attendance";
                            t["LIEOReport"] = "Excellent Attendance"
                        } else {
                            t["Variance"] = (secondsToDhms(t["Variance"]));
                            t["LIEOReport"] = (secondsToDhms(t["LIEOReport"]));
                        }
                        result.groups.push(t)
                    }
                }

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


    });
    // }
};

const getIndividualPeriodLogs = (req, res, mdl) => {
    let start_date = req.body.Start_date;
    let end_date = req.body.End_date;
    let id = req.body.Id;

    let date = new Date(end_date);
    let date1 = new Date(start_date);


    /*var a = moment(end_date);
    var b = moment(start_date);
    let _days = a.diff(b, 'days') // 1
    console.log(_days)*/
    let _days = 0;

    const addDays = (date, days = 1) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    const dateRange = (start, end, range = []) => {
        if (start > end) return range;
        const next = addDays(start, 1);
        return dateRange(next, end, [...range, start]);
    };

    const range = dateRange(new Date(start_date), new Date(end_date));
    for (let i = 0; i < range.length; i++) {
        if (!isWeekend(new Date(range[i]))) {
            _days++
        }
    }
    console.log(_days)

    console.log(id)


    LogsModel.find({_id: id}, (err, docs) => {
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

        console.log(docs)
        LogsModel.find({deviceUserId: docs[0].deviceUserId}, (err, docs) => {
            console.log(docs)
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


            SettingsModel.find({}, (err, settings) => {

                let my_pairs = [];
                settings.map(({Name, items}) => {
                    if (Name === "Working Hours") {
                        my_pairs = items.reduce(function (result, value, index, array) {
                            if (index % 2 === 0) {
                                let _arr = array.slice(index, index + 2);
                                let temp = [_arr[0].Name, _arr[1] ? _arr[1].Name : _arr[0].Time];
                                result.push(temp);
                            }
                            return result;
                        }, []);
                    }
                })
                let result = {};

                const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})
                let table_head = {};

                let individualLogs = sortObject(groupIn(docs))
                result.groups = [];
                for (let i in individualLogs) {
                    let my_days = _days;
                    let t = {};
                    t["p/No"] = i;

                    if (individualLogs[i][0].Name && individualLogs[i][0].Name !== "ADMIN1") {
                        t["Name"] = individualLogs[i][0].Name;
                        // console.log(t["Name"])
                        t["Id"] = individualLogs[i][0].Id;
                        t["_id"] = individualLogs[i][0]._id;
                        t.items = [];
                        t.timeObj = [];
                        t["Variance"] = 0;
                        // t["Variance"] = "";
                        let temp = sortObject(groupIn(individualLogs[i], "userSn", "Date"))

                        // temp_date[temp[0].Date] = {};
                        let len = 0;

                        for (let j in temp) {
                            if (!isWeekend(new Date(j))) {
                                // console.log(j);
                                len++;
                                if (!table_head.hasOwnProperty(j)) {
                                    table_head[j] = "String";
                                }
                                let temp_date = {};
                                temp_date["Date"] = j;
                                let orderedLogs = temp[j].sort((a, b) => {
                                    return new Date(a.Time) > new Date(b.Time);
                                });

                                temp_date["startTime"] = orderedLogs[0].Time;
                                temp_date["endTime"] = orderedLogs[orderedLogs.length - 1].Time;
                                let person_extremes = [[temp_date.startTime, temp_date.endTime]];
                                if (temp_date["endTime"] === temp_date["startTime"]) {
                                    person_extremes[0][1] = temp_date["startTime"];
                                    temp_date["endTime"] = ""
                                }


                                t.items.push(temp_date);


                                let timePairsObj = [];
                                let time_pairs = [];
                                let count = 0;

                                timePairsObj = orderedLogs.reduce(function (result, value, index, array) {
                                    if (index % 2 === 0) {
                                        let _arr = array.slice(index, index + 2);
                                        let temp = [_arr[0].Time, _arr[1] ? _arr[1].Time : _arr[0].Time];
                                        result.push(temp);
                                    }
                                    return result;
                                }, []);


                                t.timeObj.push(timePairsObj);
                                let b_t_l = my_pairs,
                                    diff = 0;

                                let extreme_times = [[b_t_l[0][0], b_t_l[b_t_l.length - 1][1]]];

                                t["LIEOReport"] += computeValidHours(extreme_times, person_extremes);

                                t["Variance"] += computeValidHours(b_t_l, timePairsObj);

                            } else {
                                // console.log("weekend here")
                                // console.log(my_days)
                                my_days -= 1;
                                // console.log(my_days - 1)
                            }
                        }

                        // console.log(my_days)
                        // console.log(len)

                        if (my_days >= len) {
                            let _d = (my_days - len) * 8 * 60 * 60;
                            // console.log(t["Variance"])
                            t["Variance"] += _d;
                            t["LIEOReport"] += _d;
                        }

                        if (t["LIEOReport"] === 0) {

                        } else {
                            if (t["Variance"] === 0) {
                                t["Variance"] = "Excellent Attendance";
                                t["LIEOReport"] = "Excellent Attendance"
                            } else {
                                t["Variance"] = (secondsToDhms(t["Variance"]));
                                t["LIEOReport"] = (secondsToDhms(t["LIEOReport"]));
                            }
                            result.groups.push(t)
                        }
                    }

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


        });
    })
    // }
};


const getTodayLogs = (req, res, mdl) => {
    let date1 = new Date(new Date().setDate(new Date().getDate() - 1));

    let date = new Date();

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

const computeValidHours = (fixed_pairs, pairs) => {
    fixed_pairs = fixed_pairs.map(([start, end]) => [setDateTime(new Date(), start).getTime(), setDateTime(new Date(), end).getTime()]);
    let total = fixed_pairs.map(([start, end]) => end - start).reduce((diff1, diff2) => diff1 + diff2, 0);
    pairs = pairs.filter((item) => !!item.length);
    pairs = pairs.map(([start, end]) => [setDateTime(new Date(), start).getTime(), setDateTime(new Date(), end).getTime()]);

    let millis = 0;
    for ([s, e] of pairs) {
        for ([fs, fe] of fixed_pairs) {
            let os = Math.max(s, fs), oe = Math.min(e, fe);
            millis += Math.max(0, oe - os);
        }
    }
    return (total - millis) / 1000;
};

function setDateTime(date, time) {
    // console.log(time)
    let sect = time.split(":");
    let hours = sect[0];
    let minutes = sect[1];
    let mer = sect[2].split(" ");
    let seconds = mer[0];
    if (mer[1] === "PM" && hours !== "12") {
        hours = parseInt(hours) + 12;
    }

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    return date;
}

function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}


function getMonday(date) {
    var d = new Date(date);
    d.setDate(d.getDate() + (((1 + 7 - d.getDay()) % 7) || 7));
}

function closest_tuesday_or_friday() {
    var today = new Date(), tuesday, friday, day, closest;

    if (today.getDay() == 2 || today.getDay() == 5) {
        if (today.getHours() < 22) {
            return today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
        }
    } else {
        day = today.getDay();
        tuesday = today.getDate() - day + (day === 0 ? -6 : 2);
        friday = today.getDate() - day + (day === 0 ? -6 : 5);
    }

    if (tuesday < friday) {
        closest = new Date(today.setDate(tuesday));
    } else {
        closest = new Date(today.setDate(friday));
    }
    return closest.getFullYear() + "/" + (closest.getMonth() + 1) + "/" + closest.getDate();
}

function isWeekend(myDate) {
    return !(myDate.getDay() % 6);
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
    getPeriodLogs,
    getLateInAndEarlyOutPeriodLogs,
    SettingsModel,
    getIndividualPeriodLogs,
    onSchedule
};