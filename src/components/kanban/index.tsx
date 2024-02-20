import React from "react";
import { KanbanContext } from "../../stores/kanban";
import "./kanban.css";
import Board from "./board";
import Task from "./task";
import { Task as TaskInterface } from "../../stores/kanban";

const Kanban = () => {

    const { kanban } = React.useContext(KanbanContext);
    const [kanbanState] = kanban;

    const { boards } = kanbanState;

    const renderTasks = (tasks: Array<TaskInterface>, boardId: number) => {

        if (tasks.length === 0) {
            return (
                <Task key={0} taskData={{ id: 0, title: '', description: '', status: '' }} boardId={boardId} index={-1} />
            )
        }

        return tasks.map((task: TaskInterface, index: number) => {
            return (
                <Task key={index} taskData={task} boardId={boardId} index={index} />
            );
        });
    };

    const renderBoards = () => {
        return boards.map((board, index) => {
            return (
                <Board key={index} boardData={board}>
                    {renderTasks(board.tasks, board.id)}
                </Board>
            );
        });
    }

    return (
        <div className="kanban-container">
            <div className="kanban-header">
                <div className="title">{kanbanState.name}</div>
                <div className="org">Mahesadev</div>
            </div>
            <div className="kanban-body">
                {renderBoards()}
            </div>
        </div>
    );
}

export default Kanban;