// Utils
function openOverlay(){
    const divOverlay = document.getElementById("divOverlay")
    divOverlay.style.display = 'block';
}
function closeOverlay(){
    const divOverlay = document.getElementById("divOverlay")
    divOverlay.style.display = 'none';
}
// Cyclical Reference Solution [thanks to deveoloper.mozilla.org]
function getCircularReplacer() {
  const ancestors = [];

  return function (key, value) {
    if (typeof value !== "object" || value === null) {
      return value;
    }

    // `this` is the object that value is contained in,
    // i.e., its direct parent.
    while (ancestors.length > 0 && ancestors.at(-1) !== this) {
      ancestors.pop();
    }

    if (ancestors.includes(value)) {
      return "[Circular]";
    }

    ancestors.push(value);

    return value;
  };
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
// Refactored as of 08-07-2025
// + Only board relies on global for loading/unloading
// - Adding more attributes might be difficult to maintain but very possible. <current target of future refactoring>
// - Relies on indices for dragging and dropping. might be a required compromise. just results in verbose code
class Board {
    // create
    constructor(board){
        this.board = board;

        // add parent container references
        if (this.board.contents !== undefined && Array.isArray(this.board.contents)){
            this.board.contents.forEach(content => {
                content.board = this.board.contents;
            });
        }
    }
    domConstructor(){
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
        this.openBoardBtn = this.createOpenBoardBtn();
        this.saveBoardBtn = this.createSaveBoardBtn();
        this.configureBoardBtn = this.createConfigureBoardBtn();
        this.newBoardBtn = this.createNewBoardBtn();
        this.addSectionBtn = this.createAddSectionBtn();
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
        for (let i = 0; i < this.board.contents.length; i++){
            let section = new Section(this.board.contents[i], i);
            let sectionContainer = section.render();
            this.boardContentsContainer.appendChild(sectionContainer);
        }
        
        // append boardContainer children
        this.boardContainer.appendChild(this.boardDetailsContainer);
        this.boardContainer.appendChild(this.addSectionBtn);
        this.boardContainer.appendChild(this.boardContentsContainer);
    }
    
    createBoardName(name){
        let element = document.createElement("h2");
        element.id = 'h2CurrentBoard';
        element.innerHTML = `Current board: ${name}`;
        return element;
    }

    createOpenBoardBtn(){
        let element = document.createElement("button");
        element.id = 'btnOpenBoard';
        element.classList.add();
        element.innerHTML = `Open Board`;
        element.addEventListener('click', (event) => {
            let uploadInput = document.createElement('input');
            uploadInput.type = 'file';
            uploadInput.id = 'fileInput';
            uploadInput.accept = 'json';

            uploadInput.addEventListener('change', (event) => {
                const file = uploadInput.files[0];

                if (file){
                    const reader = new FileReader()
                    reader.onload = function(event) {
                        const data = JSON.parse(event.target.result);
                        board = loadBoard(data); // requires global
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
        let element = document.createElement("button");
        element.id = 'btnSaveBoard';
        element.classList.add();
        element.innerHTML = `Save Board`;
        element.addEventListener('click', (event) =>{
            const filename = "newBoard.json";
            const text = JSON.stringify(this.board, getCircularReplacer());

            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);
            element.click();
        });
        return element;
    }
    createConfigureBoardBtn(){
        let element = document.createElement("button");
        element.id = 'btnConfigureBoard';
        element.classList.add();
        element.innerHTML = `Configure Board`;
        element.addEventListener('click', (event) =>{
            this.openConfig();
        });
        return element;
    }
    createNewBoardBtn(){
        let element = document.createElement("button");
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
        let element = document.createElement("button");
        element.id = 'btnAddSection';
        element.classList.add();
        element.innerHTML = `Add Section`;
        element.addEventListener('click', (event) => {

            let params = createDefaultSection();
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

        return this.boardContainer;
    }
    
    // update
    // [future optional todo: deconstruct. for now deconstructing this function might require additional but unnecessary effort]
    // [hint for optional todo: use objects]
    openConfig(){
        // popup container
        let divPopup = document.createElement('div');
        divPopup.classList.add('popup-container');

        // attribute config
        let pNameLabel = document.createElement('p');
        pNameLabel.innerHTML = `Current name: ${this.board.name}`

        let inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.id = 'inputText'
        inputName.placeholder = 'new name'

        // button container
        let divPopupBtnContainer = document.createElement('div');
        divPopupBtnContainer.classList.add('popup-btn-container');
        let btnSave = document.createElement('button');
        btnSave.id = 'btnSave';
        btnSave.innerHTML = 'Save'
        btnSave.addEventListener('click', (event) => {

            // update
            let successful = false;
            if (inputName.value.trim() !== '') {
                this.board.name = inputName.value.trim();
                successful = true;
            }
            // other elements...

            if (successful){
                divPopup.parentNode.removeChild(divPopup);
                closeOverlay();
                rerender();
            }

        })
        let btnClose = document.createElement('button');
        btnClose.id = 'btnClose';
        btnClose.innerHTML = 'Close'
        btnClose.addEventListener('click', (event) => {
            divPopup.parentNode.removeChild(divPopup);
            closeOverlay();
        })

        // appending
        divPopupBtnContainer.appendChild(btnSave);
        divPopupBtnContainer.appendChild(btnClose);
        divPopup.appendChild(pNameLabel);
        divPopup.appendChild(inputName);
        divPopup.appendChild(divPopupBtnContainer);
        document.getElementById('divMainContainer').appendChild(divPopup);

        openOverlay();
    }

    setBoardBgColor1(bgColor1){ // header
        let element = document.getElementById('header');
        element.backgroundColor = bgColor1;
    }
    setBoardBgColor2(bgColor2){ // main
        let element = document.getElementById('divMainContainer');
        element.backgroundColor = bgColor2;
    }

    insertSection(index, section){
        this.board.contents.splice(index, 0, section)
    }
    pushSection(section){
        section.board = this.board.contents;
        this.board.contents.push(section);
    }
    
    // delete 
    // [unused, elements delete themselves using parent reference]
    // [can be useful for a delete-multiple-sections feature, and so on]
    popSection(){
        this.board.contents.pop()
    }
    removeSection(section){
        this.board.contents.remove(section);
    }
}

class Section {
    // create
    constructor(section, index){
        this.section = section;
        this.index = index;

        // add parent json references
        if (this.section.contents !== undefined && Array.isArray(this.section.contents)){
            this.section.contents.forEach(content => {
                content.section = this.section.contents;
            });
        }
    }
    domConstructor(){
        // containers
        // sectionContainer [Main Container]
        this.sectionContainer = document.createElement("div");
        this.sectionContainer.classList.add(`section-container`);

        // configurable attributes
        this.sectionName = this.createSectionName(this.section.name)
        this.setSectionBgColor(this.section.bgColor)
        //...
        
        // sectionDetailsContainer 
        this.sectionDetailsContainer = document.createElement("div");
        this.sectionDetailsContainer.classList.add(`section-details-container`);
        
        // sectionButtonContainer
        this.sectionButtonContainer = document.createElement("div");
        this.sectionButtonContainer.classList.add(`section-btn-container`);
        
        // append sectionContainer children
        this.configureSectionBtn = this.createConfigureSectionBtn();
        this.addTaskBtn = this.createAddTaskBtn();
        this.sectionButtonContainer.appendChild(this.configureSectionBtn);
        
        // append sectionDetailsContainer children
        this.sectionDetailsContainer.appendChild(this.sectionName);
        this.sectionDetailsContainer.appendChild(this.sectionButtonContainer);
        
        // sectionContents container
        this.sectionContentsContainer = document.createElement("div");
        this.sectionContentsContainer.classList.add('section-content-container');

        // drag and drop implementation; based on a youtube tutorial
        // [suboptimal due to index requirements but it is readable enough (only for now)]
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

            let board = this.section.board;
            const draggingTaskSectionIndex = Number(this.draggingTask.classList[1].slice(4,));
            const draggingTaskIndex = Number(this.draggingTask.classList[2].slice(4,));

            if (!this.bottomTask){
                // Update Board JSON
                // * Append to end
                this.section.contents.push(board[draggingTaskSectionIndex].contents[draggingTaskIndex]);
                // * Delete element at index
                board[draggingTaskSectionIndex].contents.splice(draggingTaskIndex, 1)

                rerender();
            } else {
                // Update Board JSON
                const bottomTaskIndex = Number(this.bottomTask.classList[2].slice(4,))
                // * Append before bottom
                board[this.index].contents.splice(bottomTaskIndex, 0, board[draggingTaskSectionIndex].contents[draggingTaskIndex]);
                // * Delete element at index
                if(bottomTaskIndex < draggingTaskIndex){
                    board[draggingTaskSectionIndex].contents.splice(draggingTaskIndex+1, 1)
                }
                else{
                    board[draggingTaskSectionIndex].contents.splice(draggingTaskIndex, 1)
                }

                rerender();
            };
        })
        for (let i = 0; i < this.section.contents.length; i++){
            let task = new Task(this.section.contents[i], this.index, i);
            let taskContainer = task.render()
            this.sectionContentsContainer.appendChild(taskContainer);
        }

        // append sectionContainer children
        this.sectionContainer.appendChild(this.sectionDetailsContainer);
        this.sectionContainer.appendChild(this.sectionContentsContainer);
        this.sectionContainer.appendChild(this.addTaskBtn);
    }

    createSectionName(name){
        let element = document.createElement("h4");
        element.id = 'h4SectionName';
        element.innerHTML = `${name}`;
        return element;
    }
    createAddTaskBtn(){
        let element = document.createElement("button");
        element.id = 'addTaskBtn';
        element.classList.add();
        element.innerHTML = `Add Task`;
        element.addEventListener('click', () => {
            let params = createDefaultTask();
            this.pushTask(params);
            rerender()
        })
        return element;
    }
    createConfigureSectionBtn(){
        let element = document.createElement("button");
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
        this.domConstructor();

        return this.sectionContainer;   
    }

    // update
    openConfig(){
        // popup container
        let divPopup = document.createElement('div');
        divPopup.classList.add('popup-container');

        // attribute config
        let pNameLabel = document.createElement('p');
        pNameLabel.innerHTML = `Current name: ${this.section.name}`

        let inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.id = 'inputText'
        inputName.placeholder = 'new name'

        // button container
        let divPopupBtnContainer = document.createElement('div');
        divPopupBtnContainer.classList.add('popup-btn-container');

        let btnSave = document.createElement('button');
        btnSave.id = 'btnSave';
        btnSave.innerHTML = 'Save'
        btnSave.addEventListener('click', (event) => {
            // update
            let successful = false;

            if (inputName.value.trim() !== '') {
                this.section.name = inputName.value.trim();
                successful = true
            }
            // other attributes
            if (successful){
                divPopup.parentNode.removeChild(divPopup);
                closeOverlay();
                rerender();
            }
        })

        let btnDelete = document.createElement('button');
        btnDelete.id = 'btnDelete';
        btnDelete.innerHTML = 'Delete';
        btnDelete.addEventListener('click', (event) => {
            this.removeSelf ();

            divPopup.parentNode.removeChild(divPopup);
            closeOverlay();
            rerender();
        })

        let btnClose = document.createElement('button');
        btnClose.id = 'btnClose';
        btnClose.innerHTML = 'Close'
        btnClose.addEventListener('click', (event) => {
            divPopup.parentNode.removeChild(divPopup);
            closeOverlay();
        })

        divPopupBtnContainer.appendChild(btnSave);
        divPopupBtnContainer.appendChild(btnDelete);
        divPopupBtnContainer.appendChild(btnClose);

        // append attribute config elements
        divPopup.appendChild(pNameLabel);
        divPopup.appendChild(inputName);
        divPopup.appendChild(divPopupBtnContainer);

        document.getElementById('divMainContainer').appendChild(divPopup);

        openOverlay();
    }

    insert(index, task){
        this.contents.splice(index, 0, task);
    }
    insertAboveTask(sectionContentsContainer, mouseY) {
        const eventListener = sectionContentsContainer.querySelectorAll('.draggable-to-section:not(.is-dragging)');

        let closestTask = null;
        let closestOffset = Number.NEGATIVE_INFINITY;

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
        task.section = this.section.contents;
        this.section.contents.push(task);
    }

    setSectionBgColor(bgColor){
        this.sectionContainer.style.backgroundColor = bgColor;
    }
    
    // delete
    removeSelf(){
        let board = this.section.board;
        let deleteIndex = board.indexOf(this.section)
        board.splice(deleteIndex, 1)
        rerender()
    }
    // [unused, elements delete themselves using parent reference]
    // [can be useful for a delete-multiple-sections feature, and so on]
    // popTask(){
    //     this.section.contents.pop();
    // }
    // removeTask(task){
    //     let section = this.section;
    //     let deleteIndex = section.indexOf(task)
    //     this.section.remove(deleteIndex, 1);
    // }

}

class Task{
    // create
    constructor(task, sectionIndex, index){
        this.task = task;
        this.sectionIndex = sectionIndex;
        this.index = index;

        // // just in case: add parent json references
        // if (this.contents !== undefined && Array.isArray(this.contents)){
        //     this.contents.forEach(content => {
        //         content.section = this.section.contents;
        //     });
        // }
    }
    domConstructor(){
        // taskContainer [Main Container]
        this.taskContainer = document.createElement("div");
        this.taskContainer.classList.add(`task-container`);
        this.taskContainer.style.backgroundColor = this.bgColor;
        
        // drag and drop implementation
        // [suboptimal due to requiring indices. will require a full scale object refactor so might be unnecessary effort]
        this.taskContainer.draggable = true;
        this.taskContainer.classList.add(`SNo.${this.sectionIndex}`)
        this.taskContainer.classList.add(`TNo.${this.index}`)
        this.taskContainer.classList.add(`draggable-to-section`);
        this.taskContainer.addEventListener('dragstart', () => {
            this.taskContainer.classList.add('is-dragging');
        });
        this.taskContainer.addEventListener("dragend", () => {
            this.taskContainer.classList.remove('is-dragging');
        });

        // configurable attributes
        this.taskName = this.createTaskName(this.task.name);
        this.setTaskBgColor(this.task.bgColor);
        // ...
        
        // taskDetails container
        this.taskDetailsContainer = document.createElement("div");
        this.taskDetailsContainer.classList.add(`task-details-container`);

        // taskButton container
        this.taskButtonContainer = document.createElement("div");
        this.taskButtonContainer.classList.add(`task-btn-container`);
        
        // append button container children
        this.configureTaskBtn = this.createConfigureTaskBtn();
        this.taskButtonContainer.appendChild(this.configureTaskBtn);

        // append board details container children
        this.taskDetailsContainer.appendChild(this.taskName);
        this.taskDetailsContainer.appendChild(this.taskButtonContainer);

        // taskContents container
        this.taskContentsContainer = document.createElement("div");
        // // just in case : taskContents
        // taskContentsContainer.classList.add('task-contents-container');
        // for (let i = 0; i < this.contents.length; i++){
        //     let task = Task(this.contents[i]);
        //     taskContentsContainer.appendChild(task);
        // }
        this.taskContainer.appendChild(this.taskDetailsContainer);
        this.taskContainer.appendChild(this.taskContentsContainer);
    }

    createTaskName(name){
        let element = document.createElement("p");
        element.id = 'taskname';
        element.innerHTML = `${name}`;
        return element;
    }
    createConfigureTaskBtn(){
        let element = document.createElement("button");
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
        this.domConstructor();

        return this.taskContainer;
    }

    // update
    openConfig(){
        // popup container
        let divPopup = document.createElement('div');
        divPopup.classList.add('popup-container');

        // attribute config
        let pNameLabel = document.createElement('p');
        pNameLabel.innerHTML = `Current name: ${this.task.name}`

        let inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.id = 'inputText'
        inputName.placeholder = 'new name'

        // button container
        let divPopupBtnContainer = document.createElement('div');
        divPopupBtnContainer.classList.add('popup-btn-container');

        let btnSave = document.createElement('button');
        btnSave.id = 'btnSave';
        btnSave.innerHTML = 'Save'
        btnSave.addEventListener('click', (event) => {
            let successful = false;

            if (inputName.value !== '') {
                this.task.name = inputName.value;
                successful = true;
            }

            if (successful){
                divPopup.parentNode.removeChild(divPopup);
                closeOverlay();
                rerender();
            }
        })

        let btnDelete = document.createElement('button');
        btnDelete.id = 'btnDelete';
        btnDelete.innerHTML = 'Delete';
        btnDelete.addEventListener('click', (event) => {
            this.removeSelf();

            divPopup.parentNode.removeChild(divPopup);
                closeOverlay();
                rerender();
        })

        let btnClose = document.createElement('button');
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

    setTaskBgColor(bgColor){
        this.taskContainer.backgroundColor = bgColor
    }

    // delete
    removeSelf(){
        let section = this.task.section;
        let deleteIndex = section.indexOf(this.task)
        section.splice(deleteIndex, 1)
        rerender()
    }
}

// Globals Section
function loadBoard(data){
    if (data !== null){
        const returnBoard = new Board(data)
    
    return returnBoard
    }
} // -> Returns Loaded Board

function loadBoardDefaults(){
    const data = createDefaultBoard()
    const returnBoard = new Board(data)

    return returnBoard
} // -> Returns Default Board

function load(){
    const thisBoard = loadBoardDefaults();
    renderBoardToMain(thisBoard.render());
    return thisBoard;
} // -> Returns Default Board On Startup

function renderBoardToMain(boardContainer){
    document.getElementById("divMainContainer").appendChild(boardContainer);
} // -> Gets main container and appends board container

function rerender(){
    const boardContainer = document.getElementById("divBoardContainer");
    boardContainer.parentNode.removeChild(boardContainer);
    renderBoardToMain(board.render()); // Global reliant but intentional
} // -> Removes and replaces board container

// Main
let board = load(); // -> Used for board loading / unloading functions, and initial load