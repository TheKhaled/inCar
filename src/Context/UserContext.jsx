import React, { createContext, useState } from "react";

//  1
export const UserContext = createContext(null);
export default function UserContextProvider(props) {
  const [user, setUser] = useState({
    username: null,
    userId: null,
    email: null,
    isLog: false,
    photoURL: false,
  });

  // how to take the  email  from the form   to pss here in this email

  //   const [newidea, setNewIda] = useState(
  //     "hello lets try to get  data from context "
  //   );
  //   const [active, setActive] = useState("0");
  return (
    //2
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
}
