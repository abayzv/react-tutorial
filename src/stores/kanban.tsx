import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: string;
}

export interface Board {
    id: number;
    name: string;
    tasks: Task[];
}

interface Kanban {
    id: number;
    name: string;
    description?: string;
    boards: Board[];
}

interface Editor {
    cardId: number;
    fromBoardId: number;
    toBoardId: number;
    targetTaskId?: number;
}

interface KanbanContext {
    kanban: [Kanban, React.Dispatch<React.SetStateAction<Kanban>>];
    editor: [Editor, React.Dispatch<React.SetStateAction<Editor>>];
    addBoard: (board: Board) => void;
    deleteBoard: (boardId: number) => void;
    addTask: (boardId: number, task: Task) => void;
    deleteTask: (boardId: number, taskId: number) => void;
    moveTask: (fromBoardId: number, toBoardId: number, taskId: number, taskTargetId?: number) => void;
    addEmptyTask: (boardId: number, index: number) => void;
    removeEmptyTask: (boardId: number) => void;
}

export const KanbanContext: React.Context<KanbanContext> = React.createContext({} as KanbanContext);

export const KanbanProvider = ({ children }: { children: React.ReactNode }) => {
    const kanbanData: Kanban = {
        id: 1,
        name: "Project 1",
        description: "Your project description goes here.",
        boards: [
            {
                id: 1,
                name: "To Do",
                tasks: [
                    {
                        id: 1,
                        title: "Task 1",
                        description: "Description 1",
                        status: "To Do"
                    },
                    {
                        id: 2,
                        title: "Task 2",
                        description: "Description 2",
                        status: "To Do"
                    }
                ]
            },
            {
                id: 2,
                name: "In Progress",
                tasks: [
                    {
                        id: 3,
                        title: "Task 3",
                        description: "Description 3",
                        status: "In Progress"
                    }
                ]
            },
            {
                id: 3,
                name: "Done",
                tasks: [
                    {
                        id: 4,
                        title: "Task 4",
                        description: "Description 4",
                        status: "Done"
                    }
                ]
            }
        ]
    }

    const [kanban, setKanban] = useLocalStorage('kanban', kanbanData) as [Kanban, React.Dispatch<React.SetStateAction<Kanban>>];
    const [editor, setEditor] = React.useState({ cardId: 0, fromBoardId: 0, toBoardId: 0 });

    const addBoard = (board: Board) => {
        setKanban({ ...kanban, boards: [...kanban.boards, board] });
    }
    const deleteBoard = (boardId: number) => {
        setKanban({ ...kanban, boards: kanban.boards.filter(board => board.id !== boardId) });
    }
    const addTask = (boardId: number, task: Task) => {
        const newBoards = kanban.boards.map(board => {
            if (board.id === boardId) {
                return { ...board, tasks: [...board.tasks, task] };
            }
            return board;
        });
        setKanban({ ...kanban, boards: newBoards });
    }
    const deleteTask = (boardId: number, taskId: number) => {
        const newBoards = kanban.boards.map(board => {
            if (board.id === boardId) {
                return { ...board, tasks: board.tasks.filter(task => task.id !== taskId) };
            }
            return board;
        });
        setKanban({ ...kanban, boards: newBoards });
    }
    const moveTask = (fromBoardId: number, toBoardId: number, taskId: number, taskTargetId?: number) => {
        if (fromBoardId === toBoardId) {
            // if task target id is provided, then move the task to the target id
            if (taskTargetId) {
                const fromBoard = kanban.boards.find(board => board.id === fromBoardId);
                if (fromBoard) {
                    const taskIndex = fromBoard.tasks.findIndex(task => task.id === taskId);
                    const targetIndex = fromBoard.tasks.findIndex(task => task.id === taskTargetId);
                    const newTasks = [...fromBoard.tasks];
                    const [task] = newTasks.splice(taskIndex, 1);
                    newTasks.splice(targetIndex, 0, task);
                    const newFromBoard = { ...fromBoard, tasks: newTasks };
                    const newBoards = kanban.boards.map(board => {
                        if (board.id === fromBoardId) {
                            return newFromBoard;
                        }
                        return board;
                    });

                    setKanban({ ...kanban, boards: newBoards });
                }
            }

            return;
        }

        const fromBoard = kanban.boards.find(board => board.id === fromBoardId);
        const toBoard = kanban.boards.find(board => board.id === toBoardId);
        if (fromBoard && toBoard) {
            const task = fromBoard.tasks.find(task => task.id === taskId);
            if (task) {
                const newFromBoard = { ...fromBoard, tasks: fromBoard.tasks.filter(task => task.id !== taskId) };
                const newToBoard = { ...toBoard, tasks: [...toBoard.tasks, task] };
                const newBoards = kanban.boards.map(board => {
                    if (board.id === fromBoardId) {
                        return newFromBoard;
                    }
                    if (board.id === toBoardId) {
                        return newToBoard;
                    }
                    return board;
                });
                setKanban({ ...kanban, boards: newBoards });
            }
        }
    }
    const addEmptyTask = (boardId: number, index: number) => {
        const emptyTask: Task = { id: 0, title: '', description: '', status: '' };

        // if board has empty task, then return
        const board = kanban.boards.find(board => board.id === boardId);
        if (board && board.tasks.find(task => task.id === 0)) {
            return;
        }

        // add empty task
        // if index is 0, then add it to the beginning, else add it before the index

        if (index === 0) {
            const board = kanban.boards.find(board => board.id === boardId);
            if (board) {
                const tasks = [emptyTask, ...board.tasks];
                const newBoard = { ...board, tasks };
                const newBoards = kanban.boards.map(board => {
                    if (board.id === boardId) {
                        return newBoard;
                    }
                    return board;
                });
                setKanban({ ...kanban, boards: newBoards });
            }
        } else {
            const board = kanban.boards.find(board => board.id === boardId);
            if (board) {
                const tasks = board.tasks.slice(0, index);
                tasks.push(emptyTask);
                tasks.push(...board.tasks.slice(index));
                const newBoard = { ...board, tasks };
                const newBoards = kanban.boards.map(board => {
                    if (board.id === boardId) {
                        return newBoard;
                    }
                    return board;
                });
                setKanban({ ...kanban, boards: newBoards });
            }
        }
    }

    const removeEmptyTask = (boardId: number) => {
        const board = kanban.boards.find(board => board.id === boardId);
        if (board) {
            const tasks = board.tasks.filter(task => task.id !== 0);
            const newBoard = { ...board, tasks };
            const newBoards = kanban.boards.map(board => {
                if (board.id === boardId) {
                    return newBoard;
                }
                return board;
            });
            setKanban({ ...kanban, boards: newBoards });
        }
    }

    const storeKanban: KanbanContext = {
        kanban: [kanban, setKanban],
        editor: [editor, setEditor],
        addBoard,
        deleteBoard,
        addTask,
        deleteTask,
        moveTask,
        addEmptyTask,
        removeEmptyTask
    }

    return (
        <KanbanContext.Provider value={storeKanban}>
            {children}
        </KanbanContext.Provider>
    );
}