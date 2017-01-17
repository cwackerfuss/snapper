"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var maxTravel = 50;
var paperWidth = 1000;
var paperHeight = 500;
var maxPointDistance = 100;
var startingPoints = 30;
var pointDiameter = 3;
var pointSpeed = 6000; // randomIntFromInterval(4000,6000);

var s = Snap(paperWidth, paperHeight);
var lines = [];
var points = [];
var foo = false;

function newLine(x1, y1, x2, y2, color) {
    return s.line(x1, y1, x2, y2).attr({ strokeWidth: 1, stroke: color ? color : 'white', strokeOpacity: "0.5" });
}

function newPoint(x, y, d) {
    return s.circle(x, y, d).attr({ fill: "white", fillOpacity: "1" });
}

function generatePoints() {
    for (var i = 0; i < startingPoints; i++) {
        var randX = randomIntFromInterval(paperWidth, 10);
        var randY = randomIntFromInterval(paperHeight, 10);
        points.push(newPoint(randX, randY, pointDiameter));
    }
}
generatePoints();

function connectPoints() {
    for (var i = 0; i < points.length; i++) {
        points[i].lines = points[i].lines ? points[i].lines : [];
        var pointX = points[i].node.cx.baseVal.value;
        var pointY = points[i].node.cy.baseVal.value;
        for (var q = i + 1; q < points.length; q++) {
            points[q].lines = points[q].lines ? points[q].lines : [];
            var comparePointX = points[q].node.cx.baseVal.value;
            var comparePointY = points[q].node.cy.baseVal.value;
            var distance = calculateDistance(pointX, pointY, comparePointX, comparePointY);
            if (distance < maxPointDistance) {
                var lineIndex = lines.push(newLine(pointX, pointY, comparePointX, comparePointY, foo ? 'white' : 'red'));
                points[i].lines.push({ pos: 1, connectsTo: q, el: lines[lineIndex - 1] });
                points[q].lines.push({ pos: 2, connectsTo: i, el: lines[lineIndex - 1] });
            }
        }
    }
    foo = true;
}
connectPoints();

window.clearSnap = function () {
    s.clear();
};

function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getNewDistanceToTravel(start) {
    var negOrPos = Math.random() < 0.5 ? -1 : 1;
    var rand = randomIntFromInterval(maxTravel, 10);
    return start + negOrPos * rand;
}

function runAnim() {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var point = _step.value;

            var startX = point.node.cx.baseVal.value;
            var startY = point.node.cy.baseVal.value;
            // each point should randomly pick which direction it should go next
            var toX = getNewDistanceToTravel(startX);
            var toY = getNewDistanceToTravel(startY);
            point.animate({ cx: toX, cy: toY }, pointSpeed, mina.linear);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = point.lines[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _line$el$animate;

                    var line = _step2.value;

                    line.el.animate((_line$el$animate = {}, _defineProperty(_line$el$animate, 'x' + line.pos, toX), _defineProperty(_line$el$animate, 'y' + line.pos, toY), _line$el$animate), pointSpeed, mina.linear);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return;
}

var asyncLoop = function asyncLoop(o) {
    var i = -1;
    var loop = function loop() {
        i++;
        if (i == o.length) {
            o.callback();
            return;
        }
        o.functionToLoop(loop, i);
    };
    loop(); //init
};

runAnim();
asyncLoop({
    length: 10000,
    functionToLoop: function functionToLoop(loop, i) {
        setTimeout(function () {
            console.log('running loop');
            runAnim();
            loop();
        }, pointSpeed);
    },
    callback: function callback() {
        document.write('All done!');
    }
});

asyncLoop({
    length: 10000,
    functionToLoop: function functionToLoop(loop, i) {
        setTimeout(function () {
            connectPoints();
            loop();
        }, pointSpeed / 3);
    },
    callback: function callback() {
        document.write('All done!');
    }
});