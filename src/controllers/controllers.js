const ZKLib = require('../../zklib');

const test = async (req, res) => {


    let zkInstance = new ZKLib('192.168.0.100', 4370, 10000, 4000);
    try {
        // Create socket to machine
        await zkInstance.createSocket();


        // Get general info like logCapacity, user counts, logs count
        // It's really useful to check the status of device
        console.log(await zkInstance.getInfo())
    } catch (e) {

    }

    const users = await zkInstance.getUsers();

    const attendances = await zkInstance.getAttendances('192.168.0.100', (percent, total) => {
        // this callbacks take params is the percent of data downloaded and total data need to download
    });

    // console.log('check attendances',attendances )

    // let temp_attendance = attendances;

    return ({
        info: attendances.data,
        users
    })

    // console.log('check users', users)
    // await zkInstance.disconnect()
    // zkInstance.getRealTimeLogs((data)=>{
    //     // do something when some checkin
    //     console.log(data)
    // })

};

// test()

/*// Initialize
var ActiveDirectory = require('activedirectory');
var config = {
    url: 'ldap://dc.domain.com',
    baseDN: 'dc=domain,dc=com'
};
var ad = new ActiveDirectory(config);
var username = 'john.smith@domain.com';
var password = 'password';
// Authenticate
ad.authenticate(username, password, function(err, auth) {
    if (err) {
        console.log('ERROR: '+JSON.stringify(err));
        return;
    }
    if (auth) {
        console.log('Authenticated!');
    }
    else {
        console.log('Authentication failed!');
    }
});*/


const {
    TableMaster,
    findUser,
    AllUsersModel,
    UserTable,
    RolesModel,
    StatusModel,
    LogsModel,
    getPeriodLogs,
    SettingsModel
} = require("../models/models");


const FetchController = (app) => {
    app.get("/api/logs", (req, res) => {
        var fs = require('fs'),
            path = require('path'),
            filePath = path.join(__dirname, 'my_data.json');

        fs.readFile(filePath, function (err, data) {
            if (!err) {
                /*test(req, res).then((logsObject) => {
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
        })*/
                let logsObject = JSON.parse(data.toString());
                if (logsObject.info.length) {
                    let rcd = {};
                    let users = [];
                    for (let i = 0; i < logsObject.info.length; i++) {
                        if (!rcd.hasOwnProperty(logsObject.info[i].deviceUserId)) {
                            rcd[logsObject.info[i].deviceUserId] = "";
                            let temp = {name: `someone${i}`};
                            temp["userId"] = logsObject.info[i].deviceUserId;
                            users.push(temp)
                        }
                    }
                    logsObject.users = {
                        data: users
                    };
                    let temp_users = {};
                    for (let i = 0; i < logsObject.users.data.length; i++) {
                        temp_users[logsObject.users.data[i].userId] = logsObject.users.data[i].name
                    }
                    for (let i = 0; i < logsObject.info.length; i++) {
                        delete logsObject.info[i].ip;
                        let temp = new Date(logsObject.info[i].recordTime), t = temp.toLocaleTimeString(),
                            d = temp.toLocaleDateString();
                        logsObject.info[i].Id = logsObject.info[i].deviceUserId + d + t;
                        logsObject.info[i].Name = temp_users[logsObject.info[i].deviceUserId];
                        logsObject.info[i].Date = d;
                        logsObject.info[i].Time = t;
                        delete logsObject.info[i].recordTime;
                    }
                    req.body = logsObject.info;
                    LogsModel.find({}, (err, docs) => {
                        let to_add = [];
                        let temp = {};
                        for (let i = 0; i < docs.length; i++) {
                            temp[docs[i].Id] = true;
                        }
                        for (let i = 0; i < req.body.length; i++) {
                            if (!temp[req.body[i].Id]) {
                                to_add.push(req.body[i])
                            }
                        }
                        req.body = to_add;
                        new TableMaster("logs", LogsModel).add(req, res);
                    })


                }

            } else {
                console.log(err);
            }
        });

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
};

module.exports = {
    FetchController,
};
