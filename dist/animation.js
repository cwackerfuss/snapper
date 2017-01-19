"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var maxTravel = 50;
var paperWidth = 1200;
var paperHeight = 600;
var startingPoints = 20;
var pointDiameter = 2;
var pointSpeed = 7000; // randomIntFromInterval(4000,6000);
var maxConnectingDistance = paperWidth * paperHeight * 0.0005;

var s = Snap(paperWidth, paperHeight);
var lines = [];
var points = [];
var inittedConnect = false;

function newLine(x1, y1, x2, y2, color) {
    return s.line(x1, y1, x2, y2).attr({ strokeWidth: 1, stroke: color ? color : 'white', strokeOpacity: "0" });
}

function newPoint(x, y) {
    return s.circle(x, y, pointDiameter).attr({ fill: "white", fillOpacity: "1" });
}

function generatePoints() {
    for (var i = 0; i < startingPoints; i++) {
        var randX = randomIntFromInterval(paperWidth, 10);
        var randY = randomIntFromInterval(paperHeight, 10);
        var generatedPoint = newPoint(randX, randY);
        generatedPoint.startingPoints = { x: randX, y: randY };
        generatedPoint.dest = { x: 0, y: 0 };
        points.push(generatedPoint);
    }
}

function connectPoints() {
    for (var i = 0; i < points.length; i++) {
        points[i].lines = points[i].lines ? points[i].lines : [];
        var pointX = points[i].node.cx.animVal.value;
        var pointY = points[i].node.cy.animVal.value;
        for (var q = i + 1; q < points.length; q++) {
            points[q].lines = points[q].lines ? points[q].lines : [];
            var comparePointX = points[q].node.cx.animVal.value;
            var comparePointY = points[q].node.cy.animVal.value;
            var distance = calculateDistance(pointX, pointY, comparePointX, comparePointY);
            if (distance < maxConnectingDistance) {
                var lineExists = false;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = points[i].lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var line = _step.value;

                        if (line.connectsTo === q) {
                            lineExists = true;
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

                if (!lineExists) {

                    var x1 = points[i].node.cx.animVal.value;
                    var y1 = points[i].node.cy.animVal.value;
                    var x2 = points[q].node.cx.animVal.value;
                    var y2 = points[q].node.cy.animVal.value;

                    var lineIndex = lines.push(newLine(x1, y1, x2, y2, inittedConnect ? 'white' : 'white'));

                    var lineEl = lines[lineIndex - 1];
                    var pointAnim = points[i].anims[Object.keys(points[i].anims)[0]];
                    var animationTimeRemaining = pointAnim ? (1 - pointAnim.status()) * pointSpeed : pointSpeed;
                    lineEl.animate({
                        x1: points[i].dest.x,
                        y1: points[i].dest.y,
                        x2: points[q].dest.x,
                        y2: points[q].dest.y
                    }, animationTimeRemaining, mina.linear, function () {});
                    lineEl.animate({
                        strokeOpacity: "0.3"
                    }, pointSpeed / 3, mina.linear, function () {});
                    points[i].lines.push({ pos: 1, connectsTo: q, lineId: lineEl.id, el: lines[lineIndex - 1] });
                    points[q].lines.push({ pos: 2, connectsTo: i, lineId: lineEl.id, el: lineEl });
                }
            } else {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    var _loop = function _loop() {
                        var _step2$value = _slicedToArray(_step2.value, 2),
                            index = _step2$value[0],
                            line = _step2$value[1];

                        if (line.connectsTo === q) {
                            line.el.animate({ strokeOpacity: "0" }, 750, mina.linear, function () {
                                line.el.remove();
                            });
                            points[i].lines.splice(index, 1);
                        }
                    };

                    for (var _iterator2 = points[i].lines.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        _loop();
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

                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = points[q].lines.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var _step3$value = _slicedToArray(_step3.value, 2),
                            _index = _step3$value[0],
                            _line = _step3$value[1];

                        if (_line.connectsTo === i) {
                            points[q].lines.splice(_index, 1);
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }
        }
    }
    inittedConnect = true;
}

function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getNearbyCoordinate(start, axis) {
    var negOrPos = Math.random() < 0.5 ? -1 : 1;
    var rand = randomIntFromInterval(maxTravel, 10);
    var coord = start + negOrPos * rand;
    if (axis === 'x') {
        if (coord > paperWidth) {
            coord = coord - maxTravel;
        } else if (coord < 0) {
            coord = coord + maxTravel;
        }
    } else {
        if (coord > paperHeight) {
            coord = coord - maxTravel;
        } else if (coord < 0) {
            coord = coord + maxTravel;
        }
    }
    return coord;
}

function runAnimation() {
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = points[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var point = _step4.value;

            var startX = point.startingPoints.x;
            var startY = point.startingPoints.y;
            var toX = getNearbyCoordinate(startX, 'x');
            var toY = getNearbyCoordinate(startY, 'y');
            point.dest = { x: toX, y: toY };
            point.animate({ cx: toX, cy: toY }, pointSpeed, mina.linear);
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = point.lines[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var _line$el$animate;

                    var line = _step5.value;

                    line.el.animate((_line$el$animate = {}, _defineProperty(_line$el$animate, 'x' + line.pos, toX), _defineProperty(_line$el$animate, 'y' + line.pos, toY), _line$el$animate), pointSpeed, mina.linear);
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }

    return;
}

///////////////////////////////////////////////
// INITTING ///////////////////////////////////
///////////////////////////////////////////////

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
    loop();
};

function loopRunAnim() {
    asyncLoop({
        length: 10000,
        functionToLoop: function functionToLoop(loop, i) {
            setTimeout(function () {
                runAnimation();
                loop();
            }, pointSpeed);
        },
        callback: function callback() {}
    });
}

function loopConnectPoints() {
    asyncLoop({
        length: 10000,
        functionToLoop: function functionToLoop(loop, i) {
            setTimeout(function () {
                connectPoints();
                loop();
            }, pointSpeed / 5);
        },
        callback: function callback() {}
    });
}

function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last, deferTimer;
    return function () {
        var context = scope || this;

        var now = +new Date(),
            args = arguments;
        if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}

function createMousePoint(x, y) {
    var generatedPoint = newPoint(x, y);
    generatedPoint.startingPoints = { x: x, y: y };
    generatedPoint.dest = { x: x, y: y };
    generatedPoint.isMouse = true;
    points.push(generatedPoint);
}

function destroyMousePoint() {
    points[points.length - 1].remove();
    points.pop();
}

var docReadyCallback = function docReadyCallback() {
    generatePoints();
    connectPoints();
    runAnimation();
    loopConnectPoints();
    loopRunAnim();

    // s.mousemove(throttle(function(event) {
    //     createMousePoint(event.offsetX, event.offsetY);
    // }, 300))
    // console.log('s: ', s)
    s.node.addEventListener("mouseenter", function (event) {
        createMousePoint(event.offsetX, event.offsetY);
    });
    s.node.addEventListener("mouseleave", function (event) {
        destroyMousePoint();
    });

    // s.mousemove(throttle(function(event) {
    //     createMousePoint(event.offsetX, event.offsetY);
    // }, 300))

    // s.unmouseout(function(event) {
    //     console.log('unmouseout.')
    // })
    // s.mouseout(function(event) {
    //     console.log('mouseout.')
    // })
};

if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) {
    docReadyCallback();
} else {
    document.addEventListener("DOMContentLoaded", docReadyCallback);
}

window.clearSnap = function () {
    s.clear();
};
//# sourceMappingURL=animation.js.map
