import React, { createContext, useState } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

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
  const [itemWantToUpdate, setitemWantToUpdate] = useState([]);
  // const unsbscribe = auth.onAuthStateChanged((user) => {
  //   setcurrentUser(user);
  //   setisAuth(user);
  // });

  // onAuthStateChanged(auth, (user) => {  // user what must be
  //   setCurrentUser(user)
  //  })

  // how to take the  email  from the form   to pss here in this email

  //   const [newidea, setNewIda] = useState(
  //     "hello lets try to get  data from context "
  //   );
  //   const [active, setActive] = useState("0");
  return (
    //2
    <UserContext.Provider
      value={{ user, setUser, itemWantToUpdate, setitemWantToUpdate }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
/////
