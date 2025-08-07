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

class Board {
    // create
    constructor(board){
        this.board = board;

        // add parent container references
        if (this.contents !== undefined && Array.isArray(this.contents)){
            this.contents.forEach(content => {
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
        for (let i = 0; i < this.contents.length; i++){
            let section = new Section(this.contents[i], i);
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
        let element = document.createElement("button");
        element.id = 'btnSaveBoard';
        element.classList.add();
        element.innerHTML = `Save Board`;
        element.addEventListener('click', (event) =>{
            const filename = "newBoard.json";
            const text = JSON.stringify(this.board);

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
            this.board = loadBoardDefaults();
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
        this.board.contents.push(section)
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
        if (this.contents !== undefined && Array.isArray(this.contents)){
            this.contents.forEach(content => {
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
        this.sectionName = createSectionName(this.section.name)
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

            const draggingTaskSectionIndex = Number(this.draggingTask.classList[1].slice(4,));
            const draggingTaskIndex = Number(this.draggingTask.classList[2].slice(4,));

            if (!this.bottomTask){
                // Update Board JSON
                // * Append to end
                this.section.contents.push(this.board[draggingTaskSectionIndex].contents[draggingTaskIndex]);
                // * Delete element at index
                this.board[draggingTaskSectionIndex].contents.splice(draggingTaskIndex, 1)

                rerender();
            } else {
                // Update Board JSON
                const bottomTaskIndex = Number(this.bottomTask.classList[2].slice(4,))
                // * Append before bottom
                this.board[this.index].contents.splice(bottomTaskIndex, 0, this.board[draggingTaskSectionIndex].contents[draggingTaskIndex]);
                // * Delete element at index
                if(bottomTaskIndex < draggingTaskIndex){
                    this.board[draggingTaskSectionIndex].contents.splice(draggingTaskIndex+1, 1)
                }
                else{
                    this.board[draggingTaskSectionIndex].contents.splice(draggingTaskIndex, 1)
                }

                rerender();
            };
        })
        for (let i = 0; i < this.contents.length; i++){
            let task = new Task(this.contents[i], this.index, i);
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
        pNameLabel.innerHTML = `Current name: ${this.name}`

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
            this.selfDelete();

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
        const newTask = task
        this.contents.push(newTask);
    }

    setSectionBgColor(bgColor){
        this.sectionContainer.style.backgroundColor = bgColor;
    }
    
    // delete
    removeSelf(){
        this.board.remove(this.section)
        rerender()
    }
    // [unused, elements delete themselves using parent reference]
    // [can be useful for a delete-multiple-sections feature, and so on]
    popTask(){
        this.section.contents.pop();
    }
    removeTask(task){
        this.section.contents.remove(task);
    }

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
        let taskContainer = document.createElement("div");
        taskContainer.classList.add(`task-container`);
        taskContainer.style.backgroundColor = this.bgColor;
        
        // drag and drop implementation
        // [suboptimal due to requiring indices. will require a full scale object refactor so might be unnecessary effort]
        taskContainer.draggable = true;
        taskContainer.classList.add(`SNo.${this.sectionIndex}`)
        taskContainer.classList.add(`TNo.${this.index}`)
        taskContainer.classList.add(`draggable-to-section`);
        taskContainer.addEventListener('dragstart', () => {
            taskContainer.classList.add('is-dragging');
        });
        taskContainer.addEventListener("dragend", () => {
            taskContainer.classList.remove('is-dragging');
        });

        // configurable attributes
        this.taskName = this.createTaskName(this.task.name);
        this.setTaskBgColor(this.task.bgColor);
        // ...
        
        // taskDetails container
        let taskDetailsContainer = document.createElement("div");
        taskDetailsContainer.classList.add(`task-details-container`);

        // taskButton container
        let taskButtonContainer = document.createElement("div");
        taskButtonContainer.classList.add(`task-btn-container`);
        
        // append button container children
        this.configureTaskBtn = this.createConfigureTaskBtn();
        taskButtonContainer.appendChild(this.configureTaskBtn);

        // append board details container children
        taskDetailsContainer.appendChild(this.taskName);
        taskDetailsContainer.appendChild(taskButtonContainer);

        // taskContents container
        let taskContentsContainer = document.createElement("div");
        // // just in case : taskContents
        // taskContentsContainer.classList.add('task-contents-container');
        // for (let i = 0; i < this.contents.length; i++){
        //     let task = Task(this.contents[i]);
        //     taskContentsContainer.appendChild(task);
        // }
        taskContainer.appendChild(taskDetailsContainer);
        taskContainer.appendChild(taskContentsContainer);
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
        pNameLabel.innerHTML = `Current name: ${this.name}`

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
            this.selfDelete();

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
    selfDelete(){
        this.section.remove(this.task);
    }
}

// // Classes
// class Board {
//     // Create
//     constructor(name, bgColor1, bgColor2, contents){

//         this.id = randomizeId(); // Deprecated

//         // Board Configuration
//         this.name = name !== null? name : 'default';
//         this.bgColor1 = bgColor1 !== null? bgColor1 : '#FFFFFF';
//         this.bgColor2 = bgColor2 !== null? bgColor2 : '#FFFFFF';

//         // Elements
//         this.boardName = this.createBoardName(name);
//         /* WIP */
//         // this.setBoardBgColor1(bgColor1);
//         // this.setBoardBgColor2(bgColor2);

//         this.openBoardBtn = this.createOpenBoardBtn();
//         this.openBoardState = 'closed';
//         this.saveBoardBtn = this.createSaveBoardBtn();
//         this.configureBoardBtn = this.createConfigureBoardBtn();
//         this.newBoardBtn = this.createNewBoardBtn();
//         this.addSectionBtn = this.createAddSectionBtn();
        
//         // Section List
//         this.contents = contents
//     }

//     /* WIP */
//     // Edit / Update
//     set board([name, bgColor1, bgColor2, contents]){
//         if (this.name !== name && name !== null) {
//             this.name = name;
//             this.setBoardName(name);
//         }
//         // if (this.bgColor1 !== bgColor1) {
//         //     this.bgColor1 = bgColor1;
//         //     this.setBoardBgColor1(bgColor1);
//         // }
//         // if (this.bgColor2 !== bgColor2) {
//         //     this.bgColor2 = bgColor2;
//         //     this.setBoardBgColor2(bgColor2);
//         // }
//         if (JSON.stringify(this.contents) == JSON.stringify(contents)) {
//             this.contents = contents;
//         }
//     }

//     // Read
//     get board(){
//         return {
//             "name" : this.name,
//             "bgColor1" : this.bgColor1,
//             "bgColor2" : this.bgColor2,
//             "contents" : this.contents
//         };
//     }

//     // Read : Render
//     render(){
//         // create div board container
//         let boardContainer = document.createElement("div");
//         boardContainer.id = `divBoardContainer`
//         boardContainer.classList.add(`board-container`);
//         boardContainer.style.backgroundColor = this.bgColor2;

//         // update name
//         this.boardName = this.createBoardName(this.name);
        
//         // create child board details container
//         let boardDetailsContainer = document.createElement("div");
//         boardDetailsContainer.classList.add(`board-details-container`);

//         // board button container
//         let boardButtonContainer = document.createElement("div");
//         boardButtonContainer.classList.add(`board-btn-container`);
        
//         // append button container children
//         boardButtonContainer.appendChild(this.openBoardBtn);
//         boardButtonContainer.appendChild(this.saveBoardBtn);
//         boardButtonContainer.appendChild(this.configureBoardBtn);
//         boardButtonContainer.appendChild(this.newBoardBtn);
        
//         // append board details container children
//         boardDetailsContainer.appendChild(this.boardName);
//         boardDetailsContainer.appendChild(boardButtonContainer);

//         // create board contents container
//         let boardContentsContainer = document.createElement("div");
//         boardContentsContainer.classList.add('board-contents-container');
//         for (let i = 0; i < this.contents.length; i++){
//             let section = new Section(this.id, i, this.contents[i].name, this.contents[i].bgColor, this.contents[i].contents);
//             let sectionContainer = section.render();
//             boardContentsContainer.appendChild(sectionContainer);
//         }
//         boardContainer.appendChild(boardDetailsContainer);
//         boardContainer.appendChild(this.addSectionBtn);
//         boardContainer.appendChild(boardContentsContainer);

//         return boardContainer
//     }

//     /* WIP */
//     // Insert
//     insert(index, section){
//         this.contents.splice(index, 0, section)
//     }
//     pushSection(section){
//         const newSection = section
//         this.contents.push(newSection)
//     }
//     // Delete
//     pop(){
//         this.contents.pop()
//     }
//     remove(index){
//         this.contents.splice(index, 1)
//     }

//     // Elements
//     createBoardName(name){
//         let element = document.createElement("h2");
//         element.id = 'h2CurrentBoard';
//         element.innerHTML = `Current board: ${name}`;
//         return element;
//     }
//     setBoardName(name){
//         let element = document.getElementById('h2CurrentBoard');
//         element.innerHTML = `Current board: ${name}`;
//     }
//     /* WIP */
//     // setBoardBgColor1(bgColor1){ // Placeholder
//     //     let element = document.getElementById('h2CurrentBoard');
//     //     element.classList.add(bgColor1);
//     // }
//     // setBoardBgColor2(bgColor2){ // Placeholder
//     //     let element = document.getElementById('h2CurrentBoard');
//     //     element.classList.add(bgColor1);
//     // }

//     // Todo Onclick Functions
//     createOpenBoardBtn(){
//         let element = document.createElement("button");
//         element.id = 'btnOpenBoard';
//         element.classList.add();
//         element.innerHTML = `Open Board`;
//         element.addEventListener('click', (event) => {
//             let uploadInput = document.createElement('input');
//             uploadInput.type = 'file';
//             uploadInput.id = 'fileInput';
//             uploadInput.accept = 'json';

//             uploadInput.addEventListener('change', (event) => {
//                 const file = uploadInput.files[0];

//                 if (file){
//                     const reader = new FileReader()
//                     reader.onload = function(event) {
//                         const data = JSON.parse(event.target.result);
//                         board = loadBoard(data);
//                         rerender();
//                     };
//                     reader.readAsText(file);  
//                 }
//             })
//             uploadInput.click();
//         })
//         return element;
//     }
//     createSaveBoardBtn(){
//         let element = document.createElement("button");
//         element.id = 'btnSaveBoard';
//         element.classList.add();
//         element.innerHTML = `Save Board`;
//         element.addEventListener('click', (event) =>{
//             const filename = "newBoard.json";
//             const text = JSON.stringify(this.board);

//             let element = document.createElement('a');
//             element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
//             element.setAttribute('download', filename);
//             element.click();
//         });
//         return element;
//     }
//     createConfigureBoardBtn(){
//         let element = document.createElement("button");
//         element.id = 'btnConfigureBoard';
//         element.classList.add();
//         element.innerHTML = `Configure Board`;
//         element.addEventListener('click', (event) =>{
//             this.openConfig();
//         });
//         return element;
//     }
//     createNewBoardBtn(){ // Clear board is a more accurate way of calling this
//         let element = document.createElement("button");
//         element.id = 'btnNewBoard';
//         element.classList.add();
//         element.innerHTML = `New Board`;
//         element.addEventListener('click', (event) => {
//             board = loadBoardDefaults();
//             rerender();
//         });
//         return element;
//     }
//     createAddSectionBtn(){
//         let element = document.createElement("button");
//         element.id = 'btnAddSection';
//         element.classList.add();
//         element.innerHTML = `Add Section`;
//         element.addEventListener('click', (event) => {

//             let params = createDefaultSection();
//             params.id = board.contents.length;

//             this.pushSection(params);
//             rerender();
//         })
//         return element;
//     }

//     openConfig(){
//         let divPopup = document.createElement('div');
//         divPopup.classList.add('popup-container');

//         let pNameLabel = document.createElement('p');
//         pNameLabel.innerHTML = `Current name: ${this.name}`

//         let inputName = document.createElement('input');
//         inputName.type = 'text';
//         inputName.id = 'inputText'
//         inputName.placeholder = 'new name'

//         let divPopupBtnContainer = document.createElement('div');
//         divPopupBtnContainer.classList.add('popup-btn-container');

//         let btnSave = document.createElement('button');
//         btnSave.id = 'btnSave';
//         btnSave.innerHTML = 'Save'
//         btnSave.addEventListener('click', (event) => {
//             if (inputName.value !== '') {
//                 board.name = inputName.value;
                
//                 divPopup.parentNode.removeChild(divPopup);
//                 closeOverlay();
//                 rerender();
//             }
//         })

//         let btnClose = document.createElement('button');
//         btnClose.id = 'btnClose';
//         btnClose.innerHTML = 'Close'
//         btnClose.addEventListener('click', (event) => {
//             divPopup.parentNode.removeChild(divPopup);
//             closeOverlay();
//         })

//         divPopupBtnContainer.appendChild(btnSave);
//         divPopupBtnContainer.appendChild(btnClose);

//         divPopup.appendChild(pNameLabel);
//         divPopup.appendChild(inputName);
//         divPopup.appendChild(divPopupBtnContainer);

//         document.getElementById('divMainContainer').appendChild(divPopup);

//         openOverlay();
//     }
// }
// class Section {
//     // Create
//     constructor(id, index, name, bgColor, contents){
//         this.id = randomizeId(); // Deprecated
//         this.boardId = id;
//         this.index = index;
//         this.name = name !== null? name : 'New Section';
//         this.bgColor = bgColor !== null? bgColor : '#FFFFFF';

//         // Elements
//         this.sectionName = this.createSectionName(this.name);
        

//         this.contents = contents;
//     }

//     /* WIP */
//     // Edit 
//     set section([name, bgColor, contents]){
//         if (this.name !== name && name !== null) {
//             this.name = name;
//         }
//         // if (this.bgColor !== bgColor) {
//         //     this.bgColor = bgColor;
//         // }
//         if (JSON.stringify(this.contents) == JSON.stringify(contents)) {
//             this.contents = contents;
//         }
//     }

//     // Read
//     get section(){
//         return {
//             "name" : this.name,
//             "id"  : this.id,
//             "bgColor" : this.bgColor,
//             "contents" : this.contents
//         };
//     }

//     // Read : Render
//     render(){
//         // create div section container
//         let sectionContainer = document.createElement("div");
//         sectionContainer.classList.add(`section-container`);
//         sectionContainer.style.backgroundColor = this.bgColor;
        
//         // create child board details container
//         let sectionDetailsContainer = document.createElement("div");
//         sectionDetailsContainer.classList.add(`section-details-container`);
        
//         // board button container
//         let sectionButtonContainer = document.createElement("div");
//         sectionButtonContainer.classList.add(`section-btn-container`);

//         // append button container children
//         sectionButtonContainer.appendChild(this.configureSectionBtn);
        
//         // append board details container children
//         sectionDetailsContainer.appendChild(this.sectionName);
//         sectionDetailsContainer.appendChild(sectionButtonContainer);
        
//         // create section contents container
//         this.sectionContentsContainer = document.createElement("div");
//         this.sectionContentsContainer.classList.add('section-content-container');
//         this.sectionContentsContainer.classList.add(`SNo.${this.index}`)
//         this.sectionContentsContainer.classList.add(`droppable-for-task`);
//         this.sectionContentsContainer.addEventListener("dragover", (event) => {
//             event.preventDefault();

//             this.bottomTask = this.insertAboveTask(this.sectionContentsContainer, event.clientY);
//             this.draggingTask = document.querySelector(".is-dragging");
            
//             if (!this.bottomTask){
//                 this.sectionContentsContainer.appendChild(this.draggingTask);
//             } else {
//                 this.sectionContentsContainer.insertBefore(this.draggingTask, this.bottomTask);
//             };
//         });
//         this.sectionContentsContainer.addEventListener("drop", (event) => {
//             event.preventDefault();

//             const draggingTaskSectionIndex = Number(this.draggingTask.classList[1].slice(4,));
//             const draggingTaskIndex = Number(this.draggingTask.classList[2].slice(4,));
//             const prevTaskIndex = draggingTaskIndex;

//             if (!this.bottomTask){
//                 // Update Board JSON
//                 // * Append to end
//                 board.contents[this.index].contents.push(board.contents[draggingTaskSectionIndex].contents[draggingTaskIndex]);
//                 // * Delete element at index
//                 board.contents[draggingTaskSectionIndex].contents.splice(draggingTaskIndex, 1)

//                 rerender();
//             } else {
//                 // Update Board JSON
//                 const bottomTaskIndex = Number(this.bottomTask.classList[2].slice(4,))
//                 // * Append before bottom
//                 board.contents[this.index].contents.splice(bottomTaskIndex, 0, board.contents[draggingTaskSectionIndex].contents[draggingTaskIndex]);
//                 // * Delete element at index
//                 if(bottomTaskIndex < draggingTaskIndex){
//                     board.contents[draggingTaskSectionIndex].contents.splice(draggingTaskIndex+1, 1)
//                 }
//                 else{
//                     board.contents[draggingTaskSectionIndex].contents.splice(draggingTaskIndex, 1)
//                 }

//                 rerender();
//             };
//         })

//         for (let i = 0; i < this.contents.length; i++){
//             let task = new Task(this.index, i, this.contents[i].name, this.contents[i].bgColor);
//             let taskContainer = task.render()
//             this.sectionContentsContainer.appendChild(taskContainer);
//         }
//         sectionContainer.appendChild(sectionDetailsContainer);
//         sectionContainer.appendChild(this.sectionContentsContainer);
//         sectionContainer.appendChild(this.addTaskBtn);

//         return sectionContainer;
//     }

//     /* WIP */
//     // Insert
//     insert(index, task){
//         this.contents.splice(index, 0, task);
//     }
//     pushTask(task){
//         const newTask = task
//         this.contents.push(newTask);
//     }

//     insertAboveTask(sectionContentsContainer, mouseY) {
//         const eventListener = sectionContentsContainer.querySelectorAll('.draggable-to-section:not(.is-dragging)');

//         let closestTask = null;
//         let closestOffset = Number.NEGATIVE_INFINITY;

//         eventListener.forEach((taskContainers) => {
//             const { top } = taskContainers.getBoundingClientRect();

//             const offset = mouseY - top;

//             if (offset < 0 && offset > closestOffset) {
//                 closestOffset = offset;
//                 closestTask = taskContainers;
//             };
//         });
//         return closestTask;
//     }

//     // Delete
//     pop(){
//         this.contents.pop();
//     }
//     remove(index){
//         this.contents.splice(index, 1);
//     }
//     selfDelete(){
//         board.remove(this.index)
//         rerender()
//     }

//     // Elements
//     createSectionName(name){
//         let element = document.createElement("h4");
//         element.id = 'h4SectionName';
//         element.innerHTML = `${name}`;
//         return element;
//     }
//     setSectionName(name){
//         let element = document.getElementById('h4SectionName');
//         element.innerHTML = `${name}`;
//     }
//     createConfigureSectionBtn(){
//         let element = document.createElement("button");
//         element.id = 'configureSectionBtn';
//         element.classList.add();
//         element.innerHTML = `Configure Section`;
//         element.addEventListener('click', (event) => {
//             this.openConfig();
//         })
//         return element;
//     }
//     createAddTaskBtn(){
//         let element = document.createElement("button");
//         element.id = 'addTaskBtn';
//         element.classList.add();
//         element.innerHTML = `Add Task`;
//         element.addEventListener('click', () => {
//             let params = createDefaultTask();
//             this.pushTask(params);
//             rerender()
//         })
//         return element;
//     }

//     openConfig(){
//         let divPopup = document.createElement('div');
//         divPopup.classList.add('popup-container');

//         let pNameLabel = document.createElement('p');
//         pNameLabel.innerHTML = `Current name: ${this.name}`

//         let inputName = document.createElement('input');
//         inputName.type = 'text';
//         inputName.id = 'inputText'
//         inputName.placeholder = 'new name'

//         let divPopupBtnContainer = document.createElement('div');
//         divPopupBtnContainer.classList.add('popup-btn-container');

//         let btnSave = document.createElement('button');
//         btnSave.id = 'btnSave';
//         btnSave.innerHTML = 'Save'
//         btnSave.addEventListener('click', (event) => {
//             if (inputName.value !== '') {
//                 board.contents[this.index].name = inputName.value;
//                 // this.sectionLabel = inputName.value;
//                 divPopup.parentNode.removeChild(divPopup);
//                 closeOverlay();
//                 rerender();
//             }
//         })

//         let btnDelete = document.createElement('button');
//         btnDelete.id = 'btnDelete';
//         btnDelete.innerHTML = 'Delete';
//         btnDelete.addEventListener('click', (event) => {
//             this.selfDelete();

//             divPopup.parentNode.removeChild(divPopup);
//                 closeOverlay();
//                 rerender();
//         })

//         let btnClose = document.createElement('button');
//         btnClose.id = 'btnClose';
//         btnClose.innerHTML = 'Close'
//         btnClose.addEventListener('click', (event) => {
//             divPopup.parentNode.removeChild(divPopup);
//             closeOverlay();
//         })

//         divPopupBtnContainer.appendChild(btnSave);
//         divPopupBtnContainer.appendChild(btnDelete);
//         divPopupBtnContainer.appendChild(btnClose);

//         divPopup.appendChild(pNameLabel);
//         divPopup.appendChild(inputName);
//         divPopup.appendChild(divPopupBtnContainer);

//         document.getElementById('divMainContainer').appendChild(divPopup);

//         openOverlay();
//     }
// }
// class Task {
//     // Create
//     constructor(sectionIndex, index, name, bgColor,){
//         this.id = randomizeId();
//         this.index = index;
//         this.sectionIndex = sectionIndex;
//         this.name = name !== null ? name : 'New Task';
//         this.bgColor = bgColor !== null?  bgColor : '#FFFFFF';

//         this.taskName = this.createTaskName(name);
//         this.configureTaskBtn = this.createConfigureTaskBtn();
//     }

//     /* WIP */
//     // Edit
//     set task([name, bgColor]){
//         if (this.name !== name && name !== null) {
//             this.name = name;
//         }
//         if (this.bgColor !== bgColor) {
//             this.bgColor = bgColor;
//         }
//     }

//     // Read
//     get task(){
//         return {
//             "name" : this.name,
//             "id" : this.id,
//             "bgColor" : this.bgColor,
//         };
//     }

//     // Delete
//     selfDelete(){
//         const sectionsReference = board.contents;
//         for (let i = 0; i < sectionsReference.length; i++){
//             if (this.sectionIndex === sectionsReference[i].id) {
//                 ((board.contents)[i].contents).splice(this.index, 1);
//                 rerender()
//                 break
//             }
//         }
//     }

//     // Read : Render
//     render(){
//         // create div section container
//         let taskContainer = document.createElement("div");
//         taskContainer.classList.add(`task-container`);
//         taskContainer.classList.add(`SNo.${this.sectionIndex}`)
//         taskContainer.classList.add(`TNo.${this.index}`)
//         taskContainer.style.backgroundColor = this.bgColor;
//         taskContainer.draggable = true;
        
//         taskContainer.classList.add(`draggable-to-section`);
//         taskContainer.addEventListener('dragstart', () => {
//             taskContainer.classList.add('is-dragging');
//         });
//         taskContainer.addEventListener("dragend", () => {
//             taskContainer.classList.remove('is-dragging');
//         });
        
//         // create child board details container
//         let taskDetailsContainer = document.createElement("div");
//         taskDetailsContainer.classList.add(`task-details-container`);

//         // board button container
//         let taskButtonContainer = document.createElement("div");
//         taskButtonContainer.classList.add(`task-btn-container`);

//         // append button container children
//         taskButtonContainer.appendChild(this.configureTaskBtn);

//         // append board details container children
//         taskDetailsContainer.appendChild(this.taskName);
//         taskDetailsContainer.appendChild(taskButtonContainer);

//         // create section contents container
//         let taskContentsContainer = document.createElement("div");
//         /* FUTURE WIP */
//         // // taskContentsContainer.classList.add('task-contents-container');
//         // // for (let i = 0; i < this.contents.length; i++){
//         // //     let task = Task(this.contents[i]);
//         // //     taskContentsContainer.appendChild(task);
//         // // }
//         taskContainer.appendChild(taskDetailsContainer);
//         taskContainer.appendChild(taskContentsContainer);

//         return taskContainer;
//     }

//     // Elements
//     createTaskName(name){
//         let element = document.createElement("p");
//         element.id = 'taskname';
//         element.innerHTML = `${name}`;
//         return element;
//     }
//     createConfigureTaskBtn(){
//         let element = document.createElement("button");
//         element.id = 'configureTaskBtn';
//         element.classList.add();
//         element.innerHTML = `Configure Task`;
//         element.addEventListener('click', (event) => {
//             this.openConfig()
//         })
//         return element;
//     }

//     openConfig(){
//         let divPopup = document.createElement('div');
//         divPopup.classList.add('popup-container');

//         let pNameLabel = document.createElement('p');
//         pNameLabel.innerHTML = `Current name: ${this.name}`

//         let inputName = document.createElement('input');
//         inputName.type = 'text';
//         inputName.id = 'inputText'
//         inputName.placeholder = 'new name'

//         let divPopupBtnContainer = document.createElement('div');
//         divPopupBtnContainer.classList.add('popup-btn-container');

//         let btnSave = document.createElement('button');
//         btnSave.id = 'btnSave';
//         btnSave.innerHTML = 'Save'
//         btnSave.addEventListener('click', (event) => {
//             if (inputName.value !== '') {
//                 board.contents[this.sectionIndex].contents[this.index].name = inputName.value;
                
//                 divPopup.parentNode.removeChild(divPopup);
//                 closeOverlay();
//                 rerender();
//             }
//         })

//         let btnDelete = document.createElement('button');
//         btnDelete.id = 'btnDelete';
//         btnDelete.innerHTML = 'Delete';
//         btnDelete.addEventListener('click', (event) => {
//             this.selfDelete();

//             divPopup.parentNode.removeChild(divPopup);
//                 closeOverlay();
//                 rerender();
//         })

//         let btnClose = document.createElement('button');
//         btnClose.id = 'btnClose';
//         btnClose.innerHTML = 'Close'
//         btnClose.addEventListener('click', (event) => {
//             divPopup.parentNode.removeChild(divPopup);
//             closeOverlay();
//         })

//         divPopupBtnContainer.appendChild(btnSave);
//         divPopupBtnContainer.appendChild(btnDelete);
//         divPopupBtnContainer.appendChild(btnClose);

//         divPopup.appendChild(pNameLabel);
//         divPopup.appendChild(inputName);
//         divPopup.appendChild(divPopupBtnContainer);

//         document.getElementById('divMainContainer').appendChild(divPopup);

//         openOverlay();
//     }
// }

// Board Loading
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
    renderBoardToMain(board.render()); // Global reliant but intentional
}

// Main
let board = load();