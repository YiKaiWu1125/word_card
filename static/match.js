let pairs = new Array();
let idCount = 0;
let draggedTarget;
let dropTarget;

let definitions = [
    "Computer Communication and Consumer Electronics 電腦 通訊 及 消費者 電子 產品",
    "Asymmetric Digital Subscriber 使用 電話 線 寬頻 上網 的 技術",
    "Artificial Intelligence 人工智慧",
    "Asynchronous JavaScript and XML Asyncing 互動 式 網頁 開發 技術",
    "Central Processing Unit 中央處理器",
];

let words = ["3C", "ADSL", "AI", "Ajax", "CPU"];
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
    // let word_button = "";
    // let definition_button = "";
    // let timer = new Date();
    // let timeStamp = timer.getTime();
    let game = document.getElementById("game");
    game.addEventListener("dragover", () => allowDrop(event), false);

    for (let i = 0; i < words.length; i++) {
        // word_button = `<button type='button' class='btn btn-outline-primary'>${words[i]}</button>`;
        // definition_button = `<button type='button' class='btn btn-outline-primary'>${definitions[i]}</button>`;
        // timer = new Date();
        // timeStamp = timer.getTime();
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
    console.log(display);
    game.innerHTML = display;
}

function registerEventListener() {
    let wordItem;
    let definitionItem;

    // Register dragging event for all the button element.
    for (let pair of pairs) {
        // console.log(pair);
        wordItem = document.getElementById(pair.word.id);
        definitionItem = document.getElementById(pair.definition.id);
        // console.log(wordItem);
        dragElement(wordItem);
        dragElement(definitionItem);
    }
}
// Code reference: https://www.w3schools.com/howto/howto_js_draggable.asp
function dragElement(elmnt) {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    /* Move the DIV from anywhere inside the DIV:*/
    elmnt.addEventListener("drag", drag, false);
    elmnt.addEventListener("dragover", allowDrop, false);
    elmnt.addEventListener("drop", drop, false);

    function drag(event) {
        console.log("drag");
        draggedTarget = event.target;
        dropTarget = null;
        event.target.style.top = event.y + "px";
        event.target.style.left = event.x + "px";
    }

    function drop(ev) {
        // let data = ev.dataTransfer.getData("text");
        // console.log(draggedTarget);
        // console.log(data);
        // console.log(ev);
        console.log("drop");
        console.log(checkMatch(draggedTarget, dropTarget));
        if (checkMatch(draggedTarget, dropTarget)) {
            console.log("remove");
            draggedTarget.remove();
            dropTarget.remove();
        }

        draggedTarget = null;
    }

    function checkMatch(draggedTarget, dropTarget) {
        console.log("checking...");
        // console.log(draggedTarget);
        // console.log(dropTarget);
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
            console.log(DraggedTargetIdNumber);
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
            console.log(draggedTargetIdNumber);

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
    console.log(dropTarget);
    event.preventDefault();
}

window.addEventListener("load", initIcons, false);
