import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { FiUpload } from "react-icons/fi";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { UserContext } from "./_app";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";

export default function CreatePost() {
  const [state, dispatch] = useContext(UserContext);
  const [withPhoto, setWithPhoto] = useState(true);
  const [postImg, setPostImg] = useState(undefined);
  const [caption, setCaption] = useState("");
  // const [title, setTitle] = useState("");
  const [captionTitle, setCaptionTitle] = useState("Enter Caption");
  const [dropdown, setDropdown] = useState(false);
  const [type, setType] = useState("Media");
  const [showAddtoCollection, setShowAddtoCollection] = useState(false);
  const [collectionData, setCollectionData] = useState([]);
  const [collectionDropdown, setCollectionDropdown] = useState(false);
  const [collectionType, setCollectionType] = useState("Select");
  const [collectionId, setCollectionId] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isCreateNewCollection, setIsCreateNewCollection] = useState(false);
  const [postData, setPostData] = useState();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/welcome");
    }
    fetch('/api/getcollectionlist', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((response) => response.json())
      .then(({ usercoll }) => {
        // console.log("collection result is", usercoll);
        // expandArray = Array(usercoll.length);
        // expandArray.fill(1)
        // console.log("expandArray", expandArray);
        setCollectionData(usercoll)
      })
      .catch(err => {
        console.error(err);
      })
  }, []);


  const toggleSwitch = () => {
    if (withPhoto) {
      setCaptionTitle("Enter Text");
      setType("Select");
    } else {
      setCaptionTitle("Enter Caption");
    }
    setWithPhoto(!withPhoto);
  };

  const handleChange = (e) => {
    if (e.target.name === "img") {
      setPostImg(e.target.files[0]);
    }
    // else if (e.target.name === "title") {
    //   setTitle(e.target.value);
    // }
    else if (e.target.name === "caption") {
      setCaption(e.target.value);
    }
  };

  const showToastError = (msg) => {
    toast.error(msg, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleSubmit = async () => {
    // if (title.length < 4) {
    //   showToastError("Please Enter title having more than 3 characters");
    //   return;
    // }

    if (caption.length < 6) {
      showToastError(
        `Please Enter ${captionTitle.substring(
          6
        )} having more than 5 characters`
      );
      return;
    }

    if (withPhoto) {
      // create post with photo
      if (!postImg) {
        showToastError("Please Select Photo");
        return;
      }
      const formData = new FormData();
      formData.append("file", postImg);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
      );
      formData.append("folder", process.env.NEXT_PUBLIC_CLOUDINARY_POST);
      // console.log(formData);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      ).then((response) => response.json());
      const index = res.secure_url.lastIndexOf("/");
      const imgName = res.secure_url.substring(index + 1);
      uploadData(imgName);
    } else {
      uploadData(undefined);
    }
  };

  const uploadData = async (img) => {
    let imageName = "";
    let ty = type;
    // if (ty === "Select") {
    //   showToastError("Please select post type");
    //   return;
    // }
    if (img) {
      imageName = img;
      ty = "Media";
    }
    const res = await fetch("/api/createpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        // title,
        body: caption,
        pic: imageName,
        type: ty,
      }),
    }).then((response) => response.json());
    // console.log(res);
    if (res.post) {
      // console.log("res.user is", res.user);
      if (res.user) {
        dispatch({ type: "USER", payload: res.user });
      }
      localStorage.setItem("user", JSON.stringify(res.user));
      setPostData(res.post);

      toast.success("Post Created Successfully..", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // router.push("/profile");
      setShowAddtoCollection(true);

      // setTitle("");
      // setCaption("");
      // setPostImg(undefined);
      // setCaptionTitle("Enter Caption");
      // setWithPhoto(true);
    } else {
      // not getting post as response means something went wrong..
      showToastError(res.error);
    }
  };
  const handleCreateCollection = () => {
    setNewCollectionName("");
    setIsCreateNewCollection(false);
    // console.log(newCollectionName);
    fetch('/api/createcollection', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      }, body: JSON.stringify({
        name: newCollectionName
      })
    }).then((response) => response.json())
      .then(({ newcollection }) => {
        // console.log("newcollectionnewcollection result is", newcollection);
        // expandArray = Array(usercoll.length);
        // expandArray.fill(1)
        // console.log("expandArray", expandArray);
        setCollectionData(prevState => [
          ...prevState,
          newcollection
        ])
      })
      .catch(err => {
        console.error(err);
      })
  }

  const handleAddToCollection = () => {
    let currtype = (type === "Select" || type === "Media") ? "Media" : "Text";
    if (collectionType !== "Select") {
      fetch('/api/addtocollection', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }, body: JSON.stringify({
          collid: collectionId,
          postid: postData._id,
          type
        })
      }).then((response) => response.json())
        .then(({ result }) => {
          // console.log("Added to Collection result result is");
          toast.success("Added to Collection Successfully..", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          router.push("/profile");
          // expandArray = Array(usercoll.length);
          // expandArray.fill(1)
          // console.log("expandArray", expandArray);
          // setCollectionData(prevState => (prevState.push(newcollection)))
        })
        .catch(err => {
          console.error(err);
        })
    }
  }
  return (
    <div className="min-h-screen py-2 bg-gray-100 dark:text-white dark:bg-gray-800">
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h1 className="text-center mt-4 mb-6 text-3xl font-bold">Create Post</h1>
      <div className="my-4 flex justify-center">
        <label
          htmlFor="large-toggle"
          className="inline-flex relative items-center cursor-pointer"
        >
          <input
            type="checkbox"
            value=""
            id="large-toggle"
            className="sr-only peer"
            onChange={toggleSwitch}
            checked={withPhoto}
          />
          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            With Photo
          </span>
        </label>
      </div>
      <div className="w-full max-w-md mx-auto px-2 md:py-0">
        {withPhoto && (
          <div className="mb-4">
            <span className="block text-center mt-10 mb-4">
              {postImg && (
                <Image
                  className="rounded-md bg-white"
                  src={URL.createObjectURL(postImg)}
                  width={300}
                  height={300}
                />
              )}
            </span>

            <label
              className="block cursor-pointer text-center text-gray-700 dark:text-white text-lg font-bold"
              htmlFor="img"
            >
              <span>
                <FiUpload className="mx-auto text-3xl dark:text-white text-black" />
              </span>
              <h1>{postImg ? postImg.name : "Choose Photo"}</h1>
            </label>
            <input
              className="shadow hidden appearance-none border rounded w-full py-2 px-3 text-gray-800  leading-tight focus:outline-none focus:shadow-outline"
              id="img"
              name="img"
              type="file"
              accept="image/*"
              // value={email}
              onChange={handleChange}
            />
          </div>
        )}
        {/* <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-lg font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800  leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={handleChange}
            placeholder="Enter Title"
            onFocus={() => {
              setDropdown(false);
            }}
          />
        </div> */}
        {!withPhoto && (
          <div className="mb-4 relative pl-4 md:p-0">
            <label
              className="block text-gray-700 dark:text-white text-lg font-bold mb-2"
            // htmlFor="caption"
            >
              Select Type
            </label>
            <div
              className={`flex items-center relative cursor-pointer w-36 mt-3 py-2 rounded-md ${dropdown ? "bg-blue-600" : "bg-blue-400"
                }`}
              onClick={() => {
                setDropdown(!dropdown);
              }}
            >
              <p className="mx-auto">{type}</p>
              <span className="absolute right-3">
                {dropdown ? (
                  <AiOutlineArrowDown className="ml-2 mt-1" />
                ) : (
                  <AiOutlineArrowUp className="ml-2 mt-1" />
                )}
              </span>
            </div>
            {dropdown && (
              <div className="absolute w-36 top-20 text-center bg-blue-500">
                <p
                  className={`px-4 border-b-2 cursor-pointer py-1`}
                  onClick={() => {
                    setType("Joke");
                    setDropdown(false);
                  }}
                >
                  Joke
                </p>
                <p
                  className={`px-4 cursor-pointer py-1`}
                  onClick={() => {
                    setType("Shayari");
                    setDropdown(false);
                  }}
                >
                  Shayari
                </p>
                <p
                  className={`px-4 border-y-2 cursor-pointer py-1`}
                  onClick={() => {
                    setType("Quote");
                    setDropdown(false);
                  }}
                >
                  Quote
                </p>
              </div>
            )}
          </div>
        )}
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-lg font-bold mb-2"
            htmlFor="caption"
          >
            {captionTitle}
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800  leading-tight focus:outline-none focus:shadow-outline"
            id="caption"
            name="caption"
            value={caption}
            onChange={handleChange}
            rows={4}
            placeholder={captionTitle}
            onFocus={() => {
              setDropdown(false);
            }}
          ></textarea>
        </div>
        <div className="my-4 text-center">
          <button
            className="text-black dark:text-white mx-2.5 dark:border-white border-black border-2 py-1 px-2 rounded-md hover:border-blue-400 hover:text-blue-400"
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
        {
          showAddtoCollection
          &&
          <div className="flex">

            <label
              className="block text-gray-700 dark:text-white text-lg font-bold mb-2"
            // htmlFor="caption"
            >
              Add To Collection
            </label>

            <div>
              <div
                className={`flex items-center relative cursor-pointer w-36 mt-3 py-2 rounded-md ${collectionDropdown ? "bg-blue-600" : "bg-blue-400"
                  }`}
                onClick={() => {
                  setCollectionDropdown(!collectionDropdown);
                }}
              >
                <p className="mx-auto">{collectionType}</p>
                <span className="absolute right-3">
                  {collectionDropdown ? (
                    <AiOutlineArrowDown className="ml-2 mt-1" />
                  ) : (
                    <AiOutlineArrowUp className="ml-2 mt-1" />
                  )}
                </span>
              </div>
              {/* {collectionDropdown && ( */}

              {
                collectionDropdown
                &&
                <div className="w-36 top-20 text-center bg-blue-500">
                  {
                    (collectionData && collectionData.length > 0) &&
                    collectionData.map(citem => (
                      <p
                        key={citem._id}
                        className={`px-4 border-b-2 cursor-pointer py-1`}
                        onClick={() => {
                          setCollectionType(`${citem.name}`);
                          setCollectionId(`${citem._id}`)
                          setCollectionDropdown(false);
                        }}
                      >
                        {citem.name}
                      </p>
                    ))
                  }
                  <p
                    className={`px-4 border-b-2 cursor-pointer py-1`}
                    onClick={() => {
                      setIsCreateNewCollection(true);
                      // setType("Joke");
                      // setDropdown(false);
                    }}
                  >
                    Create New Collection
                  </p>
                </div>
              }
            </div>
          </div>
        }
        {
          isCreateNewCollection &&
          <div>
            <label
              className="block text-gray-700 dark:text-white text-lg font-bold mb-2"
              htmlFor="title"
            >
              Collection Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800  leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              name="title"
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Enter Collection Name"
            // onFocus={() => {
            //   setDropdown(false);
            // }}
            />
            <button
              className="text-black dark:text-white mx-2.5 dark:border-white border-black border-2 py-1 px-2 my-5 rounded-md hover:border-blue-400 hover:text-blue-400"
              onClick={handleCreateCollection}
            >
              Create Collection
            </button>

          </div>

        }
        {
          showAddtoCollection
          &&
          <button
            className="text-black dark:text-white mx-2.5 dark:border-white border-black border-2 py-1 px-20 ml-20 my-5 rounded-md hover:border-blue-400 hover:text-blue-400"
            onClick={handleAddToCollection}
          >
            Add to Collection
          </button>

        }
      </div>
    </div>
  );
}
{/* <Link href={"/profile"}>
              <a className="flex text-black dark:text-white mx-2.5 dark:border-white border-black border-2 py-1 px-2 ml-24 my-5 rounded-md hover:border-blue-400 hover:text-blue-400 w-1/2">
                 <p className="pr-2 pl-10">go to Profile</p>
                 <CgProfile />
              </a>
            </Link> */}