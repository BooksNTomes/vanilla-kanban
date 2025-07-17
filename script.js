
// Classes / Models

// Board Elements
// var openBoardBtn = document.getElementById("openBoardBtn");
// var saveBoardBtn = document.getElementById("saveBoardBtn");
// var configureBoardBtn = document.getElementById("configureBoardBtn");

// var newBoardBtn = document.getElementById("newBoardBtn");

// var boardName = document.getElementById("boardName");
// var boardBgColor1 = document.getElementById("boardBgColor1");
// var boardBgColor2 = document.getElementById("boardBgColor2");
// var addSectionBtn = document.getElementById("addSectionBtn");

// Todo Incorporate Containers
class Board {
    // Create
    constructor(name, bgColor1, bgColor2){
        // Id
        this.id = randomizeId();

        // Board Configuration
        this.name = name !== null? name : 'default';
        this.bgColor1 = bgColor1 !== null? bgColor1 : '#FFFFFF';
        this.bgColor2 = bgColor2 !== null? bgColor2 : '#FFFFFF';

        // Elements
        this.openBoardBtn = createOpenBoardBtn();
        this.saveBoardBtn = createSaveBoardBtn();
        this.configureBoardBtn = createConfigureBoardBtn();
        this.newBoardBtn = createNewBoardBtn();
        this.addSectionBtn = createAddSectionBtn();

        this.boardName = createBoardName(name);
        setBoardBgColor1(bgColor1);
        setBoardBgColor2(bgColor2);

        // Section List
        this.contents = []
    }

    // Edit
    set board([name, bgColor1, bgColor2]){
        if (this.name !== name && name !== null) {
            this.name = name;
            setBoardName(name);
        }
        if (this.bgColor1 !== bgColor1) {
            this.bgColor1 = bgColor1;
            setBoardBgColor1(bgColor1);
        }
        if (this.bgColor2 !== bgColor2) {
            this.bgColor2 = bgColor2;
            setBoardBgColor2(bgColor2);
        }
    }

    // Read
    get board(){
        return {
            "board-name" : this.name,
            "bg-color1" : this.bgColor1,
            "bg-color2" : this.bgColor2,
            "contents" : this.contents
        };
    }

    // Insert
    insertToBoard(index, section){
        this.contents.splice(index, 0, section)
    }
    pushToBoard(section){
        this.contents.push(section)
    }
    
    // Delete
    popFromBoard(){
        this.contents.pop()
    }
    removeFromBoard(index){
        this.contents.splice(index, 1)
    }

    // Elements
    // Todo Refer to Board Container
    createBoardName(name){
        var element = document.createElement("h2");
        element.id = 'h2CurrentBoard';
        element.innerHTML = `Current board: ${name}`;
        return element;
    }
    setBoardName(name){ // Placeholder
        var element = document.getElementById('h2CurrentBoard');
        element.innerHTML = `Current board: ${name}`;
    }
    setBoardBgColor1(bgColor1){ // Placeholder
        var element = document.getElementById('h2CurrentBoard');
        element.classList = bgColor1;
    }
    setBoardBgColor2(bgColor2){ // Placeholder
        var element = document.getElementById('h2CurrentBoard');
        element.classList = bgColor1;
    }

    // Todo Onclick Functions
    createOpenBoardBtn(){
        var element = document.createElement("button");
        element.id = 'openBoardBtn'; // Placeholder
        element.classList = ''; // Placeholder
        element.innerHTML = `Open Board`;
        return element;
    }
    createSaveBoardBtn(){
        var element = document.createElement("button");
        element.id = 'saveBoardBtn'; // Placeholder
        element.classList = ''; // Placeholder
        element.innerHTML = `Save Board`;
        return element;
    }
    createConfigureBoardBtn(){
        var element = document.createElement("button");
        element.id = 'configureBoardBtn'; // Placeholder
        element.classList = ''; // Placeholder
        element.innerHTML = `Configure Board`;
        return element;
    }
    createNewBoardBtn(){
        var element = document.createElement("button");
        element.id = 'newBoardBtn'; // Placeholder
        element.classList = ''; // Placeholder
        element.innerHTML = `New Board`;
        return element;
    }
    createAddSectionBtn(){
        var element = document.createElement("button");
        element.id = 'addSectionBtn'; // Placeholder
        element.classList = ''; // Placeholder
        element.innerHTML = `Add Section`;
        return element;
    }

}

// Section Elements
var configureSectionBtn = document.getElementById("configureSectionBtn");
var addTaskBtn = document.getElementById("addTaskBtn");

class Section {
    // Create
    constructor(name, id){
        this.id = randomizeId();
        this.boardId = id;
        this.name = name;
        this.bgColor = '#FFFFFF';
        this.contents = [];
    }

    // Edit 
    set section([name, bgColor]){
        if (this.name !== name && name !== null) {
            this.name = name;
        }
        if (this.bgColor !== bgColor) {
            this.bgColor = bgColor;
        }
    }

    // Read
    get section(){
        return {
            "board-name" : this.name,
            "bg-color" : this.bgColor,
            "contents" : this.contents
        };
    }

    // Insert
    insertToSection(index, task){
        this.contents.splice(index, 0, task);
    }
    pushToSection(section){
        this.contents.push(task);
    }

    // Delete
    popFromSection(){
        this.contents.pop();
    }
    removeFromSection(index){
        this.contents.splice(index, 1);
    }

    // Elements

}

// Task Elements
var configureTaskBtn = document.getElementById("configureTaskBtn");

class Task {
    // Create
    constructor(name, id){
        this.id = randomizeId();
        this.sectionId = id;
        this.name = name;
        this.bgColor = '#FFFFFF';
    }

    // Edit
    set task([name, bgColor]){
        if (this.name !== name && name !== null) {
            this.name = name;
        }
        if (this.bgColor !== bgColor) {
            this.bgColor = bgColor;
        }
    }

    // Read
    get task(){
        return {
            "board-name" : this.name,
            "bg-color" : this.bgColor,
        };
    }

    // Elements

}

// Create Functions
// * Add Section
function addSection(){

}
// * Add Task
function addTask(){

}

// Read Functions
// * Load Json Data
function loadJson(){

}
// * Parse Json Data
function parseJson(json){

}
// * Save Json Data
function saveJson(json){

}
// * Load Board Template
function loadBoard(name){
    var loadedBoardName = name !== null ? name : 'default'
}

// Update Functions
// * Drag and Drop
function drag(){

}
function drop(){

}
// * Configure Board
// * Configure Section
// * Configure Task
function configurePopup(fields){

}

// Utility
function randomizeId() {
    return Math.round(Math.random(Number.MIN_VALUE / 2, Number.MAX_VALUE / 2)) + Math.round(Math.random(Number.MIN_VALUE, Number.MAX_VALUE) / 2);
}