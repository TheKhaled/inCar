import { useContext, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NavBar from "./Compents/NavBar";
import Posts from "./Compents/Posts";
import { Route, Routes } from "react-router-dom";
import CreatePost from "./Compents/pages/CreatPost";
import Login from "./Compents/pages/login";
import { auth, db } from "./config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { UserContext } from "./Context/UserContext";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [items, setItems] = useState([]);

  const factoriesCollection = collection(db, "factories");
  const { user } = useContext(UserContext);
  const { setUser } = useContext(UserContext);
  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await getDocs(factoriesCollection);
        const cleanResData = data.docs.map((ele) => ({
          ...ele.data(),
          id: ele.id,
        }));

        setItems(cleanResData);
      } catch (error) {
        console.log(error);
      }
    };

    getPosts();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          username: user.displayName,
          userId: user.uid,
          email: user.email,
          isLog: true,
          photoURL: user.photoURL,
        });
      } else {
        setUser({
          username: null,
          userId: null,
          email: null,
          isLog: false,
          photoURL: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDataAfterPost = (newProduct) => {
    const existingItemIndex = items.findIndex(
      (item) => item.id === newProduct.id
    );
    if (existingItemIndex === -1) {
      setItems((prevItems) => [...prevItems, newProduct]);
    } else {
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === newProduct.id ? newProduct : item))
      );
    }
  };

  const handleRemove = (toRemove) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.id !== toRemove.id)
    );
  };

  const handleAfterEdit = (toEditItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === toEditItem.id ? toEditItem : item))
    );
  };

  return (
    <div>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={<Posts items={items} handleRemove={handleRemove} />}
        />
        <Route
          path="/createPost/:id"
          element={
            <CreatePost
              items={items}
              handleDataAfterPost={handleDataAfterPost}
              factoriesCollection={factoriesCollection}
              handleAfterEdit={handleAfterEdit}
            />
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
