import React from "react";
import { Labels } from "../../stores/kanban";
import { KanbanContext } from "../../stores/kanban";

const ManageLabels = () => {
    const { labels: labelsData, labelColors, detail, editLabelOnTask } = React.useContext(KanbanContext);

    const [detailState] = detail;
    const [labels, setLabels] = labelsData;
    const [newLabel, setNewLabel] = React.useState({ name: '', color: labelColors[0] });
    const [editLabel, setEditLabel] = React.useState({} as Labels);
    const [isCreateLabel, setIsCreateLabel] = React.useState(false);
    const [isEditLabel, setIsEditLabel] = React.useState(false);

    const deleteLabel = (id: number) => {
        setLabels(labels.filter(label => label.id !== id));
        setIsEditLabel(false);
    }

    const renderManageLabels = () => {
        return (
            <>
                <div>Labels</div>
                <div className="label-list">
                    {labels.map((label, index) => {
                        return (
                            <div key={index} className="label-picker">
                                <input type="checkbox" checked={detailState.labels?.includes(label.id)} onChange={(e) => editLabelOnTask(label, e.target.checked)} />
                                <div className="label-item" style={{ backgroundColor: label.color, color: '#fff' }} onClick={() => {
                                    setEditLabel({ ...label });
                                    setIsEditLabel(true);
                                }}>
                                    {label.name}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button className="btn mt-2" onClick={() => setIsCreateLabel(true)}>+ Create Label</button>
            </>
        )
    }

    const renderCreateLabel = () => {

        return (
            <div>
                <div>Create Label</div>
                <div className="mt-1">
                    {/* preview */}
                    <div className="label-item" style={{ backgroundColor: newLabel.color }}>
                        {newLabel.name}
                    </div>
                </div>

                <input className="my-2" type='text' placeholder='Label Name' value={newLabel.name} onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })} />
                <div className="color-picker">
                    {labelColors.map((color, index) => {
                        return (
                            <div className="color" key={index} style={{ backgroundColor: color }} onClick={() => setNewLabel({ ...newLabel, color })}></div>
                        );
                    })}
                </div>
                <button className="btn mt-2" onClick={() => {
                    if (!newLabel.name) return alert('Label name is required');
                    setLabels([...labels, { ...newLabel, id: labels.length + 1 }]);
                    setNewLabel({ name: '', color: labelColors[0] });
                    setIsCreateLabel(false);
                }}>Save</button>
                <button className="btn mt-1" onClick={() => setIsCreateLabel(false)}>Cancel</button>
            </div>
        )

    }

    const renderEditLabel = () => {
        return (
            <div>
                <div>Edit Label</div>
                <div className="mt-1">
                    {/* preview */}
                    <div className="label-item" style={{ backgroundColor: editLabel.color }}>
                        {editLabel.name}
                    </div>
                </div>

                <input className="my-1" type='text' placeholder='Label Name' value={editLabel.name} onChange={(e) => setEditLabel({ ...editLabel, name: e.target.value })} />
                <div className="color-picker">
                    {labelColors.map((color, index) => {
                        return (
                            <div className="color" key={index} style={{ backgroundColor: color }} onClick={() => setEditLabel({ ...editLabel, color })}></div>
                        );
                    })}
                </div>
                <button className="btn mt-2" onClick={() => {
                    if (!editLabel.name) return alert('Label name is required');
                    setLabels(labels.map(label => label.id === editLabel.id ? editLabel : label));
                    setIsEditLabel(false);
                }}>Save</button>
                <button className="btn mt-1" style={{ backgroundColor: 'red' }} onClick={() => deleteLabel(editLabel.id)}>Delete</button>
                <button className="btn mt-1" onClick={() => setIsEditLabel(false)}>Cancel</button>
            </div>
        )

    }

    return (
        <div className="labels">
            {!isCreateLabel && !isEditLabel && renderManageLabels()}
            {isCreateLabel && renderCreateLabel()}
            {isEditLabel && renderEditLabel()}
        </div>
    )

};

export default ManageLabels;