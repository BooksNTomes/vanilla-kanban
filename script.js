
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

/* Procedure for creating board and section contents
    for (var i = 0; i < this.contents.length; i++){
        
        1. Unpack section's contents as its arguments
            contents is an array / list of objects
                unpack contents by using . operator
        2. Use section's contents as arguments to Section constructor
        3. Create Section DOM using render function
        4. Append
    
        var section = Section(this.contents[i]);    
        boardContentsContainer.appendChild(section);
    }
*/

/* */

/* Buttons Implementation Procedure */

// Classes / Models

// Board Model Progress:
/*
    - creation                  X
        - constructor       x
    - read                      X
        - as json           x
        - rendering         x
    - update                    X
        - basic parameters  x
        - contents          x
    - delete                    X
*/

defaultBoard = {
    name: "default",
    bgColor1: "#FFFFFF",
    bgColor2: "#FFFFFF",
    contents: []
}

defaultSection = {
    name: "New Section",
    bgColor: "#FFFFFF",
    contents: []
}

defaultTask = {
    name: "New Task",
    bgColor: "#FFFFFF",
}

class Board {
    // Create
    constructor(name, bgColor1, bgColor2, contents){

        this.id = randomizeId();

        // Board Configuration
        this.name = name !== null? name : 'default';
        this.bgColor1 = bgColor1 !== null? bgColor1 : '#FFFFFF';
        this.bgColor2 = bgColor2 !== null? bgColor2 : '#FFFFFF';

        // Elements
        this.boardName = this.createBoardName(name);
        this.setBoardBgColor1(bgColor1);
        this.setBoardBgColor2(bgColor2);

        this.openBoardBtn = this.createOpenBoardBtn();
        this.saveBoardBtn = this.createSaveBoardBtn();
        this.configureBoardBtn = this.createConfigureBoardBtn();
        this.newBoardBtn = this.createNewBoardBtn();
        this.addSectionBtn = this.createAddSectionBtn();

        // Section List
        this.contents = contents
    }

    // Edit / Update
    set board([name, bgColor1, bgColor2, contents]){
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
        if (JSON.stringify(this.contents) == JSON.stringify(contents)) {
            this.contents = contents;
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
    render(){
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
            var section = Section(this.id, this.contents[i].name, this.contents[i].bgColor, this.contents[i].contents);
            var sectionContainer = section.render();
            boardContentsContainer.appendChild(sectionContainer);
        }
        boardContainer.appendChild(boardDetailsContainer);
        boardContainer.appendChild(this.addSectionBtn);
        boardContainer.appendChild(boardContentsContainer);

        // // Only for prototyping, add this to main functions
        // document.getElementById("main-container").appendChild(boardContainer)

        return boardContainer
    }

    // Insert
    insert(index, section){
        this.contents.splice(index, 0, section)
    }
    push(section){
        this.contents.push(section)
    }
    
    // Delete
    pop(){
        this.contents.pop()
    }
    remove(index){
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

class Section {
    // Create
    constructor(id, name, bgColor, contents){
        this.id = randomizeId();
        this.boardId = id;
        this.name = name;
        this.bgColor = '#FFFFFF';

        // Elements
        this.sectionName = this.createSectionName(name);
        this.configureSectionBtn = this.createConfigureSectionBtn();
        this.addTaskBtn = this.createAddTaskBtn();

        this.contents = contents;
    }

    // Edit 
    set section([name, bgColor, contents]){
        if (this.name !== name && name !== null) {
            this.name = name;
        }
        if (this.bgColor !== bgColor) {
            this.bgColor = bgColor;
        }
        if (JSON.stringify(this.contents) == JSON.stringify(contents)) {
            this.contents = contents;
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

    // Read : Render
    render(){
        // create div section container
        var sectionContainer = document.createElement("div");
        sectionContainer.classList = `section-container`;
        sectionContainer.style.backgroundColor = this.bgColor;
        
        // create child board details container
        var sectionDetailsContainer = document.createElement("div");
        sectionDetailsContainer.classList = `section-details-container`;
        // board button container
        var sectionButtonContainer = document.createElement("div");
        sectionButtonContainer.classlist = `section-btn-container`;
        // append button container children
        sectionButtonContainer.appendChild(this.configureSectionBtn);
        // append board details container children
        sectionDetailsContainer.appendChild(this.sectionName);
        sectionDetailsContainer.appendChild(sectionButtonContainer);
        // create section contents container
        var sectionContentsContainer = document.createElement("div");
        sectionContentsContainer.classList = 'section-contents-container';
        for (var i = 0; i < this.contents.length; i++){
            var task = Task(this.contents[i]);
            sectionContentsContainer.appendChild(task);
        }
        sectionContainer.appendChild(sectionDetailsContainer);
        sectionContainer.appendChild(this.addSectionBtn);
        sectionContainer.appendChild(sectionContentsContainer);

        return sectionContainer;
    }

    // Insert
    insert(index, task){
        this.contents.splice(index, 0, task);
    }
    push(section){
        this.contents.push(task);
    }

    // Delete
    pop(){
        this.contents.pop();
    }
    remove(index){
        this.contents.splice(index, 1);
    }

    // Elements
    createSectionName(name){
        var element = document.createElement("h2");
        element.id = 'h4SectionName';
        element.innerHTML = `${name}`;
        return element;
    }
    setSectionName(name){
        var element = document.getElementById('h4SectionName');
        element.innerHTML = `${name}`;
    }
    createConfigureSectionBtn(){
        var element = document.createElement("button");
        element.id = 'configureSectionBtn';
        element.classList = ''; // Placeholder
        element.innerHTML = `Configure Section`;
        return element;
    }
    createAddTaskBtn(){
        var element = document.createElement("button");
        element.id = 'addTaskBtn';
        element.classList = ''; // Placeholder
        element.innerHTML = `Add Task`;
        return element;
    }

}

class Task {
    // Create
    constructor(id, name){
        this.id = randomizeId();
        this.sectionId = id;
        this.name = name;
        this.bgColor = '#FFFFFF';

        this.taskName = this.createTaskName(name);
        this.configureTaskBtn = this.createConfigureTaskBtn();
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

    // Read : Render
    render(){
        // create div section container
        var taskContainer = document.createElement("div");
        taskContainer.classList = `task-container`;
        taskContainer.style.backgroundColor = this.bgColor;
        
        // create child board details container
        var taskDetailsContainer = document.createElement("div");
        taskDetailsContainer.classList = `task-details-container`;
        // board button container
        var taskButtonContainer = document.createElement("div");
        taskButtonContainer.classlist = `task-btn-container`;
        // append button container children
        taskButtonContainer.appendChild(this.configureTaskBtn);
        // append board details container children
        taskDetailsContainer.appendChild(this.taskName);
        taskDetailsContainer.appendChild(taskButtonContainer);
        // create section contents container
        var taskContentsContainer = document.createElement("div");
        taskContentsContainer.classList = 'task-contents-container';
        for (var i = 0; i < this.contents.length; i++){
            var task = Task(this.contents[i]);
            taskContentsContainer.appendChild(task);
        }
        taskContainer.appendChild(taskDetailsContainer);
        taskContainer.appendChild(this.addTaskBtn);
        taskContainer.appendChild(taskContentsContainer);

        return taskContainer;
    }

    // Elements
    createTaskName(name){
        var element = document.createElement("p");
        element.id = 'taskname';
        element.innerHTML = `${name}`;
        return element;
    }
    createConfigureTaskBtn(){
        var element = document.createElement("button");
        element.id = 'configureTaskBtn';
        element.classList = ''; // Placeholder
        element.innerHTML = `Configure Task`;
        return element;
    }
}

// Create Functions
// * Add Section
function addSection(board, section){
    section = defaultSection;
    board.push(section);
    return board.render();
}
// * Add Task
function addTask(section, task){
    task = defaultTask;
    section.push(task);
    return section.render();
}

// Read Functions
// * Fetch Json Data
async function fetchBoardJsonData(jsonfile){
    var jsonfile = jsonfile !== null? jsonfile : 'board.json'
    const response = await fetch(jsonfile)
    const data = await response.json()
    return data
}
// * Load Board Template
function loadBoard(data){
    var board = new Board(defaultBoard.name, defaultBoard.bgColor1, defaultBoard.bgColor2, defaultBoard.contents)
    var boardContainer = board.render()
    if (data !== null){
        board = new Board(data.name, data.bgColor1, data.bgColor2, data.contents)
        boardContainer = board.render()
    }
    document.getElementById("main-container").appendChild(boardContainer);
}
function reRenderBoard(board, oldBoardContainer){
    document.getElementById("main-container").removeChild(oldBoardContainer);
    var boardContainer = board.render();
    document.getElementById("main-container").appendChild(boardContainer);
}
// * Parse Json Data
function parseModelsToJson(board){
    return board.board
}
// * Save Json Data
function saveJson(boardJson){
    const FileSystem = require("fs");
    FileSystem.writeFile('board.json', JSON.stringify(proj), (error) => {
        if (error) throw error;
    });
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