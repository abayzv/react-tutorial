import React from 'react';
import { Board as BoardInterface, KanbanContext } from '../../stores/kanban';
import autoAnimate from '@formkit/auto-animate';
import { IoClose } from 'react-icons/io5';

const Board = ({ children, boardData }: { children: React.ReactNode, boardData: BoardInterface }) => {

    const { editor, moveTask, addTask, updateBoard, deleteBoard } = React.useContext(KanbanContext);
    const [editorState] = editor;
    const [showAddTask, setShowAddTask] = React.useState(false);
    const [newTask, setNewTask] = React.useState({ title: '' });
    const [showInput, setShowInput] = React.useState(false);

    const parent = React.useRef<HTMLDivElement>(null);

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        moveTask(editorState.fromBoardId, editorState.toBoardId, editorState.cardId, editorState.targetTaskId);
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    }

    const [board, setBoard] = React.useState(boardData);

    const onChangeBoardName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setBoard({ ...board, name: value });
    }

    const submitTask = () => {
        if (!newTask.title) return alert('Task title is required');
        const id = Math.floor(Math.random() * 1000);
        const payload = { id, ...newTask };
        const activity = {
            id: Math.floor(Math.random() * 1000),
            title: `Task created`,
            description: `Task ${id} created in ${boardData.name}`,
            date: new Date().toISOString(),
        }
        addTask(boardData.id, { ...payload, status: boardData.name, activity: [activity] });
        setNewTask({ title: '' });
        setShowAddTask(false);
    }

    React.useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    return (
        <div className="board-wrapper">
            <div
                className='board-container'
                onDrop={onDrop}
            >
                <div className='close' onClick={() => deleteBoard(boardData.id)}><IoClose /></div>
                <div className='board-header'>
                    {showInput ? (
                        <div className='input-title'>
                            <input type='text' placeholder='Search' value={board.name} onChange={onChangeBoardName} />
                            <button onClick={() => {
                                updateBoard(board);
                                setShowInput(false);
                            }} >save</button>
                        </div>
                    ) : (
                        <div className='title' onClick={() => setShowInput(true)}>{board.name}</div>
                    )}
                </div>
                <div ref={parent} className='board-body'>
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
        </div>
    );
}

export default Board;