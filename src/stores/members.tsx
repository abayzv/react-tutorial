import React from "react";

interface Member {
  id: number;
  name: string;
  age: number;
}

interface MemberContext {
  members: [Member[], React.Dispatch<React.SetStateAction<Member[]>>];
}

export const MembersContext: React.Context<MemberContext> = React.createContext({} as MemberContext);

export const MembersProvider = ({ children }: { children: React.ReactNode }) => {
  const membersData: Member[] = [
    {
      id: 1,
      name: "John Doe",
      age: 30,
    },
    {
      id: 2,
      name: "Jane Doe",
      age: 25,
    },
    {
      id: 3,
      name: "Jack Doe",
      age: 27,
    }
  ]

  const [members, setMembers] = React.useState(membersData);
  const storeMembers: MemberContext = {
    members: [members, setMembers]
  }

  return (
    <MembersContext.Provider value={storeMembers}>
      {children}
    </MembersContext.Provider>
  );
};