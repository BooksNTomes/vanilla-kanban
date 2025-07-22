// Utils
function randomizeId() {
    return Math.round(Math.random(Number.MIN_VALUE / 2, Number.MAX_VALUE / 2)) + Math.round(Math.random(Number.MIN_VALUE, Number.MAX_VALUE) / 2);
}

// Templates
function createDefaultBoard() {
    return {
    name: "default",
    bgColor1: "#FFFFFF",
    bgColor2: "#FFFFFF",
    contents: []
    }
}
function createDefaultSection() {
    return {
        name: "New Section",
        bgColor: "#FFFFFF",
        contents: []
    }
}
function createDefaultTask() {
    return {
        name: "New Task",
        bgColor: "#FFFFFF",
    }
}

// Classes
class Board {
    // Create
    constructor(name, bgColor1, bgColor2, contents){

        this.id = randomizeId(); // Deprecated

        // Board Configuration
        this.name = name !== null? name : 'default';
        this.bgColor1 = bgColor1 !== null? bgColor1 : '#FFFFFF';
        this.bgColor2 = bgColor2 !== null? bgColor2 : '#FFFFFF';

        // Elements
        this.boardName = this.createBoardName(name);
        /* WIP */
        // this.setBoardBgColor1(bgColor1);
        // this.setBoardBgColor2(bgColor2);

        this.openBoardBtn = this.createOpenBoardBtn();
        this.openBoardState = 'closed';
        this.saveBoardBtn = this.createSaveBoardBtn();
        this.configureBoardBtn = this.createConfigureBoardBtn();
        this.newBoardBtn = this.createNewBoardBtn();
        this.addSectionBtn = this.createAddSectionBtn();

        // Popups
        this.uploadContainer = null;
        this.configContainer = null;

        // Section List
        this.contents = contents
    }

    // Edit / Update
    set board([name, bgColor1, bgColor2, contents]){
        if (this.name !== name && name !== null) {
            this.name = name;
            this.setBoardName(name);
        }
        /* WIP */
        // if (this.bgColor1 !== bgColor1) {
        //     this.bgColor1 = bgColor1;
        //     this.setBoardBgColor1(bgColor1);
        // }
        // if (this.bgColor2 !== bgColor2) {
        //     this.bgColor2 = bgColor2;
        //     this.setBoardBgColor2(bgColor2);
        // }
        if (JSON.stringify(this.contents) == JSON.stringify(contents)) {
            this.contents = contents;
        }
    }

    // Read
    get board(){
        return {
            "name" : this.name,
            "bgColor1" : this.bgColor1,
            "bgColor2" : this.bgColor2,
            "contents" : this.contents
        };
    }

    // Read : Render
    render(){
        // create div board container
        var boardContainer = document.createElement("div");
        boardContainer.id = `divBoardContainer`
        boardContainer.classList.add(`board-container`);
        boardContainer.style.backgroundColor = this.bgColor2;
        
        // create child board details container
        var boardDetailsContainer = document.createElement("div");
        boardDetailsContainer.classList.add(`board-details-container`);

        // board button container
        var boardButtonContainer = document.createElement("div");
        boardButtonContainer.classList.add(`board-btn-container`);
        
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
        boardContentsContainer.classList.add('board-contents-container');
        for (var i = 0; i < this.contents.length; i++){
            var section = new Section(this.id, i, this.contents[i].name, this.contents[i].bgColor, this.contents[i].contents);
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

    /* WIP */
    // Insert
    insert(index, section){
        this.contents.splice(index, 0, section)
    }
    pushSection(section){
        const newSection = section
        this.contents.push(newSection)
    }
    // Delete
    pop(){
        this.contents.pop()
    }
    remove(index){
        this.contents.splice(index, 1)
    }

    // Elements
    createBoardName(name){
        var element = document.createElement("h2");
        element.id = 'h2CurrentBoard';
        element.innerHTML = `Current board: ${name}`;
        return element;
    }
    setBoardName(name){
        var element = document.getElementById('h2CurrentBoard');
        element.innerHTML = `Current board: ${name}`;
    }
    /* WIP */
    // setBoardBgColor1(bgColor1){ // Placeholder
    //     var element = document.getElementById('h2CurrentBoard');
    //     element.classList.add(bgColor1);
    // }
    // setBoardBgColor2(bgColor2){ // Placeholder
    //     var element = document.getElementById('h2CurrentBoard');
    //     element.classList.add(bgColor1);
    // }

    // Todo Onclick Functions
    createOpenBoardBtn(){
        var element = document.createElement("button");
        element.id = 'btnOpenBoard';
        element.classList.add();
        element.innerHTML = `Open Board`;
        element.addEventListener('click', (event) => {
            var uploadInput = document.createElement('input');
            uploadInput.type = 'file';
            uploadInput.id = 'fileInput';
            uploadInput.accept = 'json';

            uploadInput.addEventListener('change', (event) => {
                const file = uploadInput.files[0];

                if (file){
                    const reader = new FileReader()
                    reader.onload = function(event) {
                        const data = JSON.parse(event.target.result);
                        board = loadBoard(data);
                        rerender();
                    };
                    reader.readAsText(file);  
                }
            })
            uploadInput.click();
        })
        return element;
    }
    createSaveBoardBtn(){
        var element = document.createElement("button");
        element.id = 'btnSaveBoard';
        element.classList.add();
        element.innerHTML = `Save Board`;
        element.addEventListener('click', (event) =>{
            const filename = "newBoard.json";
            const text = JSON.stringify(this.board);

            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);
            element.click();
        });
        return element;
    }
    createConfigureBoardBtn(){
        var element = document.createElement("button");
        element.id = 'btnConfigureBoard';
        element.classList.add();
        element.innerHTML = `Configure Board`;
        element.addEventListener('click', (event) =>{
            
        });
        return element;
    }
    createNewBoardBtn(){ // Clear board is a more accurate way of calling this
        var element = document.createElement("button");
        element.id = 'btnNewBoard';
        element.classList.add();
        element.innerHTML = `New Board`;
        element.addEventListener('click', (event) => {
            board = loadBoardDefaults();
            rerender();
        });
        return element;
    }
    createAddSectionBtn(){
        var element = document.createElement("button");
        element.id = 'btnAddSection';
        element.classList.add();
        element.innerHTML = `Add Section`;
        element.addEventListener('click', (event) => {

            var params = createDefaultSection();
            params.id = board.contents.length;

            this.pushSection(params);
            rerender();
        })
        return element;
    }

    // Config Container
    createConfigContainer(){

    }
    showConfigContainer(){

    }
    closeConfigContainer(){
        
    }

}
class Section {
    // Create
    constructor(id, index, name, bgColor, contents){
        this.id = randomizeId(); // Deprecated
        this.boardId = id;
        this.index = index;
        this.name = name !== null? name : 'New Section';
        this.bgColor = bgColor !== null? bgColor : '#FFFFFF';

        // Elements
        this.sectionName = this.createSectionName(this.name);
        this.configureSectionBtn = this.createConfigureSectionBtn();
        this.addTaskBtn = this.createAddTaskBtn();

        this.contents = contents;
    }

    // Edit 
    set section([name, bgColor, contents]){
        if (this.name !== name && name !== null) {
            this.name = name;
        }
        /* WIP */
        // if (this.bgColor !== bgColor) {
        //     this.bgColor = bgColor;
        // }
        if (JSON.stringify(this.contents) == JSON.stringify(contents)) {
            this.contents = contents;
        }
    }

    // Read
    get section(){
        return {
            "name" : this.name,
            "id"  : this.id,
            "bgColor" : this.bgColor,
            "contents" : this.contents
        };
    }

    // Read : Render
    render(){
        // create div section container
        var sectionContainer = document.createElement("div");
        sectionContainer.classList.add(`section-container`);
        sectionContainer.style.backgroundColor = this.bgColor;
        
        // create child board details container
        var sectionDetailsContainer = document.createElement("div");
        sectionDetailsContainer.classList.add(`section-details-container`);

        // board button container
        var sectionButtonContainer = document.createElement("div");
        sectionButtonContainer.classList.add(`section-btn-container`);

        // append button container children
        sectionButtonContainer.appendChild(this.configureSectionBtn);

        // append board details container children
        sectionDetailsContainer.appendChild(this.sectionName);
        sectionDetailsContainer.appendChild(sectionButtonContainer);

        // create section contents container
        var sectionContentsContainer = document.createElement("div");
        sectionContentsContainer.classList.add('section-content-container');
        for (var i = 0; i < this.contents.length; i++){
            var task = new Task(this.index, i, this.contents[i].name, this.contents[i].bgColor);
            var taskContainer = task.render()
            sectionContentsContainer.appendChild(taskContainer);
        }
        sectionContainer.appendChild(sectionDetailsContainer);
        sectionContainer.appendChild(sectionContentsContainer);
        sectionContainer.appendChild(this.addTaskBtn);

        return sectionContainer;
    }

    /* WIP */
    // Insert
    insert(index, task){
        this.contents.splice(index, 0, task);
    }
    pushTask(task){
        const newTask = task
        this.contents.push(newTask);
    }
    // Delete
    pop(){
        this.contents.pop();
    }
    remove(index){
        this.contents.splice(index, 1);
    }
    selfDelete(){
        board.remove(this.index)
        rerender()
    }

    // Elements
    createSectionName(name){
        var element = document.createElement("h4");
        element.id = 'h4SectionName';
        element.innerHTML = `${name}`;
        return element;
    }
    setSectionName(name){
        var element = document.getElementById('h4SectionName');
        element.innerHTML = `${name}`;
    }
    /* WIP */
    createConfigureSectionBtn(){
        var element = document.createElement("button");
        element.id = 'configureSectionBtn';
        element.classList.add();
        element.innerHTML = `Configure Section`;
        element.addEventListener('click', (event) => {
            this.selfDelete()
        })
        return element;
    }
    createAddTaskBtn(){
        var element = document.createElement("button");
        element.id = 'addTaskBtn';
        element.classList.add();
        element.innerHTML = `Add Task`;
        element.addEventListener('click', () => {
            var params = createDefaultTask();
            this.pushTask(params);
            rerender()
        })
        return element;
    }

}
class Task {
    // Create
    constructor(sectionIndex, index, name, bgColor,){
        this.id = randomizeId();
        this.index = index;
        this.sectionIndex = sectionIndex;
        this.name = name !== null ? name : 'New Task';
        this.bgColor = bgColor !== null?  bgColor : '#FFFFFF';

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
            "name" : this.name,
            "id" : this.id,
            "bgColor" : this.bgColor,
        };
    }

    // Delete
    selfDelete(){
        const sectionsReference = board.contents;
        for (var i = 0; i < sectionsReference.length; i++){
            if (this.sectionIndex === sectionsReference[i].id) {
                ((board.contents)[i].contents).splice(this.index, 1);
                rerender()
                break
            }
        }
    }

    // Read : Render
    render(){
        // create div section container
        var taskContainer = document.createElement("div");
        taskContainer.classList.add(`task-container`);
        taskContainer.style.backgroundColor = this.bgColor;
        taskContainer.draggable = true;
        
        // create child board details container
        var taskDetailsContainer = document.createElement("div");
        taskDetailsContainer.classList.add(`task-details-container`);

        // board button container
        var taskButtonContainer = document.createElement("div");
        taskButtonContainer.classList.add(`task-btn-container`);

        // append button container children
        taskButtonContainer.appendChild(this.configureTaskBtn);

        // append board details container children
        taskDetailsContainer.appendChild(this.taskName);
        taskDetailsContainer.appendChild(taskButtonContainer);

        // create section contents container
        var taskContentsContainer = document.createElement("div");
        /* FUTURE WIP */
        // // taskContentsContainer.classList.add('task-contents-container');
        // // for (var i = 0; i < this.contents.length; i++){
        // //     var task = Task(this.contents[i]);
        // //     taskContentsContainer.appendChild(task);
        // // }
        taskContainer.appendChild(taskDetailsContainer);
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
    /* WIP */
    createConfigureTaskBtn(){
        var element = document.createElement("button");
        element.id = 'configureTaskBtn';
        element.classList.add();
        element.innerHTML = `Configure Task`;
        element.addEventListener('click', (event) => {
            this.selfDelete()
        })
        return element;
    }
}

// CONCEPTUAL WIP - Non-Global-Variable Implementation
function mainHandler(){  
}

// Loading and Rendering
function load(){
    const thisBoard = loadBoardDefaults();
    renderBoardToMain(thisBoard.render());
    return thisBoard;
} // -> Returns Default Board On Startup

function renderBoardToMain(boardContainer){
    document.getElementById("divMainContainer").appendChild(boardContainer);
}

function rerender(){
    const boardContainer = document.getElementById("divBoardContainer");
    boardContainer.parentNode.removeChild(boardContainer);
    renderBoardToMain(board.render());
}

// Board Loading
function loadBoard(data){
    if (data !== null){
        const returnBoard = new Board(data.name, data.bgColor1, data.bgColor2, data.contents)
    
    return returnBoard
    }
} // -> Returns Loaded Board

function loadBoardDefaults(){
    const boardParams = createDefaultBoard()
    const returnBoard = new Board(boardParams.name, boardParams.bgColor1, boardParams.bgColor2, boardParams.contents)

    return returnBoard
} // -> Returns Default Board

// * Configure Board
// * Configure Section
// * Configure Task
function configurePopup(fields){
}

// * Drag and Drop
function drag(){
}
function drop(){
}

// Main
var board = load();