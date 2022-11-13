import React, { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../_app";

export default function Setting({
  speak,
  cancel,
  speaking,
  supported,
  voices,
}) {
  const [state, dispatch] = useContext(UserContext);
  // const[totalpost,setTotalPost]=useState(0);
  // const [user, setUser] = useState({});
  //   const [posts, setPosts] = useState([]);
  //   const [morePosts, setMorePosts] = useState(true);
  //   const [fetchedCategory, setFetchedCategory] = useState("Media");
  //   const [isPlaying, setIsPlaying] = useState(false);
  //   const [postId, setPostId] = useState("");
  // const { data, error } = useSWR("/api/allpost", fetcher);
  // const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
  //   getKey,
  //   fetcher
  // );
  const [profile, setProfile] = useState(undefined);
  const [imageName, setImageName] = useState("");
  const [post, setPost] = useState(null);
  const [modal, setModal] = useState(false);
  const [textModal, setTextModal] = useState(false);

  const router = useRouter();
  let isLoadingMore = true,
    isReachedEnd = false;
  let options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "numeric",
    // minute: "numeric",
    // second: "numeric",
  };
  // console.log("state is", state);

  // useEffect(() => {
  // const user = localStorage.getItem("user");
  // if (user) {
  //   const parsedUser = JSON.parse(user);
  //   setUser(parsedUser);
  //   // console.log("lhklj", parsedUser.posts);
  //   // console.log(user.posts.length);
  //   // setTotalPost(parsedUser.posts.length);
  // } else {
  //   router.push("/welcome");
  // }
  // }, []);

  // useEffect(() => {
  //   // console.log(data);
  //   // console.log(size);
  //   isLoadingMore = data && typeof data[size - 1] === "undefined";
  //   isReachedEnd = data && data[data.length - 1]?.length < PAGE_SIZE;

  //   if (isReachedEnd) {
  //     setMorePosts(false);
  //   } else {
  //     setMorePosts(true);
  //   }

  //   if (data) {
  //     setPosts([].concat.apply([], data));
  //   }
  //   console.log(posts);
  // }, [data]);

  useEffect(() => {
    if (imageName.length > 0) {
      uploadData();
      // console.log("here");
    }
  }, [imageName]);

  const handleSubmit = async () => {
    if (profile) {
      // uploading image to cloudinary
      const formData = new FormData();
      formData.append("file", profile);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
      );
      formData.append("folder", process.env.NEXT_PUBLIC_CLOUDINARY_PROFILE);
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
      setImageName(imgName);
    }
  };

  const uploadData = async () => {
    // console.log("signup called");
    const res = await fetch("/api/updateprofilepic", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        pic: imageName,
      }),
    }).then((response) => response.json());
    // console.log(res);
    if (res.success) {
      setImageName("");
      setProfile(undefined);
      toast.success("Successfully Updated..", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(res.result);
      localStorage.setItem("user", JSON.stringify(res.result));
      // dispatch({type:"USER",payload:res.user})
      dispatch({ type: "USER", payload: res.result });
      router.push("/profile");
    }
  };

  return (
    <div className="min-h-screen px-2 dark:text-white dark:bg-gray-800">
      <Head>
        <title>Setting - Followgram</title>
        <meta
          name="description"
          content="Followgram share posts & text with your friend"
        />
      </Head>
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

      <div className="w-full max-w-md mx-auto pt-4">
        <div className="mb-4 text-center">
          {profile && (
            <Image
              className="rounded-full bg-white"
              src={URL.createObjectURL(profile)}
              width={150}
              height={150}
            />
          )}
          {!profile && state && (
            // <></>
            <Image
              className="rounded-full bg-white"
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/${process.env.NEXT_PUBLIC_CLOUDINARY_PROFILE}/${state.pic}`}
              width={150}
              height={150}
            />
          )}
          <label
            className="block text-gray-700 text-lg font-bold my-2"
            htmlFor="profile"
          >
            <img
              src="https://img.icons8.com/fluency-systems-filled/96/000000/file-upload.png"
              className="cursor-pointer mx-auto"
              height={40}
              width={40}
            />
          </label>
          {profile && (
            <span className="text-lg">
              {profile.name.substring(0, 40)}
              {profile.name.length > 40 ? "..." : ""}
            </span>
          )}
          {!profile && (
            <span className="text-lg cursor-pointer">Change Photo</span>
          )}
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline hidden"
            id="profile"
            name="profile"
            type="file"
            accept="image/*"
            onChange={(e) => setProfile(e.target.files[0])}
          />
        </div>

        <div className="my-4 text-center">
          <button
            className="text-white mx-2.5 text-xl dark:border-white border-black border-2 py-1 px-3 rounded-md hover:border-blue-400 hover:text-blue-400 "
            onClick={handleSubmit}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
