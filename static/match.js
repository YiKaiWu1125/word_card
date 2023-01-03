let pairs = new Array();
let idCount = 0;
let draggedTarget;
let dropTarget;
let have = 0;
let offsetX;
let offsetY;
let shiftX;
let shiftY;

class Pair {
    constructor(word, definition) {
        this.word = word;
        this.definition = definition;
    }
}

class Word {
    constructor(text, definition, classSelector, idCount, x, y, z) {
        this.text = text;
        this.definition = definition;
        this.CSS = classSelector;
        this.id = idCount;
        this.style = "top:" + y + "px;left:" + x + "px;z-index:" + z + ";";
    }
}

class Definition {
    constructor(text, word, classSelector, idCount, x, y, z) {
        this.text = text;
        this.word = word;
        this.CSS = classSelector;
        this.id = idCount;
        this.style = "top:" + y + "px;left:" + x + "px;z-index:" + z + ";";
    }
}
function initIcons() {
    let x;
    let y;
    let z;
    let x2;
    let y2;
    let z2;
    have = words.length;
    let game = document.getElementById("game");
    game.addEventListener("dragover", () => allowDrop(event), false);

    for (let i = 0; i < words.length; i++) {
        x = Math.floor(100 + Math.random() * 860);
        y = Math.floor(100 + Math.random() * 600);
        z = Math.floor(Math.random() * 30);

        x2 = Math.floor(100 + Math.random() * 860);
        y2 = Math.floor(100 + Math.random() * 600);
        z2 = Math.floor(Math.random() * 30);

        pairs.push(
            new Pair(
                new Word(
                    words[i],
                    definitions[i],
                    "",
                    "word_" + idCount,
                    x,
                    y,
                    z
                ),
                new Definition(
                    definitions[i],
                    words[i],
                    "",
                    "definition_" + idCount,
                    x2,
                    y2,
                    z2
                )
            )
        );
        idCount++;
    }

    display();
    calculateOffset();
    registerEventListener();
}

function display() {
    let buttonPrefix = "<button draggable='true'";
    let buttonPrefix2 =
        "'; type='button' class='btn btn-outline-primary' style = '";
    let buttonPostfix = "</button>";
    let game = document.getElementById("game");
    let display = "";

    for (let i = 0; i < pairs.length; i++) {
        display +=
            buttonPrefix +
            " id = '" +
            pairs[i].word.id +
            buttonPrefix2 +
            "position: absolute; " +
            pairs[i].word.style +
            "'>" +
            pairs[i].word.text +
            buttonPostfix;

        display +=
            buttonPrefix +
            " id = '" +
            pairs[i].definition.id +
            buttonPrefix2 +
            "position: absolute; " +
            pairs[i].definition.style +
            "'>" +
            pairs[i].definition.text +
            buttonPostfix;
    }
    game.innerHTML = display;
}

function registerEventListener() {
    let wordItem;
    let definitionItem;

    // Register dragging event for all the button element.
    for (let pair of pairs) {
        wordItem = document.getElementById(pair.word.id);
        definitionItem = document.getElementById(pair.definition.id);
        dragElement(wordItem);
        dragElement(definitionItem);
    }

    document.addEventListener("scroll", calculateOffset, false);
}
// Code reference: https://www.w3schools.com/howto/howto_js_draggable.asp
// Fix issue #20 reference: https://javascript.info/mouse-drag-and-drop
function dragElement(elmnt) {
    /* Move the DIV from anywhere inside the DIV:*/
    elmnt.addEventListener("dragstart", calculateShift, false);
    elmnt.addEventListener(
        "drag",
        () => drag(event, shiftX, shiftY, offsetX, offsetY),
        false
    );
    elmnt.addEventListener(
        "dragend",
        function () {
            draggedTarget = null;
        },
        false
    );
    // elmnt.addEventListener("dragover", allowDrop, false);
    elmnt.addEventListener("drop", drop, false);

    function calculateShift(event) {
        /* If condition 1: The last DragEvent screenX and screenY are 0 when mouse drag elements too fast and then discard it.
        // The reason of choosing screenX is this is not reasonable screenX = 0 while user zoom in the window and drag the element.
        // If condition 2: The element dragged by user will be the text on the button but not button itself if mouse dragging too fast. 
        // This moment event.toElement.nodeName will be "#text" object in JavaScript 
        */
        if (event.screenX === 0 || event.toElement.nodeName == "#text") {
            draggedTarget = null;
            dropTarget = null;
            return;
        }
        draggedTarget = event.target;
        shiftX = event.clientX - draggedTarget.getBoundingClientRect().x;
        shiftY = event.clientY - draggedTarget.getBoundingClientRect().y;
    }

    function drag(event, shiftX, shiftY, offsetX, offsetY) {
        if (event.screenX === 0 || event.toElement.nodeName == "#text") {
            draggedTarget = null;
            dropTarget = null;
            return;
        }

        dropTarget = null;
        draggedTarget.style.top = event.clientY - shiftY - offsetY + "px";
        draggedTarget.style.left = event.clientX - shiftX - offsetX + "px";
    }

    function drop(event) {
        if (event.toElement.nodeName == "#text") {
            return;
        }
        dropTarget = event.target;
        event.preventDefault();
        if (checkMatch(draggedTarget, dropTarget)) {
            draggedTarget.remove();
            dropTarget.remove();
            have--;
            console.log("have" + have);
            if (have == 0) {
                $("#game").html(
                    "<img src = '../static/gamepass.png' class='d-block mx-auto '/>"
                );
            }
            draggedTarget = null;
            dropTarget = null;
        }

        // draggedTarget = null;
    }

    function checkMatch(draggedTarget, dropTarget) {
        let token = new Array();
        let draggedTargetIdNumber;
        let dropTargetIdNumber;
        let WordPrefix = "word_";
        let DefinitionPrefix = "definition_";

        if (draggedTarget.id.includes(WordPrefix)) {
            token = draggedTarget.id.split(WordPrefix);
            draggedTargetIdNumber = token[1]; // We only use number part of id.
            token = dropTarget.id.split(DefinitionPrefix);
            dropTargetIdNumber = token[1]; // We only use number part of id.
            if (dropTarget.id.includes(WordPrefix)) {
                return false;
            } else {
                if (draggedTargetIdNumber == dropTargetIdNumber)
                    // draggedTarget.definition == dropTarget.word
                    return true;
                return false;
            }
        } else if (draggedTarget.id.includes(DefinitionPrefix)) {
            token = draggedTarget.id.split(DefinitionPrefix);
            draggedTargetIdNumber = token[1]; // We only use number part of id.
            token = dropTarget.id.split(WordPrefix);
            dropTargetIdNumber = token[1]; // We only use number part of id.

            if (dropTarget.id.includes(DefinitionPrefix)) {
                return false;
            } else {
                if (draggedTargetIdNumber == dropTargetIdNumber)
                    // draggedTarget.word == dropTarget.definition
                    return true;
                return false;
            }
        }
    }
}

function allowDrop(event) {
    dropTarget = event.target;
    event.preventDefault();
}

function calculateOffset(event) {
    offsetX = $("#game").offset().left - window.pageXOffset;
    offsetY = $("#game").offset().top - window.pageYOffset;
}
