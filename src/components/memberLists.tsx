import React from "react";
import { MembersContext } from "../stores/members";

export const MemberLists = () => {
    const { members } = React.useContext(MembersContext);
    const [membersData] = members;

    return (
        <div>
            <h1>Members</h1>
            <ul>
                {membersData.map((member) => (
                    <li key={member.id}>{member.name} - {member.age}</li>
                ))}
            </ul>
        </div>
    );
}