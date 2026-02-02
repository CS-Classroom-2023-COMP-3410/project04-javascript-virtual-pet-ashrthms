const AMAZED= "./p4 icon amazed.png"
const REST= "./p4 icon rest.png"
const SAD= "./p4 icon sad.png"
const SLEEPING= "./p4 icon sleeping.png"
const YAWN= "./p4 icon yawn.png"
const MUSIC= "./p4 icon music.png"
const EAT = ["./p4 icon eat 1.gif", "./p4 icon yawn.png", "./p4 icon eat 2.gif"]
// const = "./p4 icon .png"]

const sleepButton = document.getElementById("sleep")
const feedButton = document.getElementById("feed")
// const ignoreButton = document.getElementById("ignore")
const playButton = document.getElementById("play")
const thinkButton = document.getElementById("think")

const happyVal = document.getElementById("happy-val")
const healthVal = document.getElementById("health-val")
const tiredVal = document.getElementById("tired-val")

const charDisplay = document.getElementById("char-img")



let happyness = Number(window.localStorage.getItem("happy")) ?? 100;
let health = Number(window.localStorage.getItem("health")) ?? 100;
let tired = Number(window.localStorage.getItem("tired")) ?? 0;
let ignored = true;
let currentAction = REST;
let passiveActionQueue = [];
let importantActionQueue = [];
let sleepInterval = null;
let targetAction;

const setAction = function(action) {
    currentAction = action; 
    console.log("currentAction: " + currentAction)
    charDisplay.src=currentAction
};
const queuePassiveAction = function(action) {passiveActionQueue.push(action)}
const queueImportantAction = function(action) {importantActionQueue.push(action)}
const doCycleTired = () => {
    // console.log("tired currentAction: " + currentAction)
    if (currentAction === SLEEPING) {
        tired -= 5; 
    } else if (currentAction === REST) {
        tired += .5;
    } else if (currentAction === AMAZED) {
        tired += 19;
    } else {
        tired += 1.5
    }
    if (tired > 95) {
        health *= .80;
        queueImportantAction(YAWN);
    } else if (tired > 85) {
        health -= .5; 
        queueImportantAction(YAWN);
    } else if (tired > 75) {
        happyness -= 1; 
        queuePassiveAction(YAWN);
    } else if (tired < 0) {
        tired = 0;
    }
    // console.log(tired)
    tiredVal.innerHTML=Math.floor(tired)
}
const doCycleHappy = () => {
    if (!(currentAction === SLEEPING 
        || currentAction === MUSIC 
        || currentAction === AMAZED)) {
        happyness -= 1;
        if (happyness < 30) {
            queueImportantAction(SAD);
        } else if (happyness < 50) {
            queuePassiveAction(SAD);
        }
    } else {
        if (currentAction === SLEEPING) {
            happyness = happyness*(Math.random()*.04+.98);
        } else {
        happyness = happyness*1.05;
        }
        if (happyness > 100) {
            currentAction = REST
        }
    }
    
    if (happyness < 10) {
        health -= 1;
    } else if (happyness > 100) {
        health += 1;
        happyness = 100;
    }
    happyVal.innerHTML = Math.floor(happyness)
}
const doCycleHunger = () => {
    if (currentAction === EAT[0]
        || currentAction === EAT[1] 
        || currentAction === EAT[2]) {
        health += 5;
        if (health > 100) {
            currentAction = REST;
        }
    } else if (currentAction === SLEEPING) {
        health += 2
    } else {
        health -= .25;
    }
    if (health > 100) {
        health = 100;   
    }

    healthVal.innerHTML = Math.floor(health)
}
const doCycles = () => {doCycleHappy();
                        doCycleHunger();
                        doCycleTired();
                        // console.log("tired: " + tired)
                        // console.log("health: " + health)
                        // console.log("happyness: " + happyness)
                        }

const onRestClick = () => {
    importantActionQueue.unshift(REST)
}
const onSleepClick = () => {
    console.log('sleep clicked');
    if (sleepButton.innerHTML === "Cancel Sleep") {
        sleepButton.innerHTML = "Sleep";
        if (sleepInterval) { clearInterval(sleepInterval); sleepInterval = null; }
    } else {
        sleepButton.innerHTML = "Cancel Sleep";
        importantActionQueue.unshift(SLEEPING);                  // show immediately
        sleepInterval = setInterval(() => queuePassiveAction(SLEEPING), 2000); // schedule
    }
    // importantActionQueue.unshift(SLEEP)
}
const onFeedClick = () => {
    importantActionQueue.unshift(EAT)
}
const onPlayClick = () => {
    importantActionQueue.unshift(MUSIC)
}
const onThinkClick = () => {
    console.log('think clicked');
    for (let i = 0; i < 5; i++) importantActionQueue.unshift(AMAZED);
    // importantActionQueue.unshift(SLEEP)
}

const onResetClick = () => {
    happyness = 100;
    tired = 0;
    health = 100;
    window.localStorage.removeItem("happy");
    window.localStorage.removeItem("health");
    window.localStorage.removeItem("tired");
    importantActionQueue = []
    passiveActionQueue = []
}

const compareActions = () => {
    let len = importantActionQueue.length;
    let targetIndex;
    let i = 0;
    for (let i = 0; i < len; i++) {
        targetIndex = passiveActionQueue.indexOf(importantActionQueue[i]);
        if (targetIndex != -1) {
            passiveActionQueue.splice(targetIndex,1);
        }
    }
}

setInterval(() => {
    doCycles()
    
    compareActions();
    // console.log(importantActionQueue[0], passiveActionQueue[0], REST)
    targetAction = importantActionQueue.shift() || passiveActionQueue.shift() || REST;
    // console.log("target action: " + targetAction)
    if (targetAction != EAT) {
        // console.log(targetAction)
        setAction(targetAction)
    } else {
        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < EAT.length; i++) {
                const delay = (j * EAT.length + i) * 333;
                setTimeout(() => setAction(EAT[i]), delay);
            }
        }
    }

    window.localStorage.setItem("happy", String(happyness));
    window.localStorage.setItem("health", String(health));
    window.localStorage.setItem("tired", String(tired));
    console.log(typeof tired, tired, typeof happyness, happyness, typeof health, health);
    
},2000)
