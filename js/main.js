
var language;
var set = [];
var step = 0;
var keycodes = []
var abc = [
    "A", "B", "C", "D", "E", "F",
    "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R",
    "S", "T", "U", "V", "W", "X",
    "Y", "Z"
]
var wordIndex;
var status = 0;
var statusResponses = [
    "PERFECT",
    "VERY GOOD",
    "GOOD"
]
var pos = 0;
var actualWord = "";
var timer;
var playing = false;
var enter = new Audio();

enter.src = "./sound/enter.mp3";
enter.currentTime = 0.3;
enter.playbackRate = 4;


var clock = new Audio();
clock.src = "./sound/clock.mp3";
clock.loop = true;

var score = new Audio();
score.src = "./sound/score.mp3";
score.playbackRate = 0.8;

var music = new Audio();
music.src = "./sound/music.mp3";
music.volume = 0.02;

var ticking = new Audio();
ticking.src = "./sound/timer.mp3";


if (typeof window.event != 'undefined') {

    document.onkeydown = function () {
        return (event.keyCode != 8);
    }

} else {
    document.onkeydown = function (e) {


        if (playing) {
            switch (e.keyCode) {
                case 13:
                    enter.play();
                    enter.currentTime = 0.3;
                    send().then(function () {
                        $(".bars").remove();
                        $(".status").removeClass("statusAnimate");
                        nextWord();
                    }).catch(function (e) {
                        clock.pause();
                        music.pause();
                        score.play();
                        console.log("GAME OVER");
                        playing = false;
                        $("#actualWord").removeClass("show")
                        $("#timer").addClass("timerAnimate");
                        $("#shares").addClass("show");
                        $("#try").addClass("show");

                    })

                    break;
                case 32:
                    if (actualWord[actualWord.length - 1] != " ") {
                        var letterPressed = " "

                        evaluate(letterPressed);
                    }
                    var key = new Audio();
                    key.src = "./sound/key.mp3";
                    key.currentTime = 0.3;
                    key.playbackRate = 1.5;
                    key.play();
                    break;
                case 8:
                    if (actualWord.length > 0) {
                        deleteLetter()
                        status++;
                    }
                    var key = new Audio();
                    key.src = "./sound/key.mp3";
                    key.currentTime = 0.3;
                    key.playbackRate = 1.5;
                    key.play();
                    break;

                default:

                    var letterPressed = abc[e.keyCode - 65]
                    if (letterPressed != undefined) {
                        var key = new Audio();
                        key.src = "./sound/key.mp3";
                        key.currentTime = 0.3;
                        key.playbackRate = 1.5;
                        key.play();
                        evaluate(letterPressed)
                    }



                    // key.currentTime = 0.3;


                    break;
            }
        }

    };

}


async function evaluate(letterPressed) {
    $(".word").each(function (index) {

        if (letterPressed == $($('> .letter', this)[pos]).text()) {
            $($('> .letter', this)[pos]).addClass("active");
        }

    })
    actualWord = actualWord + letterPressed;
    pos = pos + 1;
    $("#actualWord p").text(actualWord);
    if (actualWord[actualWord.length - 1] == " ") {
        $("#actualWord").addClass("spacing");
    } else {
        $("#actualWord").removeClass("spacing");
    }

}



async function deleteLetter() {
    var letterAux = actualWord[actualWord.length - 1]
    actualWord = actualWord.slice(0, -1);
    $("#actualWord p").text(actualWord)
    pos = pos - 1;

    $(".word").each(function () {
        if (letterAux == $($('> .letter', this)[pos]).text()) {
            $($('> .letter', this)[pos]).removeClass("active");
        }
    })

    if (actualWord[actualWord.length - 1] == " ") {
        $("#actualWord").addClass("spacing");
    } else {
        $("#actualWord").removeClass("spacing");
    }

}

function send() {
    return new Promise(function (resolve, reject) {
        $(".word").each(function (index) {
            if (actualWord[actualWord.length - 1] == " ") {
                actualWord = actualWord.slice(0, -1);
                pos--;
            }
            if ($(this).attr("data-word") == actualWord) {
              
                

                set.splice(wordIndex, 1);
                
                
                step++;
                //STOP GAME
                if (step == 11) {
                    clearInterval(timer);
                    reject()
                }

                $(this).remove()
                $(".bars").addClass("show");
                getStatus();
                var i = 1;
                $(".bar").each(function () {
                    $(this).addClass("active" + i);
                    i++;
                })
                actualWord = "";
                pos = 0;
                $(".active").removeClass("active")
                setTimeout(function () {

                    resolve();
                }, 500)
            } else {
                status++;
            }
        })
        $("#actualWord p").text(actualWord)
    })
}

function getStatus() {

    if (status == 0) {
        //PERFECT
        $("#perfect").addClass("statusAnimate")
    }
    if (status <= 2 && status > 0) {
        //VERY GOOD
        $("#verygood").addClass("statusAnimate")
    }
    if (status > 2) {
        //GOOD
        $("#good").addClass("statusAnimate")
    }
}



async function nextWord() {

    if (step > 4 && step < 8) {
        set = setMid;
    }
    if (step > 8) {
        set = setLong;
    }

    var rand = Math.floor(Math.random() * set.length);
    wordIndex = rand;
    var nextword;
    if (language) {
        nextword = set[rand].spanish;
    } else {
        nextword = set[rand].english;
    }
    status = 0;
    var word = document.createElement("div");
    $(word).addClass("word").attr("data-word", nextword)
    for (let i = 0; i < nextword.length; i++) {
        var letterNode = document.createElement("span")
        $(letterNode).addClass("letter");
        var letter = document.createTextNode(nextword[i])
        letterNode.appendChild(letter)
        word.appendChild(letterNode);
    }
    $(".stage").append(word)
    fireWorksInvoke()
}

async function fireWorksInvoke() {
    $(".stage").append(`<div class="bars">
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
</div>`)
}

function initCounter() {

    var counter = 2;
    $(".counter").addClass("counterAnimate");


    var interval = setInterval(function () {

        $(".counter").text(counter);
        counter--;

        if (counter == -1) {
            clearInterval(interval);
            //START GAME
            set = setShort;
            playing = true;
            nextWord();
            $("#timer, #actualWord").addClass("show");
            initTimer();
            clock.play();
            music.play();
            ticking.pause();
            ticking.currentTime = 0.0;
        }


    }, 1100)

}

function initTimer() {
    var tick = 0;
    var sec = 0;
    timer = setInterval(function () {
        if (sec == 10) {
            //clearInterval(timer)
        }
        if (tick / 10 < 10) {

            $("#timer_mill").text("0" + tick / 10);
        } else {
            $("#timer_mill").text(tick / 10);
        }


        tick += 10;
        if (tick == 1000) {
            sec++;
            $("#timer_sec").text(sec);
            tick = 0;
            //clearInterval(timer)
        }

    }, 10)
}

function readyTo() {

    var aux = "HOW FAST CAN U TYPE ?";
    var word = "";
    var counter = 0;
    var interval = setInterval(function () {

        word = word + aux[counter];
        $("#ready_txt").text(word);
        counter++;
        if (counter == 21) {
            clearInterval(interval);

        }
    }, 100);
}

readyTo()


$("#ready_spanish").click(function () {
    language = 1;
    $("#ready").addClass("hide");
    initCounter();
    ticking.play();
})
$("#ready_english").click(function () {
    language = 0;
    $("#ready").addClass("hide");
    initCounter();
    ticking.play();
})

$("#try").click(function () {
    $(".bars").remove();

    $(".counter").removeClass("counterAnimate")
    $(".counter").text("3")
    $("#actualWord").removeClass("show")
    $("#timer").removeClass("timerAnimate");
    $("#shares").removeClass("show");
    $("#try").removeClass("show");
    $("#timer_mill").text("00");
    $("#timer_sec").text("0");
    // $("#timer").removeClass("show")


    step = 0;
    pos = 0;
    actualWord = "";
    playing = false;

    setTimeout(function () {
        initCounter();
        ticking.play();
    }, 100)
})
