var ConsoleApiDemo = {
    //https://developer.mozilla.org/en-US/docs/Web/API/Console
    //
    Asserting: function (context) {
        
    },
    //
    Clearing: function (context) {

    },
    //
    Counting: function (context) {

    },
    //
    Debugging: function (context) {

    },
    //
    Deserializing: function (context) {

    },
    //
    Grouping: function (context) {

    },
    //
    Logging: function (context) {
        var someObject = { str: "Some text", id: 5 };
        console.log(someObject);

        var car = "Dodge Charger";
        console.info("My first car was a", car, ". The object is:", someObject);
    },
    Profiling: function (context) {

    },
    //
    Timing: function (context) {
        console.time("answer time");
        alert("Click to continue");
        console.timeLog("answer time");
        alert("Do a bunch of other stuff...");
        console.timeEnd("answer time");
    },
    Tracing: function (context) {
        console.trace();
    }
};