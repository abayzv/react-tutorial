import React from "react";
import { MembersContext } from "../stores/members";

export const MemberForm = () => {
    const { members } = React.useContext(MembersContext)
    const [membersData, setMembers] = members
    const [formData, setFormData] = React.useState({ name: "", age: 0 })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const newMember = {
            id: membersData.length + 1,
            name: formData.name,
            age: formData.age
        }
        setMembers([...membersData, newMember])
        setFormData({ name: "", age: 0 })
    }

    return (
        <>
            <h1>Add Member</h1>
            <form onSubmit={submitForm}>
                <input type="text" placeholder="Name" name="name" onChange={handleChange} value={formData.name} />
                <input type="number" placeholder="Age" name="age" onChange={handleChange} value={formData.age} />
                <button type="submit">Add</button>
            </form>
        </>
    )
}