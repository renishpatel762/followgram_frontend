import React, { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import useSWRInfinite from "swr/infinite";
import loader from "../../public/loader.svg";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsPlay, BsPause, BsStop } from "react-icons/bs";
import { UserContext } from "../_app";
import Modal from "../../components/Modal";
import { FaRegCalendar, FaRegComment } from "react-icons/fa";
import TextModal from "../../components/TextModal";
import {
  likePost,
  unLikePost,
  makeComment,
} from "../../components/Functionset";

const PAGE_SIZE = 3;
let category = "Media";
let expandArray = [];
const fetcher = (url) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  }).then((response) => response.json());

const getKey = (pageIndex, previousPageData) => {
  pageIndex = pageIndex + 1;
  if (previousPageData && !previousPageData.length) return null; // reached the end
  // return `/api/allpost`; // SWR key
  return `/api/mypost?page=${pageIndex}&limit=${PAGE_SIZE}&category=${category}`; // SWR key
};

export default function MyProfile({
  speak,
  cancel,
  speaking,
  supported,
  voices,
}) {
  const [state, dispatch] = useContext(UserContext);
  // const[totalpost,setTotalPost]=useState(0);
  const [posts, setPosts] = useState([]);
  const [morePosts, setMorePosts] = useState(true);
  const [fetchedCategory, setFetchedCategory] = useState("Media");
  const [isPlaying, setIsPlaying] = useState(false);
  const [postId, setPostId] = useState("");
  // const { data, error } = useSWR("/api/allpost", fetcher);
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetcher
  );
  const [post, setPost] = useState(null);
  const [modal, setModal] = useState(false);
  const [textModal, setTextModal] = useState(false);

  //for collection
  const [collectionData, setCollectionData] = useState([]);
  const [expand, setExpand] = useState(false);
  const [isFromCollection, setIsFromCollection] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [selectedCollectionName, setSelectedCollectionName] = useState("");

  const [isshowFollowers, setIsshowFollowers] = useState(true);
  const [isshowFollowing, setIsshowFollowing] = useState(false);
  const [user, setUser] = useState({});
  const router = useRouter();
  let isLoadingMore = true,
    isReachedEnd = false;
  let options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  useEffect(() => {
    // console.log(data);
    // console.log(size);
    isLoadingMore = data && typeof data[size - 1] === "undefined";
    isReachedEnd = data && data[data.length - 1]?.length < PAGE_SIZE;

    if (isReachedEnd) {
      setMorePosts(false);
    } else {
      setMorePosts(true);
    }

    if (data) {
      setPosts([].concat.apply([], data));
    }
    // console.log(posts);
  }, [data]);

  const changeCategory = (cat) => {
    setFetchedCategory(cat);

    if (cat !== "Collection") category = cat;
    setSize(1);
  };

  const handleAudio = (post) => {
    if (supported) {
      if (!post) {
        cancel();
        setIsPlaying(false);
        setPostId("");
        return;
      }

      if (speaking) {
        cancel();
        setTimeout(() => {
          setPostId(post._id);
          // speak({ text: post.body, voice: voices[voiceIndex] });
          speak({ text: post.body });
        }, 300);
      } else {
        setPostId(post._id);
        // speak({ text: post.body, voice: voices[voiceIndex] });
        speak({ text: post.body });
      }

      // if (speaking) {
      //   cancel();
      // }

      // setPostId(post._id);
      // setIsPlaying(true);
      // speak({ text: post.body });
    } else {
      alert("Sorry!! This feature is not supported in your browser");
    }
  };

  const handleDeletePost = (pid) => {
    console.log("handleDeletePost called", pid);
    fetch(`/api/deletepost/${pid}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then(({ result, user }) => {
        console.log("result",result,"usre is",user);
        // const newData = posts.map((item) => {
        //   if (item._id === result._id) {
        //     // return result;
        //   } else {
        //     return item;
        //   }
        // });
        const newData = posts.filter(item => item._id != result._id)
        setPosts(newData);
        if (user) {
          dispatch({ type: "USER", payload: user });
          localStorage.setItem("user", JSON.stringify(user))
        }
      });
  };
  const handleRemoveFromCollection = (collid, postid, type) => {
    fetch(`/api/removefromcollection`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        collid,
        postid,
        type
      })
    })
      .then((response) => response.json())
      .then(({ result }) => {
        console.log("result", result);
        const newData = collectionData.map(item => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        })
        setCollectionData(newData);

      });
  }
  useEffect(() => {
    console.log(postId);
  }, [postId]);

  useEffect(() => {
    fetch("/api/getuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then(({ user }) => {
        dispatch({ type: "USER", payload: user });
        localStorage.setItem("user", JSON.stringify(user));
        // setUser(user);
      })
      .catch((err) => {
        console.error(err);
      });

    // console.log("state is",state);
    fetch("/api/getcollections", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then(({ usercoll }) => {
        console.log("collection result is", usercoll);
        expandArray = Array(usercoll.length);
        expandArray.fill(1);
        console.log("expandArray", expandArray);
        setCollectionData(usercoll);
      })
      .catch((err) => {
        console.error(err);
      });
    handleGetUsersData();
  }, []);
  const handleGetPostDetail = (postid) => {
    fetch("/api/getpostdetail", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        pid: postid
      })
    })
      .then((response) => response.json())
      .then(({ postdetail }) => {
        // console.log("post detail is",postdetail);
        setPost(postdetail);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const handleGetUsersData = () => {
    fetch("/api/getuserdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then(({ user }) => {
        console.log("login user is", user);
        setUser(user);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className="">
      <div id="modalBox">
        {modal && (
          <Modal
            post={post}
            state={state}
            posts={posts}
            setPosts={setPosts}
            setPost={setPost}
            likePost={likePost}
            unLikePost={unLikePost}
            makeComment={makeComment}
            isFromProfilePage={true}
            handleDeletePost={handleDeletePost}

            isFromCollection={isFromCollection}
            collectionId={selectedCollectionId}
            collectionName={selectedCollectionName}
            collectionData={collectionData}
            handleRemoveFromCollection={handleRemoveFromCollection}
            closeModal={() => {
              setModal(false);
              setIsFromCollection(false);
            }}
          />
        )}
        {
          textModal && (
            <TextModal
              post={post}
              state={state}
              posts={posts}
              setPosts={setPosts}
              setPost={setPost}
              likePost={likePost}
              unLikePost={unLikePost}
              makeComment={makeComment}
              handleAudio={handleAudio}
              isFromProfilePage={true}
              handleDeletePost={handleDeletePost}

              isFromCollection={isFromCollection}
              collectionId={selectedCollectionId}
              collectionName={selectedCollectionName}
              collectionData={collectionData}
              handleRemoveFromCollection={handleRemoveFromCollection}
              // isFromFunctionset="true"
              //just some

              closeTextModal={() => {
                setTextModal(false);
                setIsFromCollection(false);
              }}
            />
          )}
      </div>
      <Head>
        <title>Profile - Followgram</title>
        <meta
          name="description"
          content="Followgram share posts & text with your friend"
        />
      </Head>
      <div className={`px-2 min-h-screen dark:text-white dark:bg-gray-800 ${(modal || textModal) ? 'opacity-80' : 'opacity-100'}`}>
        <div className="flex w-full pt-5 md:pt-10">
          <div className="w-1/3 text-center items-center">
            <div>
              {!state && (
                <Image
                  className="rounded-full bg-white"
                  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/default_user_jvzpsn_yivfp2_yivfp2.png`}
                  width={150}
                  height={150}
                />
              )}
              {state && state.pic && (
                <Image
                  className="rounded-full bg-white"
                  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${state.pic}`}
                  width={150}
                  height={150}
                />
              )}
              {
                // console.log("state is", state)
              }
            </div>
            <button
              className="text-black dark:text-white dark:border-white border-black border-2 py-1 px-2 rounded-md hover:border-blue-400 hover:text-blue-400 mt-4"
              onClick={() => router.push("/profile/setting")}
            >
              Change Profile
            </button>
            {/* <button className="mt-2">Change Profile</button> */}
          </div>
          <div className="w-2/3 pt-3 pl-4 md:pl-0 overflow-x-hidden">
            <h2 className="text-2xl">{state && state.name}</h2>
            <h2 className="text-md">{state && state.email}</h2>
            <div className="flex py-5 text-sm md:text-lg">
              <div className="w-1/3 md:w-1/5 text-center">
                <p>{state && (state.mediaPost && state.textPost) ? (state.mediaPost.length + state.textPost.length) : 0}</p>
                <p>Posts</p>
              </div>
              <div className="w-1/3 md:w-1/5 text-center cursor-pointer"
                onClick={() => {
                  setIsshowFollowers(true);
                  setIsshowFollowing(false);
                  // handleGetUsersData();
                }}
              >
                <p>{state ? state.followers.length : 0}</p>
                <p>Followers</p>
              </div>
              <div className="w-1/3 md:w-1/5 text-center cursor-pointer"
                onClick={() => {
                  setIsshowFollowers(false);
                  setIsshowFollowing(true);
                  // handleGetUsersData();
                }}
              >
                <p>{state ? state.following.length : 0}</p>
                <p>Followings</p>
              </div>
            </div>

            {
              (isshowFollowers || isshowFollowing)
              &&
              <div className="scrollbar-hide border-2 w-1/3" style={{
                borderRadius: 10, flex: 5, overflowY: 'scroll',/* overflow-y: hidden; */
                overflowX: 'hidden', maxHeight: '35vh'
              }}>
                <div className="flex justify-between mx-2">
                  <p className="border-b-2">{isshowFollowers ? "Followers" : "Followings"}</p>
                  <span
                    className="cursor-pointer text-white"
                    onClick={() => {
                      setIsshowFollowers(false);
                      setIsshowFollowing(false);
                    }}
                  >
                    X
                  </span>
                </div>
                {
                  isshowFollowers
                    ?
                    <>
                      {
                        (user && user.followers && user.followers.length > 0)
                          ?
                          <>
                            {
                              user.followers.map((fitem) => (
                                // <p>hello</p>

                                <div className="flex m-5" key={fitem._id}>
                                  {
                                    console.log(fitem)
                                  }
                                  <div className="flex cursor-pointer"
                                    onClick={() => {
                                      // if (citem.postedBy._id !== state._id) {
                                      router.push("/profile/" + fitem._id)
                                      // }
                                      // else {
                                      // router.push("/profile");
                                      // }
                                    }}>
                                    <Image
                                      className="rounded-full bg-white"
                                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${fitem.pic}`}
                                      width={40}
                                      height={40}
                                    />
                                    <p className="pl-2">{fitem.name}</p>
                                  </div>
                                </div>
                              ))
                            }
                            <p className="text-center">----x----x----</p>
                          </>

                          :
                          <p className="mx-4">No Followers</p>
                      }
                    </>
                    :
                    <>
                      {
                        (user && user.following && user.following.length > 0)
                          ?
                          <>
                            {
                              user.following.map((fitem) => (
                                // <p>hello</p>

                                <div className="flex m-5" key={fitem._id}>
                                  {
                                    console.log(fitem)
                                  }
                                  <div className="flex cursor-pointer"
                                    onClick={() => {
                                      // if (citem.postedBy._id !== state._id) {
                                      router.push("/profile/" + fitem._id)
                                      // }
                                      // else {
                                      // router.push("/profile");
                                      // }
                                    }}>
                                    <Image
                                      className="rounded-full bg-white"
                                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${fitem.pic}`}
                                      width={40}
                                      height={40}
                                    />
                                    <p className="pl-2">{fitem.name}</p>
                                  </div>
                                </div>
                              ))
                            }
                            <p className="text-center">----x----x----</p>
                          </>

                          :
                          <p className="mx-4">No Followings</p>
                      }
                    </>
                }
              </div>
            }
          </div>
        </div>

        {/* load posts here */}
        <hr className="mt-7 h-0.5 bg-white" />
        {error && (
          <h1 className="my-5 text-center text-2xl">
            Something went wrong.. Please try again later...
          </h1>
        )}

        {/* Show while loading */}
        {/* {!error && !data && <h1>Loading...</h1>} */}
        <div className="flex justify-evenly mt-10">
          <p
            className={`mx-2 text-2xl cursor-pointer ${fetchedCategory !== "Media" ? "" : "border-blue-400 border-b-2"
              }`}
            onClick={() => {
              changeCategory("Media");
            }}
          >
            Photos ({(state && state.mediaPost) ? state.mediaPost.length : 0})
          </p>
          {/* <p
          className={`mx-2 text-2xl cursor-pointer ${fetchedCategory !== "Joke" ? "" : "border-blue-400 border-b-2"
            }`}
          onClick={() => {
            changeCategory("Joke");
          }}
        >
          Jokes
        </p>
        <p
          className={`mx-2 text-2xl cursor-pointer ${fetchedCategory !== "Shayari" ? "" : "border-blue-400 border-b-2"
            }`}
          onClick={() => {
            changeCategory("Shayari");
          }}
        >
          Shayari
        </p>
        <p
          className={`mx-2 text-2xl cursor-pointer ${fetchedCategory !== "Quote" ? "" : "border-blue-400 border-b-2"
            }`}
          onClick={() => {
            changeCategory("Quote");
          }}
        >
          Quotes
        </p> */}

          <p
            className={`mx-2 text-2xl cursor-pointer ${fetchedCategory !== "TextPost" &&
              fetchedCategory !== "Joke" &&
              fetchedCategory !== "Shayari" &&
              fetchedCategory !== "Quote"
              ? ""
              : "border-blue-400 border-b-2"
              }`}
            onClick={() => {
              changeCategory("Joke");
            }}
          >
            TextPost  ({(state && state.textPost) ? state.textPost.length : 0})
          </p>
          <p
            className={`mx-2 text-2xl cursor-pointer ${fetchedCategory !== "Collection"
              ? ""
              : "border-blue-400 border-b-2"
              }`}
            onClick={() => {
              changeCategory("Collection");
            }}
          >
            Collections ({collectionData && collectionData.length})
          </p>
        </div>
        <div className="flex justify-evenly mt-10">
          {(fetchedCategory === "TextPost" ||
            fetchedCategory === "Joke" ||
            fetchedCategory === "Shayari" ||
            fetchedCategory === "Quote") && (
              <>
                <p
                  className={`mx-2 text-xl cursor-pointer ${fetchedCategory !== "Joke" ? "" : "border-blue-400 border-b-2"
                    }`}
                  onClick={() => {
                    changeCategory("Joke");
                  }}
                >
                  Jokes
                </p>
                <p
                  className={`mx-2 text-xl cursor-pointer ${fetchedCategory !== "Shayari"
                    ? ""
                    : "border-blue-400 border-b-2"
                    }`}
                  onClick={() => {
                    changeCategory("Shayari");
                  }}
                >
                  Shayari
                </p>
                <p
                  className={`mx-2 text-xl cursor-pointer ${fetchedCategory !== "Quote"
                    ? ""
                    : "border-blue-400 border-b-2"
                    }`}
                  onClick={() => {
                    changeCategory("Quote");
                  }}
                >
                  Quotes
                </p>
              </>
            )}
        </div>
        {/* posts */}
        <div className="mt-10">
          <InfiniteScroll
            dataLength={posts.length}
            next={() => setSize(size + 1)}
            hasMore={morePosts}
            loader={
              <div className="text-center py-4">
                <Image src={loader} width={50} height={50} />
              </div>
            }
            endMessage={
              <p className="text-center pt-4 pb-3">
                <b>----x----x----</b>
              </p>
            }
          >
            <div className="flex flex-wrap items-center w-full px-2 md:px-10 dark:bg-gray-800">
              {fetchedCategory === "Media" &&
                posts.map((post) => (
                  <div
                    key={post._id}
                    className="w-1/3 text-center py-1 px-1 md:py-2 md:px-3"
                  >
                    <Image
                      className="hover:opacity-40 hover:cursor-pointer"
                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/posts/${post.photo}`}
                      width={50}
                      height={50}
                      layout="responsive"
                      // onMouseEnter={}
                      onClick={() => {
                        setPost(post);
                        setModal(true);
                        setIsFromCollection(false);
                      }}
                    />
                  </div>
                ))}
              {(fetchedCategory === "TextPost" ||
                fetchedCategory === "Joke" ||
                fetchedCategory === "Shayari" ||
                fetchedCategory === "Quote") &&
                posts.map((post) => (
                  <div
                    key={post._id}
                    className="w-full my-2 py-2 px-1 rounded-md md:my-2 md:py-4 md:px-3 dark:bg-gray-600 dark:text-white bg-gray-300 text-black"
                  >
                    <p
                      className="pl-4 text-2xl cursor-pointer"

                      onClick={() => {
                        setIsFromCollection(false);

                        setPost(post);
                        setTextModal(true);

                      }}
                    >
                      {post.body}
                    </p>
                    <p className="text-right pr-4">
                      {new Date(post.createdAt).toLocaleDateString(
                        "en-US",
                        options
                      )}
                    </p>
                    <div className="flex justify-evenly">
                      {state && post.likes.includes(state._id) ? (
                        <div
                          onClick={() => {
                            unLikePost(post._id, posts, setPosts, setPost);
                          }}
                        >
                          <AiFillHeart className="cursor-pointer" />
                          <p>{post.likes.length} likes</p>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            likePost(post._id, posts, setPosts, setPost);
                          }}
                        >
                          <AiOutlineHeart className="cursor-pointer" />
                          <p>{post.likes.length} likes</p>
                        </div>
                      )}
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setIsFromCollection(false);
                          setPost(post);
                          setTextModal(true);

                        }}
                      >
                        <FaRegComment />
                        {post.comments.length > 0 ? (
                          <p>{post.comments.length} comments</p>
                        ) : (
                          <p>No Comments</p>
                        )}
                      </div>
                      {speaking && postId === post._id ? (
                        <BsStop
                          className={`text-2xl cursor-pointer`}
                          // className={`text-2xl cursor-pointer ${
                          //   (speaking && postId === post._id) ? "" : "hidden"
                          // }`}
                          onClick={() => {
                            handleAudio(undefined);
                          }}
                        />
                      ) : (
                        <BsPlay
                          className={`text-2xl cursor-pointer`}
                          // className={`text-2xl cursor-pointer ${
                          //   (speaking && postId === post._id) ? "hidden" : ""
                          // }`}
                          onClick={() => {
                            handleAudio(post);
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}

              {fetchedCategory === "Collection" &&
                collectionData.length > 0 &&
                collectionData.map((citem, cindex) => (
                  <div
                    key={citem._id}
                    className="w-full my-2 py-2 px-1 rounded-md md:my-2 md:py-4 md:px-3 dark:bg-gray-600 dark:text-white bg-gray-300 text-black"
                  >
                    <div className="flex justify-between">
                      <div>{cindex + 1}</div>
                      <p className="text-4xl border-b-2">{citem.name}</p>
                      {
                        (citem.imagePost && citem.imagePost.length > 0) ?
                          <Image
                            src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/posts/${citem.imagePost[`${citem.imagePost.length - 1}`].photo}`}
                            width={50}
                            height={50}
                            className="rounded"
                          // layout="responsive"
                          />
                          :
                          <Image
                            src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1668270547/static_image/download_qqdzus.png`}
                            width={50}
                            height={50}
                            className="rounded"
                          // layout="responsive"
                          />
                      }
                    </div>
                    <div className="">
                      {/* <button onClick={() => {
                      expandArray[cindex] = 1
                      console.log(expandArray[cindex]);
                    }}>expand</button> */}
                      <p className="text-2xl m-3">ImagePost ({citem.imagePost.length})</p>

                      {
                        // expandArray[cindex] === 1 &&
                        <>
                          <div
                            style={{ display: 'flex', flexWrap: 'wrap', border: '1px solid gray' }}
                          >
                            {
                              citem.imagePost.length > 0
                              &&
                              citem.imagePost.map(ciitem => (
                                <div
                                  key={ciitem._id}
                                  // className="w-1/3 text-center py-1 px-1 md:py-2 md:px-3"
                                  className="w-1/4 text-center py-1 px-1 md:py-2 md:px-3"
                                >
                                  <Image
                                    className="hover:opacity-40 hover:cursor-pointer rounded"
                                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/posts/${ciitem.photo}`}
                                    width={50}
                                    height={50}
                                    layout="responsive"
                                    onClick={() => {
                                      handleGetPostDetail(ciitem._id);
                                      setIsFromCollection(true);
                                      setSelectedCollectionId(citem._id);
                                      setSelectedCollectionName(citem.name);
                                      // setPost(ciitem);
                                      setModal(true);
                                    }}
                                  />

                                </div>
                              ))

                            }
                          </div>
                          <p className="text-2xl m-3">TextPost ({citem.textPost.length})</p>
                          <div
                            style={{ border: '1px solid gray', padding: '0 10px' }}
                          // className="border-white border-solid"
                          >
                            {
                              citem.textPost.length > 0
                              &&
                              citem.textPost.map(ctitem => (
                                <div
                                  key={ctitem._id}
                                  className="w-full my-2 py-2 px-1 rounded-md md:my-2 md:py-4 md:px-3 bg-gray-700 dark:text-white text-black"
                                >
                                  <p className="text-xl">{ctitem.type}</p>
                                  <p className="pl-4 text-2xl  cursor-pointer" onClick={() => {
                                    handleGetPostDetail(ctitem._id);
                                    setIsFromCollection(true);
                                    setSelectedCollectionId(citem._id);
                                    setSelectedCollectionName(citem.name);
                                    // setPost(ctitem);
                                    setTextModal(true);

                                  }}>{ctitem.body}</p>
                                </div>
                              ))
                            }
                          </div>
                        </>

                      }
                    </div>
                  </div>
                ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </div >
  );
}
