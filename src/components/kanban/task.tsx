import React from "react";
import { KanbanContext, Task as TaskInterface } from "../../stores/kanban";

const Task = ({ taskData, boardId, index }: { taskData: TaskInterface, boardId: number, index: number }) => {
    index;
    const { editor, deleteTask } = React.useContext(KanbanContext);
    const [editorState, setEditorState] = editor;
    const [isDragging, setIsDragging] = React.useState(false);

    const dragStart = () => {
        setEditorState({ ...editorState, cardId: taskData.id, fromBoardId: boardId });
        setIsDragging(true);
    };

    const dragEnd = () => {
        setIsDragging(false);
    };

    const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setEditorState({ ...editorState, toBoardId: boardId, targetTaskId: taskData.id });
    }

    if (taskData.id === 0) {
        return (
            <div
                className={`task-container empty`}
                onDragOver={dragOver}
                onDragEnd={dragEnd}
            >
                + Add Task
            </div>
        )
    }

    return (
        <div
            className={`task-container ${isDragging ? 'dragging' : ''}`}
            draggable="true"
            onDragStart={dragStart}
            onDragEnd={dragEnd}
            onDragOver={dragOver}
        >
            <button className="delete-task" onClick={() => deleteTask(boardId, taskData.id)}>x</button>
            <div>{taskData.title} {isDragging ? '👀' : ''}</div>
            <div className="description">{taskData.description}</div>
        </div>
    )
};

export default Task;