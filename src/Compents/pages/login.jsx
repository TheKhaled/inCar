import React, { useContext, useRef, useState } from "react";
import { auth, googleProvider } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState({ email: null, password: null });
  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState([]);
  const [errorLogin, seterrorLogin] = useState();
  const [emailAuth, setEmailAuth] = useState();
  const navigate = useNavigate();

  ////
  const HandelSummit = (e) => {
    const emailValue = emailRef.current.value;
    const passwordValue = passwordRef.current.value;

    let isValid = true;
    setErrors({ email: null, password: null });

    e.preventDefault();

    if (!emailValue) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
      setErrors((prev) => ({ ...prev, email: "Email is invalid" }));
      isValid = false;
    }

    if (!passwordValue) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      isValid = false;
    } else if (passwordValue.length < 5) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 5 characters",
      }));
      isValid = false;
    }

    if (isValid) {
      setEmail(emailValue);
      setPassword(passwordValue);
      // Handle form submission (e.g., authentication logic)
      console.log("Email:", emailValue);
      console.log("Password:", passwordValue);

      const SignIn = async () => {
        console.log(emailValue, passwordValue);
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          setEmailAuth(auth?.currentUser?.email);
          console.log("####", emailAuth);
          console.log(auth?.currentUser?.email);
          navigate("/");
        } catch (error) {
          seterrorLogin(error);
          console.error(error);
        }
      };
      SignIn();
    }
  };

  const LogInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setUser({
        username: auth?.currentUser?.displayName,
        userId: auth?.currentUser?.uid,
        email: auth?.currentUser?.email,
        photoURL: auth?.currentUser?.photoURL,
        isLog: true,
      });

      navigate("/");
    } catch (error) {
      seterrorLogin(error);
      console.error(error);
    }
  };
  // const Logout = async () => {
  //   console.log("########");

  //   console.log(auth?.currentUser?.email);
  //   try {
  //     await signOut(auth);
  //   } catch (error) {
  //     seterrorLogin(error);
  //     console.error(error);
  //   }
  // };

  const { user } = useContext(UserContext);
  const { setUser } = useContext(UserContext);
  console.log(user);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg justify-center shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold  flex justify-center mb-4 text-orange-300">
          Sign In with Google
        </h2>
        <button
          onClick={LogInWithGoogle}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sign In with Google
        </button>

        {/* <button
          onClick={Logout}
          className="w-full m-10 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          logout
        </button> */}
      </div>

      <div className="flex items-center mt-6 mb-6 text-gray-600">
        <hr className="flex-grow border-t border-gray-300" />
        {/* <h2 className="text-4xl font-bold  flex justify-center mb-4    ">
          {" "}
          Or{" "}
        </h2> */}
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      {/* <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={HandelSummit}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-4">
              Sign In with Your Email
            </h3>
            <section className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Email
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="khaled@example.com"
                  ref={emailRef}
                  required
                />
              </label>
              {errors.email && (
                <span className="text-xs text-red-800 bg-red-300 p-1 rounded-md mt-1 block">
                  {errors.email}
                </span>
              )}
            </section>

            <section>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Password
                <input
                  ref={passwordRef}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="*****"
                  required
                />
              </label>
              {errors.password && (
                <span className="text-xs text-red-800 bg-red-300 p-1 rounded-md mt-1 block">
                  {errors.password}
                </span>
              )}
            </section>
          </div>

          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Submit
          </button>
        </form>
      </div> */}
    </div>
  );
}
