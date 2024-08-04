import React, { useContext, useEffect, useState } from "react";

import Trash from "./icons/Trash";
import EditPen from "./icons/EditPen";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { UserContext } from "../Context/UserContext";
import { toast } from "react-toastify";

export default function Posts({ items, handleRemove }) {
  let srcPic =
    " https://media.licdn.com/dms/image/C4D1BAQH5g4MrshNy8g/company-background_10000/0/1627607051117/elsfacars_cover?e=2147483647&v=beta&t=_iGhXKK91OqxaPV5j9JL7FxjFdzptJI_ppcK-HmX9Ok";
  const navigate = useNavigate();
  const datenow = new Date();

  const DeleteItemfromFireStore = async (item) => {
    const itemWantToDelete = doc(db, "factories", item.id);

    try {
      await deleteDoc(itemWantToDelete);
      toast.success("post is deleted");
      handleRemove(item);
    } catch (error) {
      toast.error("Failed to delete post  please refresh the page");
      console.log(error);
    }
  };

  const navgiate = useNavigate();
  const [urls, setUrls] = useState({});

  const { user, setitemWantToUpdate } = useContext(UserContext);

  return (
    <div>
      {items?.map((item) => {
        return (
          <div
            className="max-w-lg mx-auto bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden mt-5 mb-5"
            key={item.id}
          >
            {/* Account Info */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={item.photoURL}
                  alt="Profile"
                />
                <div className="ml-3">
                  <h2 className="text-lg font-semibold">{item.userName}</h2>
                  <p className="text-sm text-gray-600">
                    {/* {new Date(item.date.seconds * 1000).toLocaleString()} */}
                    2 days ago
                  </p>
                </div>
              </div>
              {item.userId == user.userId ? (
                <div className="flex gap-4">
                  <div
                    onClick={() => {
                      setitemWantToUpdate(item); // why is wrong   I want to pass item

                      navigate(`/CreatPost/${item.id}`);
                      ``;
                    }}
                    className="cursor-pointer"
                  >
                    <EditPen className="m-5" />
                  </div>

                  <div
                    onClick={() => DeleteItemfromFireStore(item)}
                    className="cursor-pointer"
                  >
                    <Trash className="m-16" />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>

            {/* Post Content */}
            <div className="p-4">
              <p className="text-gray-800 mb-4">{item.descrption}</p>
            </div>
            {item.imgeURl ? (
              <img
                className="w-full h-auto object-co`ver rounded-lg"
                src={item.imgeURl}
                alt="Post"
              />
            ) : item.theURL ? ( // I made this cause there is some data on fire base has this filed named theURL
              <img
                className="w-full h-auto object-co`ver rounded-lg"
                src={item.theURL}
                alt="Post"
              />
            ) : (
              ""
            )}
            <div className="flex justify-end p-4 border-t border-gray-200">
              {/* Add any additional buttons or elements here if needed */}
            </div>
          </div>
        );
      })}
    </div>
  );
}
