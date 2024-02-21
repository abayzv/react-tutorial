import React from "react";
import { KanbanContext } from "../../stores/kanban";
import "./kanban.css";
import Board from "./board";
import Task from "./task";
import { Task as TaskInterface } from "../../stores/kanban";
import { Activity as ActivityInterface } from "../../stores/kanban";
import Modal from "../modal/modal";
import { IoMdCard } from "react-icons/io";
import { FaAlignLeft } from "react-icons/fa6";
import { RxActivityLog } from "react-icons/rx";
import { FaTrash, FaTags } from "react-icons/fa";
import { ImBoxRemove } from "react-icons/im";
import { RiAttachment2 } from "react-icons/ri";
import { IoDuplicate } from "react-icons/io5";

const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()} at ${d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
}

const Kanban = () => {
    const { kanban, detail, getTaskDetail, resetDetail, updateTask } = React.useContext(KanbanContext);
    const [kanbanState] = kanban;
    const [detailState, setDetailState] = detail;
    const { boards } = kanbanState;
    const [showModal, setShowModal] = React.useState(false);

    const renderTasks = (tasks: Array<TaskInterface>, boardId: number) => {

        if (tasks.length === 0) {
            return (
                <Task key={0} taskData={{ id: 0, title: '', description: '', status: '' }} boardId={boardId} index={-1} />
            )
        }

        return tasks.map((task: TaskInterface, index: number) => {
            return (
                <div key={index} onClick={() => getTaskDetail(task.id)}>
                    <Task taskData={task} boardId={boardId} index={index} />
                </div>
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

    const renderActivity = (activity: Array<ActivityInterface> | undefined) => {
        if (!activity || activity.length == 0) return (
            <div className="no-activity">
                <div>No activity</div>
            </div>
        )

        return activity.map((log, index) => {
            return (
                <div key={index} className="activity-item">
                    <div className="activity-title">{log.description}</div>
                    <div className="activity-time">{formatDate(log.date)}</div>
                </div>
            );
        });
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDetailState({ ...detailState, description: e.target.value });
    }

    const onModalClose = () => {
        setShowModal(false);
        resetDetail();
    }

    React.useEffect(() => {
        if (detailState.id !== 0) {
            setShowModal(true);
        }
    }, [detailState]);

    return (
        <>
            <div className="kanban-container">
                <div className="kanban-header">
                    <div className="title">{kanbanState.name}</div>
                    <div className="org">Mahesadev</div>
                </div>
                <div className="kanban-body">
                    {renderBoards()}
                </div>
            </div>
            <Modal isOpen={showModal} onClose={onModalClose}>
                <div style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
                    <div className="task-detail">
                        <div className="section">
                            <IoMdCard className="icon" />
                            <div className="body">
                                <div className='title'>{detailState.title}</div>
                                <div className="detail-status">in list <span style={{ textDecoration: 'underline' }}>{detailState.status}</span></div>
                            </div>
                        </div>
                        <div className="section">
                            <FaAlignLeft className="icon" />
                            <div className="body">
                                <div>Description</div>
                                <textarea value={detailState.description} onChange={handleDescriptionChange}></textarea>
                            </div>
                        </div>
                        <div className="section">
                            <RxActivityLog className="icon" />
                            <div className="body">
                                <div>Activity</div>
                                <div className="activity-log">
                                    {renderActivity(detailState.activity)}
                                </div>
                            </div>
                        </div>

                        <div className="detail-footer">
                            <button className="save" onClick={updateTask}>Update</button>
                        </div>
                    </div>
                    <div className="task-sidebar">
                        <button className="btn"><FaTrash /> Delete</button>
                        <button className="btn"><ImBoxRemove /> Move To</button>
                        <button className="btn"><FaTags /> Labels</button>
                        <button className="btn"><RiAttachment2 /> Attachments</button>
                        <button className="btn"><IoDuplicate /> Duplicate</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default Kanban;