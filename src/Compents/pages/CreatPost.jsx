import { addDoc, doc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db, storage } from "../../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { UserContext } from "../../Context/UserContext";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";

export default function CreatPost({
  factoriesCollection,
  handleDataAfterPost,

  handleAfterEdit,
}) {
  const postDescRef = useRef();
  const Imgeref = useRef();
  const nagigate = useNavigate();
  const { id } = useParams();
  const cleanId = id.startsWith(":") ? id.slice(1) : id;
  const mood = id === "new" ? "add" : "edit";

  const date = new Date();
  const editDate =
    `${String(date.getMonth() + 1).padStart(2, "0")}` + // Month (1-based)
    `${String(date.getDate()).padStart(2, "0")}` + // Day of the month
    `${String(date.getHours()).padStart(2, "0")}` + // Hours
    `${String(date.getMinutes()).padStart(2, "0")}` + // Minutes
    `${String(date.getMilliseconds()).padStart(3, "0")}`;

  const HandelSumit = async (e) => {
    e.preventDefault();
    let invalid = true;
    const postDescValue = postDescRef.current.value;

    const postImageFile = Imgeref.current?.files[0];
    if (postDescValue.length < 5) {
      console.log("there is error ");
      invalid = false;
      console.log("it false ");
    }
    let imgeURl = null;
    if (postImageFile) {
      imgeURl = await UploadPicToFireStorge(postImageFile, editDate);
      console.log("/////", imgeURl);
    }
    console.log("/////", imgeURl);
    const writeToFireSrore = async () => {
      try {
        const docRef = await addDoc(factoriesCollection, {
          userId: auth?.currentUser?.uid ?? null,
          userName: auth?.currentUser?.displayName ?? null,
          date: date,
          descrption: postDescValue,

          photoURL: auth?.currentUser?.photoURL ?? null,

          email: auth?.currentUser?.email ?? null,
          photoOFBost: postImageFile
            ? editDate + (auth?.currentUser?.email ?? "")
            : null,
          imgeURl: imgeURl ?? null,
        });
        toast.success("post created sucess");
        const postId = docRef.id;

        handleDataAfterPost({
          id: postId, // I want to pass here Id of the irem  what should I write ??
          descrption: postDescValue,
          userId: auth?.currentUser?.uid ?? null,
          email: auth?.currentUser?.email ?? null,
          date: date,
          userName: auth?.currentUser?.displayName ?? null,
          photoURL: auth?.currentUser?.photoURL ?? null,
          imgeURl: imgeURl ?? null,
          photoOFBost: imgeURl ?? "08010326835khaledhishamays16@gmail.com",

          //,
        });
        nagigate("/");
      } catch (error) {
        toast.error("there is error try to refresh the page");
        console.log(error);
      }
    };

    const UpdateToFireStore = async (id) => {
      const itemWantTOUpdate = doc(db, "factories", id);
      console.log(id);
      try {
        await updateDoc(itemWantTOUpdate, {
          descrption: postDescValue,
        });

        handleAfterEdit({
          /////////////////////
          descrption: postDescValue,
          userId: auth?.currentUser?.uid ?? null,
          email: auth?.currentUser?.email ?? null,

          userName: auth?.currentUser?.displayName ?? null,
          photoURL: auth?.currentUser?.photoURL ?? null,
          // photoOFBost: postImageFile
          //   ? editDate + (auth?.currentUser?.email ?? "")
          //   : null,

          id: id,
        });
        toast.success("post updated sucess");
        nagigate("/");
      } catch (error) {
        toast.error("there is error try to refresh the page");
        console.log(error);
      }
    };
    if (invalid) {
      if (mood === "add") {
        writeToFireSrore();
      } else if (mood == "edit") {
        console.log("cleanId", cleanId);
        UpdateToFireStore(cleanId);
      }
    }
  };

  const UploadPicToFireStorge = async (postImageFile, itt) => {
    if (postImageFile) {
      const filesFolderRef = ref(storage, `postpic/${itt}`);
      try {
        await uploadBytes(filesFolderRef, postImageFile);
        const theurlofpic = await getDownloadURL(filesFolderRef);
        return theurlofpic;
      } catch (error) {
        toast.error("there is error in picture");
        console.log(error);
      }
    } else return null;
  };

  const { user, itemWantToUpdate } = useContext(UserContext);

  useEffect(() => {
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

    console.log("user", user); // why when I refresh the page it = null
    console.log("user.userId", user.userId); // why when I refresh the page it = null

    if (!user.userId) {
      nagigate("/login");
      console.log("nooooooooooooooooo");
    } else {
      console.log("yessssss");
    }

    //console.log("itemWantToUpdate", itemWantToUpdate);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Creat Post</h2>

          <form onSubmit={HandelSumit}>
            <div className="mb-4">
              <label
                for="name"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                your text
              </label>
              <input
                id="name"
                ref={postDescRef}
                type="text"
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
                defaultValue={mood == "edit" ? itemWantToUpdate.descrption : ""}
              />
            </div>

            {mood == "add" ? (
              <div className="mb-4">
                <label
                  for="image"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  if You want to upload Image
                </label>
                <input
                  ref={Imgeref}
                  id="image"
                  type="file"
                  name="image"
                  accept="image/*"
                  multiple={false}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                />
              </div>
            ) : (
              ""
            )}

            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {mood == "add" ? "creat Post" : "edit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
