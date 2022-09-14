const ZKLib = require('./zklib')

const test = async () => {


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

    console.log('check attendances',attendances )

    console.log('check users', users)
    await zkInstance.disconnect()
    zkInstance.getRealTimeLogs((data)=>{
        // do something when some checkin
        console.log(data)
    })

}

test()


/*const ZKLib = require('./zklib')
const test = async () => {


    let zkInstance = new ZKLib('192.168.0.100', 4370, 10000, 4000);
    try {
        await zkInstance.getSocketStatus()

        await zkInstance.createSocket()
    } catch (e) {
        if (e.code === 'EADDRINUSE') {
            console.log('eeee', e)
        }
    }


    const users = await zkInstance.getUsers()

    const attendances = await zkInstance.getAttendances('192.168.0.100', (percent, total)=>{
        // this callbacks take params is the percent of data downloaded and total data need to download
    })

    console.log('check attendances',attendances )

    console.log('check users', users)
    await zkInstance.disconnect()
    zkInstance.getRealTimeLogs((data)=>{
        // do something when some checkin
        console.log(data)
    })

}

test()*/


