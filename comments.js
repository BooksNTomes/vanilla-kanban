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