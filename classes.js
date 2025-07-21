// Classes
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
        // this.setBoardBgColor1(bgColor1);
        // this.setBoardBgColor2(bgColor2);

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

    // Insert
    insert(index, section){
        this.contents.splice(index, 0, section)
    }
    pushSection(section){
        const newSection = section
        this.contents.push(newSection)
    }
    
    Delete
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
        element.addEventListener('click', (event) => {
            
        })

        return element;
    }
    createAddSectionBtn(){
        var element = document.createElement("button");
        element.id = 'addSectionBtn'; // Placeholder
        element.classList = ''; // Placeholder
        element.innerHTML = `Add Section`;
        element.addEventListener('click', (event) => {
            console.log('click')
            // this.pushSection(createDefaultSection());
            var params = createDefaultSection()
            params.id = board.contents.length
            this.pushSection(params)
            rerender()
        })
        return element;
    }

}

class Section {
    // Create
    constructor(id, index, name, bgColor, contents){
        this.id = randomizeId();
        this.index = index;
        this.boardId = id;
        this.name = name;
        this.bgColor = '#FFFFFF';

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
            "name" : this.name,
            "id"  : this.id,
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
            var task = new Task(this.index, i, this.contents[i].name);
            var taskContainer = task.render()
            sectionContentsContainer.appendChild(taskContainer);
        }
        sectionContainer.appendChild(sectionDetailsContainer);
        sectionContainer.appendChild(this.addTaskBtn);
        sectionContainer.appendChild(sectionContentsContainer);

        return sectionContainer;
    }

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
    createConfigureSectionBtn(){
        var element = document.createElement("button");
        element.id = 'configureSectionBtn';
        element.classList = ''; // Placeholder
        element.innerHTML = `Configure Section`;
        element.addEventListener('click', (event) => {
            this.selfDelete()
        })
        return element;
    }
    createAddTaskBtn(){
        var element = document.createElement("button");
        element.id = 'addTaskBtn';
        element.classList = ''; // Placeholder
        element.innerHTML = `Add Task`;
        element.addEventListener('click', () => {
            var params = createDefaultTask;
            this.pushTask(createDefaultTask());
            rerender()
        })
        return element;
    }

}

class Task {
    // Create
    constructor(sectionIndex, index, name){
        this.id = randomizeId();
        this.index = index;
        this.sectionIndex = sectionIndex;
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
                console.log(((board.contents)[i].contents));
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
        // // taskContentsContainer.classList = 'task-contents-container';
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
        element.classList = ''; // Placeholder
        element.innerHTML = `Configure Task`;
        element.addEventListener('click', (event) => {
            this.selfDelete()
        })
        return element;
    }
}