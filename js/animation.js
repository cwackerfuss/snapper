const maxTravel = 50;
const paperWidth = 1000;
const paperHeight = 500;
const maxPointDistance = 100;
const startingPoints = 30;
const pointDiameter = 3;
const pointSpeed = 6000; // randomIntFromInterval(4000,6000);

var s = Snap(paperWidth,paperHeight);
var lines = [];
var points = [];
var foo = false;

function newLine(x1, y1, x2, y2, color) {
    return s.line(x1, y1, x2, y2).attr({strokeWidth:1,stroke:color ? color : 'white', strokeOpacity:"0.5"});
}

function newPoint(x, y, d) {
    return s.circle(x, y, d).attr({fill:"white", fillOpacity:"1"})
}

function generatePoints() {
    for (let i = 0; i < startingPoints; i++) {
        let randX = randomIntFromInterval(paperWidth, 10);
        let randY = randomIntFromInterval(paperHeight, 10);
        points.push( newPoint(randX, randY, pointDiameter) )
    }
}
generatePoints();

function connectPoints() {
    for (let i = 0; i < points.length; i++) {
        points[i].lines = points[i].lines ? points[i].lines : [];
        let pointX = points[i].node.cx.baseVal.value;
        let pointY = points[i].node.cy.baseVal.value;
        for (let q = i + 1; q < points.length; q++) {
            points[q].lines = points[q].lines ? points[q].lines : [];
            let comparePointX = points[q].node.cx.baseVal.value;
            let comparePointY = points[q].node.cy.baseVal.value;
            let distance = calculateDistance(pointX, pointY, comparePointX, comparePointY)
            if (distance < maxPointDistance) {
                var lineIndex = lines.push( newLine(pointX, pointY, comparePointX, comparePointY, foo ? 'white' : 'red') )
                points[i].lines.push({pos: 1, connectsTo: q, el: lines[lineIndex-1]})
                points[q].lines.push({pos: 2, connectsTo: i, el: lines[lineIndex-1]})
            }
        }
    }
    foo = true;
}
connectPoints()

window.clearSnap = function() {
    s.clear();
}

function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) )
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getNewDistanceToTravel(start) {
    let negOrPos = Math.random() < 0.5 ? -1 : 1;
    let rand = randomIntFromInterval(maxTravel, 10)
    return start + (negOrPos * rand);
}



function runAnim() {
    for (let point of points) {
        const startX = point.node.cx.baseVal.value;
        const startY = point.node.cy.baseVal.value;
        // each point should randomly pick which direction it should go next
        const toX = getNewDistanceToTravel(startX);
        const toY = getNewDistanceToTravel(startY);
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
    loop();//init
}

runAnim();
asyncLoop({
    length : 10000,
    functionToLoop : function(loop, i){
        setTimeout(function(){
            console.log('running loop')
            runAnim();
            loop();
        }, pointSpeed);
    },
    callback : function(){
        document.write('All done!');
    }
});

asyncLoop({
    length : 10000,
    functionToLoop : function(loop, i){
        setTimeout(function(){
            connectPoints()
            loop();
        }, pointSpeed/3);
    },
    callback : function(){
        document.write('All done!');
    }
});
