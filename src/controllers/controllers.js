const ZKLib = require('../../zklib');

const {
    TableMaster,
    findUser,
    AllUsersModel,
    UserTable,
    RolesModel,
    StatusModel,
    LogsModel,
    getPeriodLogs,
    SettingsModel,
    getIndividualPeriodLogs,
    getLateInAndEarlyOutPeriodLogs,
    onSchedule
} = require("../models/models");

const test = async (IP_OBJ, req, res) => {
    try {
        let IP = '';
        IP_OBJ.map(({Name, items}) => {
            if (Name === "Device IP") {
                IP = items[0].Name
            }
        })

        let zkInstance = new ZKLib(IP, 4370, 10000, 4000);

        await zkInstance.createSocket();
        await zkInstance.getInfo()


        const users = await zkInstance.getUsers();


        const attendances = await zkInstance.getAttendances(IP, (percent, total) => {
            // this callbacks take params is the percent of data downloaded and total data need to download
        });

        // console.log('check attendances',attendances )

        // let temp_attendance = attendances;

        return ({
            info: attendances.data,
            users
        })
    }catch (e){
        console.log(e)
        return ({
            info: [],
            users:[]
        })
    }
    // console.log('check users', users)
    // await zkInstance.disconnect()
    // zkInstance.getRealTimeLogs((data)=>{
    //     // do something when some checkin
    //     console.log(data)
    // })

};




const FetchController = (app) => {

    setInterval(function (e){
        console.log("syncing")
        SettingsModel.find({}, (err, settings) => {
            let IP;
            return settings;
        }).then((IP_OBJ) => {
            let req = {body: {}}, res =  {
                send: function (e){
                    console.log("synced successfully");
                }
            };
            try {
                test(IP_OBJ, req, res).then((logsObject) => {
                    if (logsObject.info.length) {
                        let temp_users = {}
                        for (let i = 0; i < logsObject.users.data.length; i++) {
                            temp_users[logsObject.users.data[i].userId] = logsObject.users.data[i].name
                        }
                        for (let i = 0; i < logsObject.info.length; i++) {
                            delete logsObject.info[i].ip;
                            let temp = new Date(logsObject.info[i].recordTime), t = temp.toLocaleTimeString(),
                                d = temp.toLocaleDateString();
                            logsObject.info[i].Id = logsObject.info[i].deviceUserId + d + t
                            logsObject.info[i].Name = temp_users[logsObject.info[i].deviceUserId]
                            logsObject.info[i].Date = d;
                            logsObject.info[i].Time = t;
                            delete logsObject.info[i].recordTime;
                        }
                        req.body = logsObject.info;
                        LogsModel.find({}, (err, docs) => {
                            let to_add = []
                            let temp = {}
                            for (let i = 0; i < docs.length; i++) {
                                temp[docs[i].Id] = true;
                            }
                            for (let i = 0; i < req.body.length; i++) {
                                if (!temp[req.body[i].Id]) {
                                    to_add.push(req.body[i])
                                }
                            }
                            req.body = to_add
                            console.log(LogsModel)
                            new TableMaster("logs", LogsModel).add(req, res);
                        })


                    }
                })
            }catch (e) {
                console.log(e)
            }
        })
    }, 2*1000*60*60)

    app.get("/api/logs", (req, res) => {
        SettingsModel.find({}, (err, settings) => {
            let IP;
            return settings;
        }).then((IP_OBJ) => {
            try {
                test(IP_OBJ, req, res).then((logsObject) => {
                    if (logsObject.info.length) {
                        let temp_users = {}
                        for (let i = 0; i < logsObject.users.data.length; i++) {
                            temp_users[logsObject.users.data[i].userId] = logsObject.users.data[i].name
                        }
                        for (let i = 0; i < logsObject.info.length; i++) {
                            delete logsObject.info[i].ip;
                            let temp = new Date(logsObject.info[i].recordTime), t = temp.toLocaleTimeString(),
                                d = temp.toLocaleDateString();
                            logsObject.info[i].Id = logsObject.info[i].deviceUserId + d + t
                            logsObject.info[i].Name = temp_users[logsObject.info[i].deviceUserId]
                            logsObject.info[i].Date = d;
                            logsObject.info[i].Time = t;
                            delete logsObject.info[i].recordTime;
                        }
                        req.body = logsObject.info;
                        LogsModel.find({}, (err, docs) => {
                            let to_add = []
                            let temp = {}
                            for (let i = 0; i < docs.length; i++) {
                                temp[docs[i].Id] = true;
                            }
                            for (let i = 0; i < req.body.length; i++) {
                                if (!temp[req.body[i].Id]) {
                                    to_add.push(req.body[i])
                                }
                            }
                            req.body = to_add
                            new TableMaster("logs", LogsModel).add(req, res);
                        })


                    }
                })
            }catch (e) {
                res.send({
                    info: e
                })
            }
        })


    });
    app.post("/api/users/verify", (req, res) => {
        findUser(req, res);
    });

    app.get("/api/all-users", (req, res) => {
        new UserTable("_user", AllUsersModel).retrieve(req, res);
    });

    app.post("/api/all-users/", (req, res) => {
        new UserTable("_user", AllUsersModel).add(req, res);
    });

    app.post("/api/all-users/delete", (req, res) => {
        new UserTable("_user", AllUsersModel).delete(req, res);
    });

    app.post("/api/all-users/update", (req, res) => {
        new UserTable("_user", AllUsersModel).update(req, res);
    });


    app.get("/api/role", (req, res) => {
        new TableMaster("role", RolesModel).retrieve(req, res);
    });

    app.post("/api/role/", (req, res) => {
        new TableMaster("role", RolesModel).add(req, res);
    });

    app.post("/api/role/delete", (req, res) => {
        new TableMaster("role", RolesModel).delete(req, res);
    });

    app.post("/api/role/update", (req, res) => {
        new TableMaster("role", RolesModel).update(req, res);
    });


    app.get("/api/biometriclogs", (req, res) => {
        new TableMaster("biometriclogs", LogsModel).retrieve(req, res);
    });

    app.post("/api/biometriclogs/", (req, res) => {
        new TableMaster("biometriclogs", LogsModel).add(req, res);
    });

    app.post("/api/biometriclogs/delete", (req, res) => {
        new TableMaster("biometriclogs", LogsModel).delete(req, res);
    });

    app.post("/api/biometriclogs/update", (req, res) => {
        new TableMaster("biometriclogs", LogsModel).update(req, res);
    });

    app.post("/api/biometriclogs/deleteAll", (req, res) => {
        new TableMaster("biometriclogs", LogsModel).deleteAll(req, res);
    });


    app.get("/api/settings", (req, res) => {
        new TableMaster("settings", SettingsModel).retrieve(req, res);
    });

    app.post("/api/settings/", (req, res) => {
        new TableMaster("settings", SettingsModel).add(req, res);
    });

    app.post("/api/settings/delete", (req, res) => {
        new TableMaster("settings", SettingsModel).delete(req, res);
    });

    app.post("/api/settings/update", (req, res) => {
        new TableMaster("settings", SettingsModel).update(req, res);
    });

    app.post("/api/settings/deleteAll", (req, res) => {
        new TableMaster("settings", SettingsModel).deleteAll(req, res);
    });


    app.get("/api/status", (req, res) => {
        new TableMaster("status", StatusModel).retrieve(req, res);
    });

    app.post("/api/status/", (req, res) => {
        new TableMaster("status", StatusModel).add(req, res);
    });

    app.post("/api/status/delete", (req, res) => {
        new TableMaster("status", StatusModel).delete(req, res);
    });

    app.post("/api/status/update", (req, res) => {
        new TableMaster("status", StatusModel).update(req, res);
    });


    app.post("/api/periodicLogs/", (req, res) => {
        getPeriodLogs(req, res);
    });

    app.post("/api/lieo/", (req, res) => {
        getLateInAndEarlyOutPeriodLogs(req, res);
    });

    app.post("/api/individualPeriodLogs/", (req, res) => {
        getIndividualPeriodLogs(req, res);
    });

    app.post("/api/onSchedule/", (req, res) => {
        onSchedule(req, res);
    });

};

module.exports = {
    FetchController,
};
