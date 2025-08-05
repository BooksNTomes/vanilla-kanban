// Utils
function randomizeId() {
    return Math.round(Math.random(Number.MIN_VALUE / 2, Number.MAX_VALUE / 2)) + Math.round(Math.random(Number.MIN_VALUE, Number.MAX_VALUE) / 2);
}
function openOverlay(){
    const divOverlay = document.getElementById("divOverlay")
    divOverlay.style.display = 'block';
}
function closeOverlay(){
    const divOverlay = document.getElementById("divOverlay")
    divOverlay.style.display = 'none';
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


/* REFACTORING : Rewriting Classes
Objectives:
- Adding Parent References to access parent for editing
- CRUD Function Rewrites
- Moving on from using Global Variable for Update/Delete Functions

BRAINSTORMING:
    Understanding: Board, Section, Task, Etc. Classes serve for JSON -> Rendering 
    Maybe we will:
        - Rewrite Board, Section, Task, Etc. Classes
            - We'll start with the generic objects first
            - Then we'll make a Board Class that:
                - takes the board object as its constructor parameter (old implementation: gets each attribute as constructor parameter)
                - has a .json attribute containing the object parameter
    // BUT how does it work for the child elements???
    // We might have to make dedicated global functions not chained to each element?

Upon review, it seems that the array update functions do work without calling the global variable? Internet consultation shows:
    - Objects are passed by reference, so why not have all constructors be passed with the object itself?
    - It fixes the parent reference issue
    - It also fixes the crud functions
    - And, it does not rely on global variable calling
    - IT might solve EVERYTHING. I just need to implement it!
*/

/* Refactoring Classes:
- Redo Constructor Implementation
- Red Crud Functions
Objective:
- Avoid reliance on global variable calling for updating and deleting
*/

class BoardRefactored {
    // create
    constructor(board){
        this.board = board;
        this.domConstructor();

        // add parent container references
        if (this.contents !== undefined && Array.isArray(this.contents)){
            this.contents.forEach(content => {
                content.board = this.board.contents;
            });
        }
    }
    domConstructor(){
        // board states
        this.openBoardState = 'closed';                             // to review

        // board buttons
        this.openBoardBtn = this.createOpenBoardBtn();
        this.saveBoardBtn = this.createSaveBoardBtn();
        this.configureBoardBtn = this.createConfigureBoardBtn();
        this.newBoardBtn = this.createNewBoardBtn();
        this.addSectionBtn = this.createAddSectionBtn();
        
        // containers
        // boardContainer [Main Container]
        this.boardContainer = document.createElement("div");
        this.boardContainer.id = `divBoardContainer`
        this.boardContainer.classList.add(`board-container`);
        this.setBoardBgColor1(this.board.bgColor1);
        this.setBoardBgColor2(this.board.bgColor2);
        
        // update configurable attributes (name etc.)
        this.boardName = this.createBoardName(this.board.name);
        // ...
        
        // boardDetailsContainer
        this.boardDetailsContainer = document.createElement("div");
        this.boardDetailsContainer.classList.add(`board-details-container`);

        // boardButtonContainer
        this.boardButtonContainer = document.createElement("div");
        this.boardButtonContainer.classList.add(`board-btn-container`);

        // append buttonContainer children
        this.boardButtonContainer.appendChild(this.openBoardBtn);
        this.boardButtonContainer.appendChild(this.saveBoardBtn);
        this.boardButtonContainer.appendChild(this.configureBoardBtn);
        this.boardButtonContainer.appendChild(this.newBoardBtn);
        
        // append boardDetailsContainer children
        this.boardDetailsContainer.appendChild(this.boardName);
        this.boardDetailsContainer.appendChild(this.boardButtonContainer);
        
        // createBoardContentsContainer
        this.boardContentsContainer = document.createElement("div");
        this.boardContentsContainer.classList.add('board-contents-container');
        for (var i = 0; i < this.contents.length; i++){
            var section = new Section(this.contents[i]);
            var sectionContainer = section.render();
            this.boardContentsContainer.appendChild(sectionContainer);
        }
        
        // append boardContainer children
        this.boardContainer.appendChild(boardDetailsContainer);
        this.boardContainer.appendChild(this.addSectionBtn);
        this.boardContainer.appendChild(boardContentsContainer);
    }
    
    createBoardName(name){
        var element = document.createElement("h2");
        element.id = 'h2CurrentBoard';
        element.innerHTML = `Current board: ${name}`;
        return element;
    }

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
                        this.board = loadBoard(data);
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
            this.openConfig();
        });
        return element;
    }
    createNewBoardBtn(){
        var element = document.createElement("button");
        element.id = 'btnNewBoard';
        element.classList.add();
        element.innerHTML = `New Board`;
        element.addEventListener('click', (event) => {
            this.board = loadBoardDefaults();
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
            params.id = this.board.contents.length;

            this.pushSection(params);
            rerender();
        })
        return element;
    }
    
    // read
    getJson(){
        return this.board;
    }
    render(){
        this.domConstructor();

        return boardContainer;
    }
    
    // update
    insertSection(index, section){
        this.board.contents.splice(index, 0, section)
    }
    pushSection(section){
        this.board.contents.push(section)
    }

    // Note: it seems that most is at the openConfig Function. After all, after setting things, we rerender resulting in an updated dom.
    setBoardName(name){                                             // to review; might be deprecated
        var element = document.getElementById('h2CurrentBoard');
        element.innerHTML = `Current board: ${name}`;
    }
    setBoardBgColor1(bgColor1){                                     // to review; might be deprecated
        var element = document.getElementById('header');
        element.backgroundColor = bgColor1;
    }
    setBoardBgColor2(bgColor2){                                     // to review; might be deprecated
        var element = document.getElementById('divBoardContainer');
        element.backgroundColor = bgColor2;
    }

    setBoardNameElement(){}
    setBoardBgColor1Element(){}
    setBoardBgColor2Element(){}

    // TODO : deconstruct config with creating setter elements
    // TODO : find a way to deconstruct the saving/updating of the board parameters
    openConfig(){
        var divPopup = document.createElement('div');
        divPopup.classList.add('popup-container');

        var pNameLabel = document.createElement('p');
        pNameLabel.innerHTML = `Current name: ${this.board.name}`

        var inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.id = 'inputText'
        inputName.placeholder = 'new name'

        var divPopupBtnContainer = document.createElement('div');
        divPopupBtnContainer.classList.add('popup-btn-container');

        var btnSave = document.createElement('button');
        btnSave.id = 'btnSave';
        btnSave.innerHTML = 'Save'
        btnSave.addEventListener('click', (event) => {
            if (inputName.value !== '') {
                this.board.name = inputName.value;
                
                divPopup.parentNode.removeChild(divPopup);
                closeOverlay();
                rerender();
            }
        })

        var btnClose = document.createElement('button');
        btnClose.id = 'btnClose';
        btnClose.innerHTML = 'Close'
        btnClose.addEventListener('click', (event) => {
            divPopup.parentNode.removeChild(divPopup);
            closeOverlay();
        })

        divPopupBtnContainer.appendChild(btnSave);
        divPopupBtnContainer.appendChild(btnClose);

        divPopup.appendChild(pNameLabel);
        divPopup.appendChild(inputName);
        divPopup.appendChild(divPopupBtnContainer);

        document.getElementById('divMainContainer').appendChild(divPopup);

        openOverlay();
    }
    
    // delete
    popSection(){
        this.board.contents.pop()
    }
    removeSection(section){
        this.board.contents.remove(section);
    }
}

class SectionRefactored {
    // create
    constructor(section){
        this.section = section;
        this.domConstructor();

        // add parent json references
        if (this.contents !== undefined && Array.isArray(this.contents)){
            this.contents.forEach(content => {
                content.section = this.section;
            });
        }
    }
    domConstructor(){
        this.configureSectionBtn = this.createConfigureSectionBtn();
        this.addTaskBtn = this.createAddTaskBtn();
    }

    createSectionName(name){
        var element = document.createElement("h4");
        element.id = 'h4SectionName';
        element.innerHTML = `${name}`;
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
    createConfigureSectionBtn(){
        var element = document.createElement("button");
        element.id = 'configureSectionBtn';
        element.classList.add();
        element.innerHTML = `Configure Section`;
        element.addEventListener('click', (event) => {
            this.openConfig();
        })
        return element;
    }

    // read
    getJson(){
        return this.section;
    }
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
        this.sectionContentsContainer = document.createElement("div");
        this.sectionContentsContainer.classList.add('section-content-container');
        this.sectionContentsContainer.classList.add(`SNo.${this.index}`)
        this.sectionContentsContainer.classList.add(`droppable-for-task`);
        this.sectionContentsContainer.addEventListener("dragover", (event) => {
            event.preventDefault();

            this.bottomTask = this.insertAboveTask(this.sectionContentsContainer, event.clientY);
            this.draggingTask = document.querySelector(".is-dragging");
            
            if (!this.bottomTask){
                this.sectionContentsContainer.appendChild(this.draggingTask);
            } else {
                this.sectionContentsContainer.insertBefore(this.draggingTask, this.bottomTask);
            };
        });
        this.sectionContentsContainer.addEventListener("drop", (event) => {
            event.preventDefault();

            const draggingTaskSectionIndex = Number(this.draggingTask.classList[1].slice(4,));
            const draggingTaskIndex = Number(this.draggingTask.classList[2].slice(4,));
            const prevTaskIndex = draggingTaskIndex;

            if (!this.bottomTask){
                // Update Board JSON
                // * Append to end
                board.contents[this.index].contents.push(board.contents[draggingTaskSectionIndex].contents[draggingTaskIndex]);
                // * Delete element at index
                board.contents[draggingTaskSectionIndex].contents.splice(draggingTaskIndex, 1)

                rerender();
            } else {
                // Update Board JSON
                const bottomTaskIndex = Number(this.bottomTask.classList[2].slice(4,))
                // * Append before bottom
                board.contents[this.index].contents.splice(bottomTaskIndex, 0, board.contents[draggingTaskSectionIndex].contents[draggingTaskIndex]);
                // * Delete element at index
                if(bottomTaskIndex < draggingTaskIndex){
                    board.contents[draggingTaskSectionIndex].contents.splice(draggingTaskIndex+1, 1)
                }
                else{
                    board.contents[draggingTaskSectionIndex].contents.splice(draggingTaskIndex, 1)
                }

                rerender();
            };
        })

        for (var i = 0; i < this.contents.length; i++){
            var task = new Task(this.contents[i]);
            var taskContainer = task.render()
            this.sectionContentsContainer.appendChild(taskContainer);
        }
        sectionContainer.appendChild(sectionDetailsContainer);
        sectionContainer.appendChild(this.sectionContentsContainer);
        sectionContainer.appendChild(this.addTaskBtn);

        return sectionContainer;   
    }

    // update
    insert(index, task){
        this.contents.splice(index, 0, task);
    }
    insertAboveTask(sectionContentsContainer, mouseY) {
        const eventListener = sectionContentsContainer.querySelectorAll('.draggable-to-section:not(.is-dragging)');

        var closestTask = null;
        var closestOffset = Number.NEGATIVE_INFINITY;

        eventListener.forEach((taskContainers) => {
            const { top } = taskContainers.getBoundingClientRect();

            const offset = mouseY - top;

            if (offset < 0 && offset > closestOffset) {
                closestOffset = offset;
                closestTask = taskContainers;
            };
        });
        return closestTask;
    }
    pushTask(task){
        const newTask = task
        this.contents.push(newTask);
    }

    setSectionName(name){
        var element = document.getElementById('h4SectionName');
        element.innerHTML = `${name}`;
    }
    setSectionBgColor(bgColor){
        // var element = document.getElementById('divSectionContainer');
        // element.backgroundColor = bgColor1;
    }
    openConfig(){
        var divPopup = document.createElement('div');
        divPopup.classList.add('popup-container');

        var pNameLabel = document.createElement('p');
        pNameLabel.innerHTML = `Current name: ${this.name}`

        var inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.id = 'inputText'
        inputName.placeholder = 'new name'

        var divPopupBtnContainer = document.createElement('div');
        divPopupBtnContainer.classList.add('popup-btn-container');

        var btnSave = document.createElement('button');
        btnSave.id = 'btnSave';
        btnSave.innerHTML = 'Save'
        btnSave.addEventListener('click', (event) => {
            if (inputName.value !== '') {
                board.contents[this.index].name = inputName.value;
                // this.sectionLabel = inputName.value;
                divPopup.parentNode.removeChild(divPopup);
                closeOverlay();
                rerender();
            }
        })

        var btnDelete = document.createElement('button');
        btnDelete.id = 'btnDelete';
        btnDelete.innerHTML = 'Delete';
        btnDelete.addEventListener('click', (event) => {
            this.selfDelete();

            divPopup.parentNode.removeChild(divPopup);
                closeOverlay();
                rerender();
        })

        var btnClose = document.createElement('button');
        btnClose.id = 'btnClose';
        btnClose.innerHTML = 'Close'
        btnClose.addEventListener('click', (event) => {
            divPopup.parentNode.removeChild(divPopup);
            closeOverlay();
        })

        divPopupBtnContainer.appendChild(btnSave);
        divPopupBtnContainer.appendChild(btnDelete);
        divPopupBtnContainer.appendChild(btnClose);

        divPopup.appendChild(pNameLabel);
        divPopup.appendChild(inputName);
        divPopup.appendChild(divPopupBtnContainer);

        document.getElementById('divMainContainer').appendChild(divPopup);

        openOverlay();
    }
    
    // delete
    popTask(){
        this.section.contents.pop();
    }
    removeTask(task){
        this.section.contents.remove(task);
    }
    removeSelf(){
        this.board.remove(this.section)
        rerender()
    }
}

class TaskRefactored{
    // create
    constructor(task){
        this.task = task;
        this.domConstructor();
    }
    domConstructor(){
        this.taskName = this.createTaskName(name);
        this.configureTaskBtn = this.createConfigureTaskBtn();
    }

    createTaskName(name){
        var element = document.createElement("p");
        element.id = 'taskname';
        element.innerHTML = `${this.task.name}`;
        return element;
    }
    createConfigureTaskBtn(){
        var element = document.createElement("button");
        element.id = 'configureTaskBtn';
        element.classList.add();
        element.innerHTML = `Configure Task`;
        element.addEventListener('click', (event) => {
            this.openConfig()
        })
        return element;
    }

    // read
    getJSON(){
        return this.task;
    }
    render(){
        // create div section container
        var taskContainer = document.createElement("div");
        taskContainer.classList.add(`task-container`);
        taskContainer.classList.add(`SNo.${this.sectionIndex}`)
        taskContainer.classList.add(`TNo.${this.index}`)
        taskContainer.style.backgroundColor = this.bgColor;
        taskContainer.draggable = true;
        
        taskContainer.classList.add(`draggable-to-section`);
        taskContainer.addEventListener('dragstart', () => {
            taskContainer.classList.add('is-dragging');
        });
        taskContainer.addEventListener("dragend", () => {
            taskContainer.classList.remove('is-dragging');
        });
        
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
        taskContentsContainer.classList.add('task-contents-container');
        for (var i = 0; i < this.contents.length; i++){
            var task = Task(this.contents[i]);
            taskContentsContainer.appendChild(task);
        }
        taskContainer.appendChild(taskDetailsContainer);
        taskContainer.appendChild(taskContentsContainer);

        return taskContainer;
    }

    // update
    setTaskName(){
        var element = document.getElementById('taskname');
        element.innerHTML = `${this.task.name}`;
    }
    setTaskBgColor(bgColor){
        // var element = document.getElementById('divSectionContainer');
        // element.backgroundColor = bgColor1;
    }
    openConfig(){
        var divPopup = document.createElement('div');
        divPopup.classList.add('popup-container');

        var pNameLabel = document.createElement('p');
        pNameLabel.innerHTML = `Current name: ${this.name}`

        var inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.id = 'inputText'
        inputName.placeholder = 'new name'

        var divPopupBtnContainer = document.createElement('div');
        divPopupBtnContainer.classList.add('popup-btn-container');

        var btnSave = document.createElement('button');
        btnSave.id = 'btnSave';
        btnSave.innerHTML = 'Save'
        btnSave.addEventListener('click', (event) => {
            if (inputName.value !== '') {
                board.contents[this.sectionIndex].contents[this.index].name = inputName.value;
                
                divPopup.parentNode.removeChild(divPopup);
                closeOverlay();
                rerender();
            }
        })

        var btnDelete = document.createElement('button');
        btnDelete.id = 'btnDelete';
        btnDelete.innerHTML = 'Delete';
        btnDelete.addEventListener('click', (event) => {
            this.selfDelete();

            divPopup.parentNode.removeChild(divPopup);
                closeOverlay();
                rerender();
        })

        var btnClose = document.createElement('button');
        btnClose.id = 'btnClose';
        btnClose.innerHTML = 'Close'
        btnClose.addEventListener('click', (event) => {
            divPopup.parentNode.removeChild(divPopup);
            closeOverlay();
        })

        divPopupBtnContainer.appendChild(btnSave);
        divPopupBtnContainer.appendChild(btnDelete);
        divPopupBtnContainer.appendChild(btnClose);

        divPopup.appendChild(pNameLabel);
        divPopup.appendChild(inputName);
        divPopup.appendChild(divPopupBtnContainer);

        document.getElementById('divMainContainer').appendChild(divPopup);

        openOverlay();
    }

    // delete
    selfDelete(){
        this.section.remove(this.task);
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
        
        // Section List
        this.contents = contents
    }

    /* WIP */
    // Edit / Update
    set board([name, bgColor1, bgColor2, contents]){
        if (this.name !== name && name !== null) {
            this.name = name;
            this.setBoardName(name);
        }
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

        // update name
        this.boardName = this.createBoardName(this.name);
        
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
            this.openConfig();
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

    openConfig(){
        var divPopup = document.createElement('div');
        divPopup.classList.add('popup-container');

        var pNameLabel = document.createElement('p');
        pNameLabel.innerHTML = `Current name: ${this.name}`

        var inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.id = 'inputText'
        inputName.placeholder = 'new name'

        var divPopupBtnContainer = document.createElement('div');
        divPopupBtnContainer.classList.add('popup-btn-container');

        var btnSave = document.createElement('button');
        btnSave.id = 'btnSave';
        btnSave.innerHTML = 'Save'
        btnSave.addEventListener('click', (event) => {
            if (inputName.value !== '') {
                board.name = inputName.value;
                
                divPopup.parentNode.removeChild(divPopup);
                closeOverlay();
                rerender();
            }
        })

        var btnClose = document.createElement('button');
        btnClose.id = 'btnClose';
        btnClose.innerHTML = 'Close'
        btnClose.addEventListener('click', (event) => {
            divPopup.parentNode.removeChild(divPopup);
            closeOverlay();
        })

        divPopupBtnContainer.appendChild(btnSave);
        divPopupBtnContainer.appendChild(btnClose);

        divPopup.appendChild(pNameLabel);
        divPopup.appendChild(inputName);
        divPopup.appendChild(divPopupBtnContainer);

        document.getElementById('divMainContainer').appendChild(divPopup);

        openOverlay();
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
        

        this.contents = contents;
    }

    /* WIP */
    // Edit 
    set section([name, bgColor, contents]){
        if (this.name !== name && name !== null) {
            this.name = name;
        }
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
        this.sectionContentsContainer = document.createElement("div");
        this.sectionContentsContainer.classList.add('section-content-container');
        this.sectionContentsContainer.classList.add(`SNo.${this.index}`)
        this.sectionContentsContainer.classList.add(`droppable-for-task`);
        this.sectionContentsContainer.addEventListener("dragover", (event) => {
            event.preventDefault();

            this.bottomTask = this.insertAboveTask(this.sectionContentsContainer, event.clientY);
            this.draggingTask = document.querySelector(".is-dragging");
            
            if (!this.bottomTask){
                this.sectionContentsContainer.appendChild(this.draggingTask);
            } else {
                this.sectionContentsContainer.insertBefore(this.draggingTask, this.bottomTask);
            };
        });
        this.sectionContentsContainer.addEventListener("drop", (event) => {
            event.preventDefault();

            const draggingTaskSectionIndex = Number(this.draggingTask.classList[1].slice(4,));
            const draggingTaskIndex = Number(this.draggingTask.classList[2].slice(4,));
            const prevTaskIndex = draggingTaskIndex;

            if (!this.bottomTask){
                // Update Board JSON
                // * Append to end
                board.contents[this.index].contents.push(board.contents[draggingTaskSectionIndex].contents[draggingTaskIndex]);
                // * Delete element at index
                board.contents[draggingTaskSectionIndex].contents.splice(draggingTaskIndex, 1)

                rerender();
            } else {
                // Update Board JSON
                const bottomTaskIndex = Number(this.bottomTask.classList[2].slice(4,))
                // * Append before bottom
                board.contents[this.index].contents.splice(bottomTaskIndex, 0, board.contents[draggingTaskSectionIndex].contents[draggingTaskIndex]);
                // * Delete element at index
                if(bottomTaskIndex < draggingTaskIndex){
                    board.contents[draggingTaskSectionIndex].contents.splice(draggingTaskIndex+1, 1)
                }
                else{
                    board.contents[draggingTaskSectionIndex].contents.splice(draggingTaskIndex, 1)
                }

                rerender();
            };
        })

        for (var i = 0; i < this.contents.length; i++){
            var task = new Task(this.index, i, this.contents[i].name, this.contents[i].bgColor);
            var taskContainer = task.render()
            this.sectionContentsContainer.appendChild(taskContainer);
        }
        sectionContainer.appendChild(sectionDetailsContainer);
        sectionContainer.appendChild(this.sectionContentsContainer);
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

    insertAboveTask(sectionContentsContainer, mouseY) {
        const eventListener = sectionContentsContainer.querySelectorAll('.draggable-to-section:not(.is-dragging)');

        var closestTask = null;
        var closestOffset = Number.NEGATIVE_INFINITY;

        eventListener.forEach((taskContainers) => {
            const { top } = taskContainers.getBoundingClientRect();

            const offset = mouseY - top;

            if (offset < 0 && offset > closestOffset) {
                closestOffset = offset;
                closestTask = taskContainers;
            };
        });
        return closestTask;
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
    createConfigureSectionBtn(){
        var element = document.createElement("button");
        element.id = 'configureSectionBtn';
        element.classList.add();
        element.innerHTML = `Configure Section`;
        element.addEventListener('click', (event) => {
            this.openConfig();
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

    openConfig(){
        var divPopup = document.createElement('div');
        divPopup.classList.add('popup-container');

        var pNameLabel = document.createElement('p');
        pNameLabel.innerHTML = `Current name: ${this.name}`

        var inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.id = 'inputText'
        inputName.placeholder = 'new name'

        var divPopupBtnContainer = document.createElement('div');
        divPopupBtnContainer.classList.add('popup-btn-container');

        var btnSave = document.createElement('button');
        btnSave.id = 'btnSave';
        btnSave.innerHTML = 'Save'
        btnSave.addEventListener('click', (event) => {
            if (inputName.value !== '') {
                board.contents[this.index].name = inputName.value;
                // this.sectionLabel = inputName.value;
                divPopup.parentNode.removeChild(divPopup);
                closeOverlay();
                rerender();
            }
        })

        var btnDelete = document.createElement('button');
        btnDelete.id = 'btnDelete';
        btnDelete.innerHTML = 'Delete';
        btnDelete.addEventListener('click', (event) => {
            this.selfDelete();

            divPopup.parentNode.removeChild(divPopup);
                closeOverlay();
                rerender();
        })

        var btnClose = document.createElement('button');
        btnClose.id = 'btnClose';
        btnClose.innerHTML = 'Close'
        btnClose.addEventListener('click', (event) => {
            divPopup.parentNode.removeChild(divPopup);
            closeOverlay();
        })

        divPopupBtnContainer.appendChild(btnSave);
        divPopupBtnContainer.appendChild(btnDelete);
        divPopupBtnContainer.appendChild(btnClose);

        divPopup.appendChild(pNameLabel);
        divPopup.appendChild(inputName);
        divPopup.appendChild(divPopupBtnContainer);

        document.getElementById('divMainContainer').appendChild(divPopup);

        openOverlay();
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

    /* WIP */
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
        taskContainer.classList.add(`SNo.${this.sectionIndex}`)
        taskContainer.classList.add(`TNo.${this.index}`)
        taskContainer.style.backgroundColor = this.bgColor;
        taskContainer.draggable = true;
        
        taskContainer.classList.add(`draggable-to-section`);
        taskContainer.addEventListener('dragstart', () => {
            taskContainer.classList.add('is-dragging');
        });
        taskContainer.addEventListener("dragend", () => {
            taskContainer.classList.remove('is-dragging');
        });
        
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
    createConfigureTaskBtn(){
        var element = document.createElement("button");
        element.id = 'configureTaskBtn';
        element.classList.add();
        element.innerHTML = `Configure Task`;
        element.addEventListener('click', (event) => {
            this.openConfig()
        })
        return element;
    }

    openConfig(){
        var divPopup = document.createElement('div');
        divPopup.classList.add('popup-container');

        var pNameLabel = document.createElement('p');
        pNameLabel.innerHTML = `Current name: ${this.name}`

        var inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.id = 'inputText'
        inputName.placeholder = 'new name'

        var divPopupBtnContainer = document.createElement('div');
        divPopupBtnContainer.classList.add('popup-btn-container');

        var btnSave = document.createElement('button');
        btnSave.id = 'btnSave';
        btnSave.innerHTML = 'Save'
        btnSave.addEventListener('click', (event) => {
            if (inputName.value !== '') {
                board.contents[this.sectionIndex].contents[this.index].name = inputName.value;
                
                divPopup.parentNode.removeChild(divPopup);
                closeOverlay();
                rerender();
            }
        })

        var btnDelete = document.createElement('button');
        btnDelete.id = 'btnDelete';
        btnDelete.innerHTML = 'Delete';
        btnDelete.addEventListener('click', (event) => {
            this.selfDelete();

            divPopup.parentNode.removeChild(divPopup);
                closeOverlay();
                rerender();
        })

        var btnClose = document.createElement('button');
        btnClose.id = 'btnClose';
        btnClose.innerHTML = 'Close'
        btnClose.addEventListener('click', (event) => {
            divPopup.parentNode.removeChild(divPopup);
            closeOverlay();
        })

        divPopupBtnContainer.appendChild(btnSave);
        divPopupBtnContainer.appendChild(btnDelete);
        divPopupBtnContainer.appendChild(btnClose);

        divPopup.appendChild(pNameLabel);
        divPopup.appendChild(inputName);
        divPopup.appendChild(divPopupBtnContainer);

        document.getElementById('divMainContainer').appendChild(divPopup);

        openOverlay();
    }
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

// Main
var board = load();