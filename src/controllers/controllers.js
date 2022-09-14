const ZKLib = require('../../zklib')

const test = async (req, res) => {


    let zkInstance = new ZKLib('192.168.0.100', 4370, 10000, 4000);
    try {
        // Create socket to machine
        await zkInstance.createSocket()


        // Get general info like logCapacity, user counts, logs count
        // It's really useful to check the status of device
        console.log(await zkInstance.getInfo())
    } catch (e) {

    }

    const users = await zkInstance.getUsers()

    const attendances = await zkInstance.getAttendances('192.168.0.100', (percent, total)=>{
        // this callbacks take params is the percent of data downloaded and total data need to download
    })

    // console.log('check attendances',attendances )

    // let temp_attendance = attendances;

    res.send({
        info: attendances.data,
        users
    })

    // console.log('check users', users)
    // await zkInstance.disconnect()
    // zkInstance.getRealTimeLogs((data)=>{
    //     // do something when some checkin
    //     console.log(data)
    // })

}

// test()



// const {
//     TableMaster,
//     FarmModel,
//     findUser,
//     AllUsersModel,
//     UserTable,
//     RolesModel,
//     ApartmentModel,
//     HouseModel,
//     BillsModel,
//     StatusModel,
//     ConditionModel,
//     ConditionStateModel,
//     TenantOutModel
// } = require("../models/models");


const FetchController = (app) => {
    app.get("/api/logs", (req, res) => {
        test(req, res);
    });
    /*app.post("/api/users/verify", (req, res) => {
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
    });*/
};

module.exports = {
    FetchController,
};
