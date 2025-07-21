// Loading and Rendering
function load(){
    const thisBoard = loadBoardDefaults()
    renderBoard(thisBoard.render())
    return thisBoard
}

function renderBoard(boardContainer){
    document.getElementById("main-container").appendChild(boardContainer);
}

function rerender(){
    const boardContainer = document.getElementsByClassName("board-container")
    while (boardContainer.length !== 0){
        boardContainer[0].parentNode.removeChild(boardContainer[0])
    }
    renderBoard(board.render())
}

// Board Loading
function loadBoard(data){
    if (data !== null){
        board = new Board(data.name, data.bgColor1, data.bgColor2, data.contents)
    }

    return board
}

function loadBoardDefaults(){
    var board = createDefaultBoard()
    var board = new Board(board.name, board.bgColor1, board.bgColor2, board.contents)

    return board
}

// JSON Operations
function parseModelsToJSON(board){
    return JSON.stringify(board.board)
}

function saveModelsToJSON(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// Main
var board = load();
const mainContainer = document.getElementById("main-container")

const openBoardBtn = (document.getElementById("openBoardBtn"))
const uploadContainer = (document.getElementById("upload-container"))
var openBoardState = 'closed';

function openUploadContainer(){
    var uploadInput = document.createElement('input')
    uploadInput.type = 'file'
    uploadInput.id = 'fileInput'
    uploadInput.accept = 'json'

    var uploadButton = document.createElement('button')
    uploadButton.innerHTML = 'Open JSON'
    uploadButton.addEventListener('click', (event) => {
        console.log('clicked')
        const file = uploadInput.files[0]
        console.log(file)
        
        if (file){
            const reader = new FileReader()
            reader.onload = function(event) {
                const data = JSON.parse(event.target.result);
                console.log(data)
                board = loadBoard(data)
                rerender()
                closeUploadContainer()
            };
            reader.readAsText(file)    
        }
    })
    uploadContainer.appendChild(uploadInput)
    uploadContainer.appendChild(uploadButton)
}

function closeUploadContainer(){
    while(uploadContainer.children.length !== 0){
        console.log((uploadContainer.children))
        uploadContainer.removeChild((uploadContainer.children)[0])
    }
}

openBoardBtn.addEventListener('click', (event) => {
    openBoardState = openBoardState === 'closed' ? 'opened' : 'closed'       
    if (openBoardState  === 'opened') {
        openUploadContainer()
    }   
    else {
        closeUploadContainer()
    }
})