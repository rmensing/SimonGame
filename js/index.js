var game = {
    audio: [],
    colors: ['green', 'red', 'yellow', 'blue'],
    pwr: false,
    strict: false,
    lastButton: null,
    buttonCount: -1,
    seq: [],
    tempSeq: [],
    count: 0,
    countStr: function() {
        if (this.count.toString().length === 1) {
            return '0' + this.count.toString();
        } else {
            return this.count.toString();
        }
    },
    speed: 0,
    speedArr: [4, 3, 2, 1],
    /*Speed multiplyer. * tick time of 250ms*/
};
var qtimer;
var queue = [];
var qNow = [];
var qWhat;
var qTime = 0;
var qFirst = false;
var tick = 250; /*time check 'tick' interval - time length of each qTime. */
var endTime = 0;

game.audio[0] = new Howl({
    src: ['https://s3-us-west-2.amazonaws.com/txw2/Simon/green.mp3']
});
game.audio[1] = new Howl({
    src: ['https://s3-us-west-2.amazonaws.com/txw2/Simon/red.mp3']
});
game.audio[2] = new Howl({
    src: ['https://s3-us-west-2.amazonaws.com/txw2/Simon/yellow.mp3']
});
game.audio[3] = new Howl({
    src: ['https://s3-us-west-2.amazonaws.com/txw2/Simon/blue.mp3']
});
game.audio[4] = new Howl({
    src: ['https://s3-us-west-2.amazonaws.com/txw2/Simon/Buzz.mp3']
});

var s = Snap("#svg");
var f = s.filter(Snap.filter.shadow(-10, 10, 10, "#444", 0.9)),
    c = s.circle(550, 550, 520).attr({
        filter: f
    });
var mainCirc = s.circle(550, 550, 500);
var g = s.gradient("L(1000, 0, 0, 10000)rgba(0,0,0,0.6)-rgba(0,0,0,0.9)");
mainCirc.attr({
    fill: "#222222",
    stroke: g,
    strokeWidth: 6
});

var innerCirc = s.circle(550, 550, 200);
innerCirc.attr({
    fill: "#CCCCCC",
    stroke: "#FFF",
    strokeWidth: 2
});
var innerCirc2 = s.circle(550, 550, 195);
innerCirc2.attr({
    fill: "#CCCCCC",
    stroke: "#000",
    strokeWidth: 2
});
var innerTop = s.path("M357,525a195,195,0,0,1,386.7816,0Z");
innerTop.attr({
    fill: "#000000",
    stroke: "#000000",
    strokeWidth: 2
});
var innerBottom = s.path("M356,532a195,194,0,1,0,387.7816,0Z");
innerBottom.attr({
    fill: "#FFF",
    stroke: "#000000",
    strokeWidth: 3
});

var logo = s.path("M 650,495 c 0,-20.44671 0.0228,-21.33027 0.57433,-22.23717 1.08196,-1.77913 1.88337,-2.06711 5.72567,-2.05747 3.76825,0.009 4.4715,0.22468 5.4161,1.65762 0.55965,0.84898 0.58001,1.63301 0.58192,22.40477 l 0.002,21.525 9.61169,0 9.6117,0 -0.0867,-24.225 -0.0867,-24.225 -0.65944,-1.35809 c -1.17237,-2.41443 -3.15913,-3.69234 -6.46844,-4.16056 -2.54498,-0.36008 -17.43217,-0.13044 -19.93976,0.30758 -1.07542,0.18785 -2.44341,0.69137 -3.225,1.18704 l -1.35736,0.86082 0,-0.68606 c 0,-0.37733 -0.16875,-0.91655 -0.375,-1.19826 -0.34127,-0.46614 -1.1711,-0.50503 -9.225,-0.43234 l -8.85,0.0799 -0.0766,26.925 -0.0766,26.925 9.4516,0 9.45161,0 0,-21.29275 z m -74.93884,20.82932 0.8602,-0.18894 -0.0857,-22.69881 -0.0857,-22.69882 -0.6933,-1.71629 c -0.92205,-2.28258 -2.79143,-4.16573 -5.0312,-5.06826 -1.7581,-0.70844 -1.88284,-0.71545 -12.7255,-0.71545 l -10.95001,0 -1.686,0.79055 c -0.9273,0.4348 -2.2254,1.27786 -2.88466,1.87347 l -1.19866,1.08291 -1.07593,-1.01472 c -2.59266,-2.4452 -4.8599,-2.86937 -15.35475,-2.87271 -5.55101,-0.002 -7.91795,0.10886 -9.10835,0.42571 -1.8164,0.48346 -3.52749,1.23738 -3.79661,1.67282 -0.35548,0.57518 -0.74504,0.27647 -0.74504,-0.5713 0,-0.47479 -0.1748,-1.00834 -0.38846,-1.18566 -0.44456,-0.36896 -15.55929,-0.59195 -16.60346,-0.24496 -0.62284,0.20698 -0.64719,0.41142 -0.81944,6.87861 -0.0976,3.6659 -0.23297,15.34394 -0.30074,25.95119 -0.10634,16.64407 -0.0631,19.34606 0.31587,19.725 0.36516,0.36516 1.89625,0.43909 9.09313,0.43909 4.75971,0 8.86757,-0.0819 9.12857,-0.1821 0.42616,-0.16353 0.47453,-2.22614 0.47453,-20.23523 0,-13.2951 0.1098,-20.56511 0.32581,-21.57232 0.25554,-1.19153 0.55644,-1.6951 1.39516,-2.33481 1.04353,-0.79595 1.1695,-0.81576 5.21796,-0.82059 l 4.14862,-0.005 0.98123,0.9815 0.98122,0.98151 -0.0871,21.06849 c -0.0569,13.75528 0.0175,21.2247 0.21423,21.5185 0.25564,0.38177 1.65615,0.45553 9.2371,0.48645 4.91468,0.02 9.16847,-0.0841 9.45287,-0.23132 0.48068,-0.24892 0.52294,-1.73137 0.6,-21.04988 0.0769,-19.26711 0.12148,-20.84095 0.61208,-21.58949 1.04141,-1.58894 1.83571,-1.85692 5.8448,-1.97195 4.51122,-0.12944 5.31941,0.12586 6.11874,1.93288 0.52615,1.18944 0.56142,2.26218 0.55315,16.82188 -0.0162,28.52341 -0.0763,25.89102 0.59645,26.13988 0.74722,0.27641 16.30882,0.4529 17.46885,0.19812 z m 49.1551,-0.6943 c 1.67937,-1.08001 2.44322,-1.91378 3.4788,-3.79728 l 0.82196,-1.49499 -0.0782,-20.55 c -0.0742,-19.49356 -0.10757,-20.61169 -0.64938,-21.75 -0.82142,-1.72575 -2.58768,-3.42528 -4.48945,-4.31985 l -1.65,-0.77614 -11.55,-0.0944 c -12.30476,-0.10063 -24.31884,0.28332 -26.1832,0.83677 -2.24883,0.66758 -4.49607,3.33214 -4.99892,5.92724 -0.15203,0.78454 -0.35137,9.66143 -0.44298,19.72643 -0.15234,16.73568 -0.12206,18.47132 0.35426,20.30415 1.03763,3.99277 3.43508,6.12469 7.35029,6.53623 1.1938,0.12548 9.94037,0.24648 19.43681,0.26889 l 17.26627,0.0407 1.33373,-0.85773 z m -24.54285,-7.60717 c -2.34053,-0.49693 -2.27197,0.0931 -2.09986,-18.0699 0.0965,-10.18464 0.26564,-16.20136 0.4697,-16.70993 0.5995,-1.49411 1.36633,-1.75538 5.1485,-1.75415 3.89441,0.001 5.19269,0.46622 5.6252,2.01457 0.12817,0.45887 0.22712,7.65181 0.21988,15.98431 -0.0133,15.30161 -0.1477,17.43803 -1.14922,18.26857 -0.47367,0.39279 -6.67217,0.59392 -8.2142,0.26653 z m -138.41332,7.4031 c 2.58193,-0.72583 4.50164,-2.59966 5.4056,-5.27644 0.57671,-1.70773 0.6343,-2.53926 0.6343,-9.15876 0,-6.55561 -0.06,-7.4408 -0.6024,-8.89055 -0.85241,-2.27827 -2.37016,-3.91366 -4.69377,-5.05757 l -1.97099,-0.97031 -11.36859,-0.2357 c -12.75954,-0.26454 -12.88279,-0.28536 -13.476,-2.27562 -0.20664,-0.69326 -0.29718,-2.98053 -0.23652,-5.97496 0.0935,-4.61454 0.13279,-4.88841 0.80449,-5.60257 1.01082,-1.07471 3.18847,-1.51104 6.54262,-1.31093 3.13592,0.18709 4.82211,0.81411 5.41937,2.01521 0.24353,0.48974 0.37448,2.22073 0.37737,4.98827 0.003,3.2127 0.1036,4.32058 0.4143,4.57843 0.27354,0.22702 3.29224,0.39643 9.075,0.5093 7.07097,0.13801 8.76615,0.0935 9.21428,-0.24208 0.50408,-0.37744 0.55001,-0.98282 0.55953,-7.37396 0.0103,-6.92625 0.006,-6.97124 -0.78157,-8.5814 -0.84398,-1.72503 -2.07272,-2.8474 -3.77712,-3.45014 -1.52538,-0.53943 -12.29451,-0.90132 -27.15,-0.91235 -13.39337,-0.01 -14.169,0.051 -16.58915,1.30246 -1.34434,0.69519 -2.90675,2.68655 -3.46567,4.41714 -0.65796,2.03725 -0.72055,16.04125 -0.0824,18.43763 0.76492,2.87246 2.98015,5.45459 5.57751,6.50127 1.59226,0.64166 2.13931,0.67507 13.45977,0.82214 l 11.80005,0.15329 0.88682,0.99301 0.88681,0.99302 -0.0388,4.56029 c -0.0599,7.03829 -0.38562,7.4089 -6.50027,7.39652 -3.96736,-0.008 -5.73768,-0.31247 -6.30161,-1.08369 -0.26653,-0.36451 -0.38303,-1.77261 -0.38303,-4.62975 0,-3.45253 -0.0789,-4.17146 -0.49589,-4.51767 -0.69019,-0.57306 -18.19413,-0.80946 -18.86252,-0.25476 -0.65696,0.54524 -0.63701,11.01262 0.0247,12.95461 0.97077,2.84903 3.8871,5.11233 7.2398,5.61862 0.95916,0.14485 9.57392,0.22547 19.14392,0.17916 15.64631,-0.0757 17.59252,-0.13831 19.3101,-0.62116 z m 27.94626,0.1618 c 0.45194,-0.71495 0.38706,-51.98658 -0.0664,-52.44 -0.26435,-0.26436 -2.80556,-0.36 -9.56501,-0.36 -8.96053,0 -9.20919,0.016 -9.36231,0.60153 -0.0865,0.33085 -0.13602,12.2446 -0.10999,26.475 l 0.0473,25.87347 2.1,0.15 c 1.155,0.0825 5.37868,0.15 9.38595,0.15 6.14997,0 7.3303,-0.0702 7.57041,-0.45 z");
logo.attr({
    fill: "#fff"
});
var buttonTL = s.path("M100,525a450,450,0,0,1,425,-425v200a250,250,0,0,0,-225,225Z");
buttonTL.attr({
    id: "green",
    class: "button noclick",
    fill: "#00aa00",
    stroke: "#009900",
    strokeWidth: 2
});
var buttonTR = s.path("M575,100a450,450,0,0,1,425,425h-200a250,250,0,0,0,-225,-225Z");
buttonTR.attr({
    id: "red",
    class: "button noclick",
    fill: "#aa0000",
    stroke: "#990000",
    strokeWidth: 2
});
var buttonBR = s.path("M1000,575.5a450,450,0,0,1,-425,425v-200a250,250,0,0,0,225,-225Z");
buttonBR.attr({
    id: "blue",
    class: "button noclick",
    fill: "#00aaaa",
    stroke: "#009999",
    strokeWidth: 2
});
var buttonBL = s.path("M525,1000a450,450,0,0,1,-425,-425h200a250,250,0,0,0,225,225Z");
buttonBL.attr({
    id: "yellow",
    class: "button noclick",
    fill: "#aaaa00",
    stroke: "#999900",
    strokeWidth: 2
});
var display = s.rect(375, 550, 110, 60, 7, 7);
display.attr({
    id: "display",
    fill: "#4d0000",
    stroke: "#000000",
    strokeWidth: 2
});
var displayText = s.text(395, 600, '--');
displayText.attr({
    id: "displayText",
    fill: "#770000",
    fontFamily: 'Fira mono',
    fontSize: '4em',
    fontWeight: 900,
});
var startFilter = s.filter(Snap.filter.shadow(-4, 4, 3, "#000", 0.75));
var startButton = s.circle(550, 585, 17);
startButton.attr({
    id: "startButton",
    fill: "#cc0000",
    stroke: "#000000",
    strokeWidth: 3,
    filter: startFilter
});
var strictFilter = s.filter(Snap.filter.shadow(-4, 4, 3, "#000", 0.75));
var strictButton = s.circle(650, 585, 17);
strictButton.attr({
    id: "strictButton",
    fill: "#ffff00",
    stroke: "#000000",
    strokeWidth: 3,
    filter: startFilter
});
var strictLED = s.circle(650, 552, 7);
strictLED.attr({
    id: "strictLED",
    fill: "#4d0000",
    stroke: "#000000",
    strokeWidth: 3,
});
var countText = s.text(395, 630, "Count");
countText.attr({
    fill: "#000000",
    fontFamily: 'Alfa Slab One',
    fontSize: '1.25em'
});
var startText = s.text(523, 630, "Start");
startText.attr({
    fill: "#000000",
    fontFamily: 'Alfa Slab One',
    fontSize: '1.25em'
});
var strictText = s.text(623, 630, "Strict");
strictText.attr({
    fill: "#000000",
    fontFamily: 'Alfa Slab One',
    fontSize: '1.25em'
});
var switchOutside = s.rect(500, 680, 103, 40, 5, 5);
switchOutside.attr({
    id: "switchOutside",
    class: "power",
    fill: "#990000",
    stroke: "#000000",
    strokeWidth: 9,
    strokeOpacity: 0.7
});

var switchSlide = s.rect(502, 684, 48, 30, 5, 5);
switchSlide.attr({
    id: "switchSlide",
    class: "power",
    fill: "#0a89ff",
    stroke: "#0000f7",
    strokeWidth: 1,
    strokeOpacity: 0.7
});
var onText = s.text(620, 705, "On");
onText.attr({
    fill: "#000000",
    fontFamily: 'Alfa Slab One',
    fontSize: '1.25em'
});
var offText = s.text(455, 705, "Off");
offText.attr({
    fill: "#000000",
    fontFamily: 'Alfa Slab One',
    fontSize: '1.25em'
});
$('.button').mousedown(function() {
    if (game.pwr) {
        $('#' + this.id).addClass('on');
        game.audio[game.colors.indexOf(this.id)].play();
        game.lastButton = game.colors.indexOf(this.id);
        game.buttonCount++;
        checkButton();
    }
});
$('.button').mouseup(function() {
    $('#' + this.id).removeClass('on');
    game.audio[game.colors.indexOf(this.id)].stop();
});
$('.button').mouseout(function() {
    $('#' + this.id).removeClass('on');
    game.audio[game.colors.indexOf(this.id)].stop();
});

$("#startButton").mousedown(function() {
    if (game.pwr) {
        startButton.attr("filter", "");
        gameStart();
    }
});
$("#startButton").mouseup(function() {
    startButton.attr("filter", startFilter);
});
$("#startButton").mouseout(function() {
    startButton.attr("filter", startFilter);
});
$("#strictButton").mousedown(function() {
    if (game.pwr) {
        strictButton.attr("filter", "");
        if (game.strict) {
            strictLED.attr("fill", "#4d0000");
            game.strict = false;
        } else {
            strictLED.attr("fill", "#FF0000");
            game.strict = true;
        }
    }
});
$("#strictButton").mouseup(function() {
    strictButton.attr("filter", strictFilter);
});
$("#strictButton").mouseout(function() {
    strictButton.attr("filter", strictFilter);
});
$(".power").click(function() {
    if (game.pwr) {
        switchSlide.animate({
            x: 502
        }, 0);
        game.pwr = false;
        pwrOn();
    } else {
        switchSlide.animate({
            x: 552
        }, 0);
        game.pwr = true;
        pwrOn();
    }
});

function pwrOn() {
    if (game.pwr) {
        displayText.attr("fill", "#DD0000");
    } else {
        queue = [];
        qNow = [];
        qWhat = '';
        displayText.stop();
        displayText.attr("text", '--');
        displayText.attr("fill", "#770000");
        var tone = game.tempSeq[0];
        game.audio[tone].stop();
        $('#' + game.colors[tone]).removeClass('on');
        clearInterval(qtimer);
    }
}

function gameStart() {
    clearInterval(qtimer);
    game.lastButton = null;
    game.buttonCount = -1;
    game.seq = [];
    game.count = 0;
    var x = 0;
    timer;
    queue = [];
    qNow = [];
    qWhat = "";
    qTime = 0;
    queue.push(['displayFlash', 9]);
    qFirst = true;
    timer();
    addTone();
}

function addTone() {
    var tone = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
    game.seq.push(tone);
    queue.push(['addTone', 0]);
    playSequence();
}

function playSequence() {
    game.tempSeq = game.seq.slice();
    var toneLength = game.speedArr[game.speed];
    for (var x = 0; x < game.seq.length; x++) {
        queue.push(['play', toneLength]);
        if (x === game.seq.length - 1) {
            queue.push(['wait', toneLength / 4]);
        } else {
            queue.push(['wait', toneLength / 2]);
        }
    }
    queue.push(['waitInput', toneLength * 4]);
}

function timer() {
    qtimer = setInterval(function() {
        if (qNow.length > 0) {
            qWhat = qNow[0];
            qTime = qNow[1];
            doStuff();
        } else if (qNow.length === 0 && queue.length > 0) {
            qNow = queue.shift();
            qWhat = qNow[0];
            qTime = qNow[1];
            qFirst = true;
            endTime = Date.now() + (qTime * tick);
            doStuff();
        }
    }, 10); /*Interval of each loop of doStuff().*/
}

function doStuff() {
    switch (qWhat) {
        case 'displayFlash':
            if (endTime > Date.now() && qFirst) {
                qFirst = false;
                displayFlash();
            } else if (endTime <= Date.now()) {
                displayText.stop();
                displayText.attr('fill', "#dd0000")
                qNow = [];
                displayText.attr("text", game.countStr());
            }
            break;
        case 'wait':
            if (endTime <= Date.now()) {
                qNow = [];
            }
            break;
        case 'addTone':
            game.count++;
            displayText.attr("text", game.countStr());
            qNow = [];
            break;
        case 'play':
            displayText.attr("text", game.countStr());
            if (endTime > Date.now() && qFirst) {
                qFirst = false;
                var tone = game.tempSeq[0];
                game.audio[tone].play();
                $('#' + game.colors[tone]).addClass('on');
            } else if (endTime <= Date.now()) {
                var tone = game.tempSeq[0];
                game.audio[tone].stop();
                $('#' + game.colors[tone]).removeClass('on');
                game.tempSeq.shift();
                qNow = [];
            }
            break;
        case 'waitInput':
            if (endTime > Date.now() && qFirst) {
                qFirst = false;
                $('.button').addClass('click');
                $('.button').removeClass('noclick');
            } else if (endTime <= Date.now()) {
                qNow = [];
                $('.button').removeClass('click');
                $('.button').addClass('noclick');
                queue.push(['lose', 4]);
            }
            break;
        case 'lose':
            if (endTime > Date.now() && qFirst) {
                qFirst = false;
                game.audio[4].play();
                displayText.attr("text", "XX");
            } else if (endTime <= Date.now()) {
                qNow = [];
                qWhat = "";
                qTime = 0;
                game.audio[4].stop();
                displayText.attr("text", "--");
                clearInterval(qtimer);
                if (!game.strict) {
                    playSequence();
                    timer();
                }
            }
            break;
        case 'won':
            displayText.attr("text", "**");
            won();
            break;
        case 'end':
            end();
            break;
    }
}

function won() {
    queue = [];
    qNow = [];
    qWhat = '';
    clearInterval(qtimer);
    game.tempSeq = [3, 2, 1, 0, 1, 0];
    var charge = [1, 1, 1, 2, 1, 3];
    for (var x = 0; x < game.tempSeq.length; x++) {
        queue.push(['play', charge[x]]);
    }
    queue.push(['end', 0]);
    timer();
}

function end() {
    queue = [];
    qNow = [];
    qWhat = '';
    clearInterval(qtimer);
}

function checkButton() {
    qNow = [];
    qWhat = '';
    qTime = 0;
    if (game.lastButton === game.seq[game.buttonCount] && game.seq.length === game.buttonCount + 1 && game.count === 20) {
      $('.button').removeClass('click');
      $('.button').addClass('noclick');
        queue = [];
        queue.push(['won', 12]);
    } else if (game.lastButton === game.seq[game.buttonCount] && game.seq.length === game.buttonCount + 1 && game.count < 20) {
        (game.count < 4) ? game.speed = 0: (game.count < 8) ? game.speed = 1 : (game.count < 12) ? game.speed = 2 : game.speed = 3;
        $('.button').removeClass('click');
        $('.button').addClass('noclick');
        game.buttonCount = -1;
        game.lastButton = null;
        queue.push(['wait', 2])
        addTone();
    } else if (game.lastButton === game.seq[game.buttonCount] && game.seq.length !== game.buttonCount + 1) {
      $('.button').removeClass('click');
      $('.button').addClass('noclick');
        var toneLength = game.speedArr[game.speed];
        queue.push(['waitInput', toneLength * 4]);
    } else if (game.lastButton !== game.seq[game.buttonCount]) {
      $('.button').removeClass('click');
      $('.button').addClass('noclick');
        game.buttonCount = -1;
        game.lastButton = null;
        queue.push(['lose', 4]);
    }
}

function displayFlash() {
    displayText.animate({
        fill: "#770000"
    }, 250, function() {
        displayText.animate({
            fill: "#dd0000"
        }, 250, displayFlash);
    });
}