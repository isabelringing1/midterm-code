
var levels;
var currentObjects;
var currentLevel = null;
var moveDelay = 50;
var lastMousePos;
var levelFinished = false;

$(document).ready(function() {
    levels = new Map();
    currentObjects = new Map();
    $.getJSON('levels.json', function(data, status, xhr){
        for (var i = 0; i < data.levels.length; i++){
            levels.set(data.levels[i].level, data.levels[i]);
        }
        console.log(levels);
        addEventListener('mousemove', onMouseMove);
        addEventListener('click', onMouseClick);
    });
});

function setLevel(levelNum){
    if (!levels.has(levelNum)){
        console.log("Unable to get data for level " + levelNum);
        return;
    }
    currentObjects.clear();
    var level = levels.get(levelNum);
    var levelFinished = false;
    currentLevel = level;
    for (var i = 0; i < level.objects.length; i++){
        var obj = level.objects[i];
        var div = document.createElement("div");
        var img = document.createElement("img");
        img.src = "images/" + obj.name + "." + obj.extension;

        var xDelta = 0;
        var yDelta = 0;
        if (lastMousePos != null){
            xDelta = lastMousePos[0] - level.targetX;
            yDelta = lastMousePos[1] - level.targetY;
        }
        
        var xPos = (xDelta * obj.xFollow) + level.targetX + obj.offsetX;
        var yPos = (yDelta * obj.yFollow) + level.targetY + obj.offsetY;
        div.style.top = yPos + "px";
        div.style.left = xPos + "px";
        console.log("Setting obj " + obj.name + " to " + xPos + ', ' + yPos);
        div.appendChild(img);

        div.classList.add("object");
        div.id = obj.name;
        obj.currentPos = [xPos, yPos];
        currentObjects.set(obj.name, obj);
        $("#background").append(div);
    }
}

function onMouseMove(e){
    if (levelFinished){
        return;
    }
    var x = e.pageX;
    var y = e.pageY;
    
    var xDelta = 0;
    var yDelta = 0;
    if (lastMousePos != null){
        xDelta = e.pageX - lastMousePos[0];
        yDelta = e.pageY - lastMousePos[1];
    }

    for (let [name, obj] of currentObjects) {
        var newLeft = obj.currentPos[0] + xDelta * obj.xFollow;
        var newTop = obj.currentPos[1] + yDelta * obj.yFollow;
        $("#" + name).css({
            left: newLeft,
            top: newTop
        });
        obj.currentPos = [newLeft, newTop];
    }
    lastMousePos = [x, y];
    $("#debug")[0].innerHTML = lastMousePos;

    if (currentLevel.level > 0){
        if (currentLevel.targetX == x && currentLevel.targetY == y) {
            levelFinished = true;
            $("#debug")[0].innerHTML = "yay";
        }
    }
}

function onMouseClick(e){
    if (currentLevel == null){
        setLevel(1);
    }
}

function getPixelValue(value){
    if (!isNaN(value)){
        return value;
    }

    // otherwise it's a percentage
    var percent = Number(value.slice(0, -2));

    var dim = value[-1];
    if (dim == 'w'){
        return percent / 100 * window.innerWidth;
    }
    else if (dim == 'h'){

    }
}