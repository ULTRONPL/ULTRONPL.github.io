
$(window).load(function () {
    var body = $("body"),
        universe = $("#universe"),
        solarsys = $("#solar-system");

    var init = function () {
        body
            .removeClass("view-2D opening")
            .addClass("view-3D")
            .delay(2000)
            .queue(function () {
                $(this).removeClass("hide-UI").addClass("set-speed");
                $(this).dequeue();
            });
    };

    var setView = function (view) {
        universe.removeClass().addClass(view);
    };

    $("#toggle-data").click(function (e) {
        body.toggleClass("data-open data-close");
        e.preventDefault();
    });

    $("#toggle-controls").click(function (e) {
        body.toggleClass("controls-open controls-close");
        e.preventDefault();
    });

    $("#data a").click(function (e) {
        var ref = $(this).attr("class");
        solarsys.removeClass().addClass(ref);
        $(this).parent().find("a").removeClass("active");
        $(this).addClass("active");
        e.preventDefault();
    });

    $(".set-view").click(function () {
        body.toggleClass("view-3D view-2D");
    });
    $(".set-zoom").click(function () {
        body.toggleClass("zoom-large zoom-close");
    });
    $(".set-speed").click(function () {
        setView("scale-stretched set-speed");
    });
    $(".set-size").click(function () {
        setView("scale-s set-size");
    });
    $(".set-distance").click(function () {
        setView("scale-d set-distance");
    });

    iDontKnowHowToStoreBody = body

    init();
});

var tryAdd = function (setting) {
    body = $('body')
    if (!body.hasClass(setting)) {
        body.addClass(setting);
    }
}

var tryRemove = function (setting) {
    body = $('body')
    if (body.hasClass(setting)) {
        body.removeClass(setting);
    }
}

var setViewCopy = function (view) {
    $("#universe").removeClass().addClass(view);
};

var effect = "static";
var effectInterval = null;
var effectFunction = null;
var effectSeconds = 0.0;

var staticPlanet = "earth active"

var cycleIndex = 0;
var cycleIgnoreSun = false;

const planets = [
    "sun",
    "mercury",
    "venus",
    "earth active",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune"
]

var updateCycle = function() {
    cycleIndex = (cycleIndex + 1) % planets.length;
    if (cycleIgnoreSun && cycleIndex == 0) {
        cycleIndex++;
    }

    $("#solar-system").removeClass().addClass(planets[cycleIndex]);
}

var updateEffectSettings = function() {
    if (effectInterval != null) {
        clearInterval(effectInterval);
        effectInterval = null;
    }

    if (effect == "static") {
        element = $("#solar-system").removeClass();
        if (staticPlanet != "none") {
            element.addClass(staticPlanet)
        }
        return;
    }

    if (effect == "cycle") {
        cycleIndex = -1;
        effectFunction = updateCycle;
    }

    effectFunction();
    // Seconds to milliseconds
    effectInterval = setInterval(effectFunction, effectSeconds * 1000);
}

window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.ignoresun) {
            cycleIgnoreSun = properties.ignoresun.value
        }
        if (properties.effectseconds) {
            effectSeconds = properties.effectseconds.value
            updateEffectSettings();
        }
        if (properties.effect) {
            effect = properties.effect.value // Assuming that effect will only be one of the allowed values
            updateEffectSettings();
        }
        if (properties.planet) {
            if (effect == "static") {
                staticPlanet = properties.planet.value;
                updateEffectSettings()
            }
        }


        if (properties.view) {
            if (properties.view.value == "view-3D") {
                tryRemove("view-2D");
                tryAdd("view-3D");
            }
            else { // Should be 2D
                tryRemove("view-3D");
                tryAdd("view-2D");
            }
        }
        if (properties.zoom) {
            if (properties.zoom.value == "zoom-large") {
                tryRemove("zoom-close");
                tryAdd("zoom-large");
            }
            else {
                tryRemove("zoom-large");
                tryAdd("zoom-close")
            }
        }
        if (properties.datatype) { // datatype == focus
            if (properties.datatype.value == "set-speed") {
                setViewCopy("scale-stretched set-speed");
            }
            else if (properties.datatype.value == "set-size") {
                setViewCopy("scale-s set-size");
            }
            else {
                setViewCopy("scale-d set-distance");
            }
        }
    }
}
