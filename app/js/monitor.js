const path = require('path')
const osu = require('node-os-utils')
const { info } = require('console')
const { cpuUsage, send } = require('process')
const cpu = osu.cpu
const mem = osu.mem
const os = osu.os

let cpuOverload = 80
let alertFreq = 5



// RUN EVERY 1 SECOND
setInterval(() => {
    // CPU USAGE
    cpu.usage().then(info =>{
        document.getElementById('cpu-usage').innerText = info + '%'

        document.getElementById('cpu-progress').style.width = info + '%'

        // MAKE PROGRESS BAR RED IF OVERLOAD
        if(info >= cpuOverload){
            document.getElementById('cpu-progress').style.background = 'red'
        }
        else{
            document.getElementById('cpu-progress').style.background = '#30c88b'
        }

        // CHECK OVERLOAD
        if ( info >= cpuOverload && runNotify(alertFreq) ) {
            sendNotification({
                title: 'CPU Overload',
                body: `CPU is over ${cpuOverload}`,
                icon: path.join(__dirname, 'img', 'icon.png')
            })

            localStorage.setItem('lastNotify', +new Date())
        }
    })

    // CPU FREE
    cpu.free().then(info =>{
        document.getElementById('cpu-free').innerText = info + "%"
    })

    // UPTIME
    document.getElementById('sys-uptime').innerText = secondsToDHMS(os.uptime())
}, 1000)


// SET MODEL
document.getElementById('cpu-model').innerText = cpu.model()

// COMPUTER NAME
document.getElementById('comp-name').innerText = os.hostname()

// OS
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`

// Total Mem
mem.info().then(info =>{
    document.getElementById('mem-total').innerText = info.totalMemMb
})

// SHOW DAYS, HOURS, MINS, SECONDS
function secondsToDHMS ( seconds ) {
    seconds = +seconds
    const D = Math.floor ( seconds / ( 3600 * 24 ) )
    const H = Math.floor ( ( seconds % ( 3600 * 24 ) ) / 3600 )
    const M = Math.floor ( ( seconds % 3600 ) / 60 )
    const S = Math.floor ( ( seconds % 60 ) )

    return `${D}d, ${H}h, ${M}m, ${S}s`
}


// SEND NOTIFICATION
function sendNotification ( options ) {
    new Notification(options.title, options)
}

// CHECK HOW MUCH TIME HAS PASSED SINCE NOTIFICATION
function runNotify(ferequency) {
    if (localStorage.getItem('lastNotify') === null) {
        // Store Timestamp
        localStorage.setItem('lastNotify', +new Date())
        return true
    }
    const notifyTime = new Date(parseInt(localStorage.getItem('lastNotify')))
    const now = new Date()
    const diffTime = Math.abs(now - notifyTime)
    const minutesPassed = Math.ceil(diffTime / (1000 * 60))

    if(minutesPassed > ferequency) {
        return true
    }
    else{
        return false
    }
}