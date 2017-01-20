const maxTravel = 50;
const paperWidth = 1200;
const paperHeight = 600;
const startingPoints = 20;
const pointDiameter = 0;
const pointSpeed = 7000; // randomIntFromInterval(4000,6000);
const maxConnectingDistance = paperWidth * paperHeight * 0.0005;
const rgb1 = [237,65,149];
const rgb2 = [226,44,40];

var s = Snap(paperWidth,paperHeight);
var lines = [];
var points = [];

function newLine(x1, y1, x2, y2) {
    let x1Position = x1 / paperWidth;
    return s.line(x1, y1, x2, y2).attr({strokeWidth:2,stroke: getIntermediaryRgb(x1Position), strokeOpacity:"0"});
}

function newPoint(x, y) {
    return s.circle(x, y, pointDiameter).attr({fill:"white", fillOpacity:"1"})
}

function getIntermediaryRgb(percent) {
    let rDiff = rgb1[0] > rgb2[0] ? rgb1[0] - rgb2[0] : rgb2[0] - rgb1[0];
    let gDiff = rgb1[1] > rgb2[1] ? rgb1[1] - rgb2[1] : rgb2[1] - rgb1[1];
    let bDiff = rgb1[2] > rgb2[2] ? rgb1[2] - rgb2[2] : rgb2[2] - rgb1[2];
    let rNew = rgb1[0] > rgb2[0] ? (rgb1[0] - (rDiff * percent)) : (rgb1[0] + (rDiff * percent))
    let gNew = rgb1[1] > rgb2[1] ? (rgb1[1] - (gDiff * percent)) : (rgb1[1] + (gDiff * percent))
    let bNew = rgb1[2] > rgb2[2] ? (rgb1[2] - (bDiff * percent)) : (rgb1[2] + (bDiff * percent))
    let newRgb = `rgb(${rNew},${gNew},${bNew})`;
    return newRgb;
}

function generatePoints() {
    for (let i = 0; i < startingPoints; i++) {
        let randX = randomIntFromInterval(paperWidth, 10);
        let randY = randomIntFromInterval(paperHeight, 10);
        let generatedPoint = newPoint(randX, randY)
        generatedPoint.startingPoints = {x: randX, y: randY};
        generatedPoint.dest = {x: 0, y: 0};
        points.push( generatedPoint )
    }
}

function connectPoints() {
    for (let i = 0; i < points.length; i++) {
        points[i].lines = points[i].lines ? points[i].lines : [];
        let pointX = points[i].node.cx.animVal.value;
        let pointY = points[i].node.cy.animVal.value;
        for (let q = i + 1; q < points.length; q++) {
            points[q].lines = points[q].lines ? points[q].lines : [];
            let comparePointX = points[q].node.cx.animVal.value;
            let comparePointY = points[q].node.cy.animVal.value;
            let distance = calculateDistance(pointX, pointY, comparePointX, comparePointY)
            if (distance < maxConnectingDistance) {
                let lineExists = false;
                for (const line of points[i].lines) {
                    if (line.connectsTo === q) {
                        lineExists = true;
                    }
                }
                if (!lineExists) {

                    let x1 = points[i].node.cx.animVal.value;
                    let y1 = points[i].node.cy.animVal.value;
                    let x2 = points[q].node.cx.animVal.value;
                    let y2 = points[q].node.cy.animVal.value

                    const lineIndex = lines.push( newLine(x1, y1, x2, y2) )

                    const lineEl = lines[lineIndex-1];
                    const pointAnim = points[i].anims[Object.keys(points[i].anims)[0]]
                    const animationTimeRemaining = pointAnim ? ((1 - pointAnim.status()) * pointSpeed) : pointSpeed;
                    lineEl.animate(
                        {
                            x1: points[i].dest.x,
                            y1: points[i].dest.y,
                            x2: points[q].dest.x,
                            y2: points[q].dest.y
                        },
                        animationTimeRemaining,
                        mina.linear,
                        () => {}
                    )
                    lineEl.animate(
                        {
                            strokeOpacity:"0.3"
                        },
                        pointSpeed/3,
                        mina.linear,
                        () => {}
                    )
                    points[i].lines.push({pos: 1, connectsTo: q, lineId: lineEl.id, el: lines[lineIndex-1]})
                    points[q].lines.push({pos: 2, connectsTo: i, lineId: lineEl.id, el: lineEl})
                }
            } else {
                for (let [index, line] of points[i].lines.entries()) {
                    if (line.connectsTo === q) {
                        line.el.animate(
                            {strokeOpacity:"0"},
                            750,
                            mina.linear,
                            () => { line.el.remove() }
                        )
                        points[i].lines.splice(index, 1);
                    }
                }
                for (let [index, line] of points[q].lines.entries()) {

                    if (line.connectsTo === i) {
                        points[q].lines.splice(index, 1);
                    }
                }
            }
        }
    }
}

function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) )
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getNearbyCoordinate(start, axis) {
    let negOrPos = Math.random() < 0.5 ? -1 : 1;
    let rand = randomIntFromInterval(maxTravel, 10)
    let coord = start + (negOrPos * rand)
    if (axis === 'x') {
        if (coord > paperWidth) {
            coord = coord - maxTravel;
        } else if (coord < 0) {
            coord = coord + maxTravel;
        }
    }
    else {
        if (coord > paperHeight) {
            coord = coord - maxTravel;
        } else if (coord < 0) {
            coord = coord + maxTravel;
        }
    }
    return coord;
}

function runAnimation() {
    for (let point of points) {
        const startX = point.startingPoints.x;
        const startY = point.startingPoints.y;
        const toX = getNearbyCoordinate(startX, 'x');
        const toY = getNearbyCoordinate(startY, 'y');
        point.dest = {x: toX, y: toY};
        point.animate(
            {cx: toX, cy: toY},
            pointSpeed,
            mina.linear
        )
        for (let line of point.lines) {
            line.el.animate(
                {['x' + line.pos]: toX, ['y' + line.pos]: toY},
                pointSpeed,
                mina.linear
            )
        }
    }
    return;
}

///////////////////////////////////////////////
// INITTING ///////////////////////////////////
///////////////////////////////////////////////

var asyncLoop = function(o){
    var i = -1;
    var loop = function(){
        i++;
        if (i == o.length) {
            o.callback();
            return;
        }
        o.functionToLoop(loop, i);
    }
    loop();
}

function loopRunAnim() {
    asyncLoop({
        length: 10000,
        functionToLoop: function(loop, i){
            setTimeout(function(){
                runAnimation();
                loop();
            }, pointSpeed);
        },
        callback(){}
    });
}

function loopConnectPoints() {
    asyncLoop({
        length: 10000,
        functionToLoop: function(loop, i){
            setTimeout(function(){
                connectPoints()
                loop();
            }, pointSpeed/5);
        },
        callback(){}
    });
}

function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
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
    let generatedPoint = newPoint(x, y);
    generatedPoint.startingPoints = {x, y};
    generatedPoint.dest = {x, y};
    generatedPoint.isMouse = true;
    points.push( generatedPoint )
}

function destroyMousePoint() {
    points[points.length-1].remove();
    points.pop();
}

var docReadyCallback = function(){
    generatePoints();
    connectPoints()
    runAnimation();
    loopConnectPoints();
    loopRunAnim()

    // s.mousemove(throttle(function(event) {
    //     createMousePoint(event.offsetX, event.offsetY);
    // }, 300))
    // console.log('s: ', s)
    s.node.addEventListener("mouseenter", function(event) {
        createMousePoint(event.offsetX, event.offsetY);
    })
    s.node.addEventListener("mouseleave", function(event) {
        destroyMousePoint();
    })

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

if ( document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  docReadyCallback();
} else {
  document.addEventListener("DOMContentLoaded", docReadyCallback);
}

window.clearSnap = function() {
    s.clear();
}
