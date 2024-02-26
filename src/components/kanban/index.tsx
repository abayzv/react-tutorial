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
import Dropdown from "../dropdown/dropdown";
import ManageLabels from "../kanban/manageLabels";
import autoAnimate from '@formkit/auto-animate';

const styles = {
    select: {
        marginTop: '0.5rem',
        width: '100%',
        padding: '0.5rem',
        border: '#aeaeae 1px solid',
        borderRadius: '5px',
        backgroundColor: '#f2f2f2',
        outline: 'none',
    }
}

const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()} at ${d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
}

const Kanban = () => {
    const { kanban, detail, getTaskDetail, resetDetail, updateTask, moveTask, labels, duplicateTask, deleteTask, getBoardByTaskId, addBoard } = React.useContext(KanbanContext);

    const [labelState] = labels;
    const [kanbanState] = kanban;
    const [detailState, setDetailState] = detail;
    const { boards } = kanbanState;
    const [showModal, setShowModal] = React.useState(false);

    const parent = React.useRef<HTMLDivElement>(null);

    const moveTaskTo = (boardId: number) => {
        console.log('move task to', boardId);
        const fromBoardId = boards.find(board => board.name === detailState.status)?.id;
        if (!fromBoardId) return;
        moveTask(fromBoardId, boardId, detailState.id);
    };

    const getLabel = (id: number) => {
        return labelState.find(label => label.id === id);
    }

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

    const renderMoveTo = () => {
        return (
            <>
                <div>Move task to</div>
                <select style={styles.select} onChange={(e) => moveTaskTo(parseInt(e.target.value))}>
                    <option value={0}>Select Board</option>
                    {boards.map((board, index) => {
                        if (board.name === detailState.status) return null;

                        return (
                            <option key={index} value={board.id}>
                                {board.name}
                            </option>
                        );
                    })}
                </select>
            </>
        )
    }

    const renderDuplicateTo = () => {
        return (
            <>
                <div>Duplicate task to</div>
                <select style={styles.select} onChange={(e) => duplicateTask(parseInt(e.target.value), detailState.id)}>
                    <option value={0}>Select Board</option>
                    {boards.map((board, index) => {
                        return (
                            <option key={index} value={board.id}>
                                {board.name}
                            </option>
                        );
                    })}
                </select>
            </>
        )
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

        parent.current && autoAnimate(parent.current);

    }, [detailState, parent]);

    return (
        <>
            <div className="kanban-header">
                <div className="title">{kanbanState.name}</div>
                <div className="btn-transparent" onClick={() => {
                    addBoard({ id: Math.floor(Math.random() * 1000), name: 'New Board', tasks: [] });
                }}>+</div>
            </div>
            <div className="kanban-container">
                <div ref={parent} className="kanban-body">
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
                            {detailState.labels && (
                                <div className="label-detail">
                                    {detailState.labels.map((label, index) => {
                                        return (
                                            <div key={index} className="label-detail-item" style={{ backgroundColor: getLabel(label)?.color }}>{getLabel(label)?.name}</div>
                                        );
                                    }
                                    )}
                                </div>
                            )
                            }
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
                        <button className="btn" style={{ backgroundColor: '#ff5d52' }} onClick={() => {
                            deleteTask(getBoardByTaskId(detailState.id).id, detailState.id);
                            onModalClose();
                        }}><FaTrash /> Delete</button>

                        {/* Move To */}
                        <Dropdown className="btn" title="Move To" icon={<ImBoxRemove />}>
                            {renderMoveTo()}
                        </Dropdown>

                        {/* Labels */}
                        <Dropdown className="btn" title="Labels" icon={<FaTags />}>
                            <ManageLabels />
                        </Dropdown>

                        <button className="btn"><RiAttachment2 /> Attachments</button>

                        {/* Duplicate */}
                        <Dropdown className="btn" title="Duplicate" icon={<IoDuplicate />}>
                            {renderDuplicateTo()}
                        </Dropdown>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default Kanban;