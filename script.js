
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


/* HTML DOM Structure
Board:
    - div class board-container
        - div class board-details-container
            - board name - h2
            - div class board-btn-container
                - Open Board
                - Save Board
                - Configure Board
        - button id btnAddSection
        - div class board-contents-container
            - contents:
Section:
    - div class section-container
        - div class section-details container
            - section name - h4
            - div class section-btn-container
                - Configure Section
        - button id btnAddTask
Task:
    - div class task-container
        - div class task-details-container
            - task name p
            - div class task-btn-container
                - Configure Board
*/

/* JSON Design
{
    "board-name": "Default",
    "bg-color1": "white",
    "bg-color2": "#FFFFFF",
    "content": [
        {
            "section-name": "Section 1",
            "bg-color": "#FFFFFF",
            "content": [
                {
                    "task-name": "Task 1",
                    "bg-color": "#FFFFFF"
                }
            ]
        }
    ]
}

Procedure:
    - Create Board:
        create div board-container 
            - set color to bgcolor 2
            create children board details container
                - create board name -h2 "board-name"
                create children div boardbuttoncontainer
                    create children open board
                    create children save board
                    create children configure board
            create children button addsection
            create children div boardcontentscontainer
                create children contents
                - create new section classes based on list/array
    - Create Section:
        create div section-container
            create children div section-details container
                create section name - h4
                create children div section-btn-container
                    create configure section button
            create button id btnAddTask
    - Create Task:
        create div task-container
            create children task-details-container
                - task name p
                - div class task-btn-container
                    Configure Board

set header color to bgcolor1
set main color to bgcolor2

alternative method, add classlist
*/

class Board {
    // Create
    constructor(name, bgColor1, bgColor2){

        this.id = randomizeId();

        // Board Configuration
        this.name = name !== null? name : 'default';
        this.bgColor1 = bgColor1 !== null? bgColor1 : '#FFFFFF';
        this.bgColor2 = bgColor2 !== null? bgColor2 : '#FFFFFF';

        // Elements
        this.boardName = this.createBoardName(name);
        setBoardBgColor1(bgColor1);
        setBoardBgColor2(bgColor2);

        this.openBoardBtn = this.createOpenBoardBtn();
        this.saveBoardBtn = this.createSaveBoardBtn();
        this.configureBoardBtn = this.createConfigureBoardBtn();
        this.newBoardBtn = this.createNewBoardBtn();
        this.addSectionBtn = this.createAddSectionBtn();

        // Section List
        this.contents = []
    }

    // Edit / Update
    set board([name, bgColor1, bgColor2]){
        if (this.name !== name && name !== null) {
            this.name = name;
            this.setBoardName(name);
        }
        if (this.bgColor1 !== bgColor1) {
            this.bgColor1 = bgColor1;
            this.setBoardBgColor1(bgColor1);
        }
        if (this.bgColor2 !== bgColor2) {
            this.bgColor2 = bgColor2;
            this.setBoardBgColor2(bgColor2);
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

    // Read : Render
    render_board(){

        // create div board container
        var boardContainer = document.createElement("div");
        boardContainer.classList = `board-container`;
        boardContainer.style.backgroundColor = this.bgColor2;
        
        // create child board details container
        var boardDetailsContainer = document.createElement("div");
        boardDetailsContainer.classList = `board-details-container`;
        // board button container
        var boardButtonContainer = document.createElement("div");
        boardButtonContainer.classlist = `board-btn-container`;
        // append button container children
        boardButtonContainer.appendChild(this.openBoardBtn);
        boardButtonContainer.appendChild(this.saveBoardBtn);
        boardButtonContainer.appendChild(this.configureBoardBtn);
        boardButtonContainer.appendChild(this.newBoardBtn);
        // append board details container children
        boardDetailsContainer.appendChild(this.boardName);
        boardDetailsContainer.appendChild(boardButtonContainer);
        // create board contents container
        var boardContentsContainer = document.createElement("div");
        boardContentsContainer.classList = 'board-contents-container';
        for (var i = 0; i < this.contents.length; i++){
            var section = Section(this.contents[i]);
            boardContentsContainer.appendChild(section);
        }
        boardContainer.appendChild(boardDetailsContainer);
        boardContainer.appendChild(this.addSectionBtn);
        boardContainer.appendChild(boardContentsContainer);

        document.getElementById("main-container").appendChild(boardContainer)
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