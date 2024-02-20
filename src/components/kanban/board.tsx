import React from 'react';
import { Board as BoardInterface, KanbanContext } from '../../stores/kanban';

const Board = ({ children, boardData }: { children: React.ReactNode, boardData: BoardInterface }) => {

    const { editor, moveTask, addTask } = React.useContext(KanbanContext);
    const [editorState] = editor;
    const [showAddTask, setShowAddTask] = React.useState(false);
    const [newTask, setNewTask] = React.useState({ title: '' });

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        moveTask(editorState.fromBoardId, editorState.toBoardId, editorState.cardId, editorState.targetTaskId);
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    }

    const submitTask = () => {
        if (!newTask.title) return alert('Task title is required');

        const id = Math.floor(Math.random() * 1000);
        const payload = { id, ...newTask };
        addTask(boardData.id, { ...payload, status: boardData.name });
        setNewTask({ title: '' });
        setShowAddTask(false);
    }

    return (
        <div
            className='board-container'
            onDrop={onDrop}
        >
            <div className='board-header'>
                <div className='title'>{boardData.name}</div>
            </div>
            <div className='board-body'>
                {children}

                {showAddTask && (
                    <div className='input-task'>
                        <input type='text' placeholder='Task Title' name='title' value={newTask.title} onChange={onInputChange} />
                    </div>
                )}
            </div>
            <div className='board-footer'>
                {!showAddTask ? (
                    <button className='add-task' onClick={() => setShowAddTask(true)}>+ Add Task</button>
                ) : (
                    <>
                        <button className='add-task submit' onClick={submitTask}>Save</button>
                        <button className='add-task cancel' onClick={() => setShowAddTask(false)}>Cancel</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Board;