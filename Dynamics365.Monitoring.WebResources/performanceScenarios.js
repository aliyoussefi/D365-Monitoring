function DisplayTab(executionContext, tabName) {
    var formContext = executionContext.getFormContext();
    formContext.ui.tabs.forEach(function (control, index) {
        if (control.getName() == tabName) {
            control.setDisplayState("expanded");
        }
        //DYNX-11829
        else if (control.getName() !== tabName) {
            control.setVisible(false);
        }
        else {
            control.setVisible(true);
        }
    });
}


function PerformSleep(howlong) {

    //console.log("Hello");
    sleep(howlong);
    //console.log("World!");
}

function PerformSleep_Tab(howlong) {

    //console.log("Hello");
    sleep(howlong);
    //console.log("World!");
}

function PerformSleep_Load(howlong) {

    //console.log("Hello");
    sleep(howlong);
    //console.log("World!");
}

function PerformSleep_Save(howlong) {

    //console.log("Hello");
    sleep(howlong);
    //console.log("World!");
}

function PerformSleep_Control(howlong) {

    //console.log("Hello");
    sleep(howlong);
    //console.log("World!");
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}