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
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import CreatPost from "./Compents/pages/CreatPost";

function App() {
  const [items, setItems] = useState([]);
  const [itemWantToUpdate, setitemWantToUpdate] = useState();
  const factoriesCollection = collection(db, "factories");
  const { user } = useContext(UserContext);
  const { setUser } = useContext(UserContext);
  const [urls, setUrls] = useState({});

  const fetchUrls = async (items) => {
    const newUrls = {};
    for (const item of items) {
      if (item.photoOFBost) {
        const storage = getStorage();
        const storageRef = ref(storage, `/postpic/${item.photoOFBost}`);
        try {
          const url = await getDownloadURL(storageRef);
          newUrls[item.id] = url;
        } catch (error) {
          console.log(`Failed to fetch URL for ${item.photoOFBost}:`, error);
        }
      }
    }
    // setUrls(newUrls);
    let newItems = [...items];
    newItems = newItems.map((item) => ({
      ...item,
      theURL: newUrls[item.id],
    }));
    setItems(newItems);
  };

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await getDocs(factoriesCollection);
        const cleanResData = data.docs.map((ele) => ({
          ...ele.data(),
          id: ele.id,
        }));

        setItems(cleanResData);
        await fetchUrls(cleanResData);
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
          //userId: auth?.currentUser?.uid,
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

    //
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
      prevItems.map((item) =>
        item.id === toEditItem.id ? { ...item, ...toEditItem } : item
      )
    );
  };

  // console.log(items);

  return (
    <div>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={<Posts items={items} handleRemove={handleRemove} />}
        />
        <Route
          path="/CreatPost/:id"
          element={
            <CreatPost
              //itemWantToUpdate={itemWantToUpdate}
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

//git push -u origin main
