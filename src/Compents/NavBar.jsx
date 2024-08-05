import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { UserContext } from "../Context/UserContext";
import { toast } from "react-toastify";

export default function NavBar() {
  const nagigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const { user } = useContext(UserContext);
  const Logout = async () => {
    console.log("########");

    console.log(auth?.currentUser?.email);
    toast.error("you logOut ");
    nagigate("/login");
    try {
      await signOut(auth);
      setUser({
        username: null,
        userId: null,
        email: null,
        isLog: false,
        photoURL: null,
      });
    } catch (error) {
      seterrorLogin(error);
      console.error(error);
    }
  };

  return (
    <div>
      <div className="navbar bg-base-100 shadow-lg     fixed top-0 left-0 w-full z-50">
        <div className="flex-1 ">
          <NavLink to={"/"} className="btn btn-ghost   text-3xl text-blue-700 ">
            <h1 className="text-4xl font-semibold text-gray-800 cursor-pointer font-serif">
              In-My Car
            </h1>
          </NavLink>
        </div>

        <div className="mr-10">
          <NavLink
            to={"/CreatPost/new"}
            className={({ isActive }) =>
              isActive ? "btn btn-ghost text-xl" : "font-bold"
            }
          >
            creat post
          </NavLink>
        </div>

        {user.userId ? (
          <div>
            <button
              onClick={Logout}
              className={({ isActive }) =>
                isActive ? "btn btn-ghost text-xl" : "font-bold"
              }
            >
              LogOut
            </button>
          </div>
        ) : (
          ""
        )}

        {user.userId ? (
          ""
        ) : (
          <div>
            <NavLink
              to={"/Login"}
              className={({ isActive }) =>
                isActive ? "btn btn-ghost text-xl" : "font-bold"
              }
            >
              LogIn
            </NavLink>
          </div>
        )}

        {user.photoURL ? (
          <div className="ml-5 w-12 h-12 rounded-full overflow-hidden">
            <img
              alt="Tailwind CSS Navbar component"
              src={user.photoURL}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="pt-16">{/* to make  margin */}</div>
    </div>
  );
}
