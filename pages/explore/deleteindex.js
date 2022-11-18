import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import useSWRInfinite from "swr/infinite";
import loader from "../../public/loader.svg";
import { AiOutlineLike, AiOutlineDislike, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsPlay, BsPause, BsStop } from "react-icons/bs";
import { UserContext } from "../_app";
import Modal from "../../components/Modal";
import { likePost, unLikePost, makeComment } from "../../components/Functionset";
import { FaRegComment } from "react-icons/fa";
import TextModal from "../../components/TextModal";

const PAGE_SIZE = 3;
let category = "Media";
const fetcher = (url) =>
    fetch(url, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        }
    }).then((response) => response.json())

const getKey = (pageIndex, previousPageData) => {
    pageIndex = pageIndex + 1;
    if (previousPageData && !previousPageData.length) return null; // reached the end
    // return `/api/allpost`; // SWR key
    return `/api/allpost?page=${pageIndex}&limit=${PAGE_SIZE}&category=${category}`; // SWR key
};

export default function Explore({
    speak,
    cancel,
    speaking,
    supported,
    voices,
}) {
    const router = useRouter();
    //   const { userId } = router.query;
    const [state, dispatch] = useContext(UserContext);
    // const[totalpost,setTotalPost]=useState(0);
    //   const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [morePosts, setMorePosts] = useState(true);
    const [fetchedCategory, setFetchedCategory] = useState("Media");
    const [isPlaying, setIsPlaying] = useState(false);
    const [postId, setPostId] = useState("");
    // const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userId) : true);
    //   const [showFollow, setShowFollow] = useState();
    // const { data, error } = useSWR("/api/allpost", fetcher);
    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
        getKey,
        fetcher
    );
    const [post, setPost] = useState(null);
    const [modal, setModal] = useState(false);
    const [textModal, setTextModal] = useState(false);


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
    // console.log("state in [userId]", state);

    // useEffect(() => {
    //   console.log("use Effect for stateis scalled,state", state);
    //   if (state && state.following.includes(userId)) {
    //     console.log("why including", state);
    //     setShowFollow(false);
    //   } else {
    //     console.log("why not including", state);
    //   }
    // }, [state])


    // useEffect(() => {
    //   const user = localStorage.getItem("user");
    //   if (user) {
    //     const parsedUser = JSON.parse(user);
    //     setUser(parsedUser);
    //     console.log("lhklj",parsedUser.posts);
    //     // console.log(user.posts.length);
    //     // setTotalPost(parsedUser.posts.length);
    //   } else {
    //     router.push("/welcome");
    //   }
    // }, []);


    //   useEffect(() => {
    //     console.log("userId is", userId);
    //     bodyuid = userId;
    //     if (userId) {
    //       const getUser = async () => {
    //         // try to fetch user
    //         const res = await fetch(`/api/user/${userId}`, {
    //           // method: "POST",
    //           headers: {
    //             "Content-Type": "application/json",
    //             Authorization: "Bearer " + localStorage.getItem("token"),
    //           },
    //           // body: JSON.stringify({
    //           //   email,
    //           //   password,
    //           // }),
    //         }).then((response) => response.json());
    //         // console.log(res);
    //         if (res.success) {
    //           setUser(res.user);
    //         } else {
    //           setUser(null);
    //         }
    //       };
    //       getUser();
    //       console.log(user);
    //     }
    //   }, [userId]);

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
        category = cat;
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


    return (
        <div>
            <div id="modalBox">
                {
                    modal && (
                        <Modal
                            post={post}
                            state={state}
                            posts={posts}
                            setPosts={setPosts}
                            setPost={setPost}
                            likePost={likePost}
                            unLikePost={unLikePost}
                            makeComment={makeComment}
                            isFromFunctionset="true"
                            closeModal={() => {
                                setModal(false);
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
                            isFromFunctionset="true"
                            //just some

                            closeTextModal={() => {
                                setTextModal(false);
                            }}
                        />
                    )
                }
            </div>
            <div className="min-h-screen px-2 dark:text-white dark:bg-gray-800">
                <Head>
                    <title>Explore - Followgram</title>
                    <meta
                        name="description"
                        content="Followgram share posts & text with your friend"
                    />
                </Head>
                {error && (
                    <h1 className="my-5 text-center text-2xl">
                        Something went wrong.. Please try again later...
                    </h1>
                )}

                <hr className="mt-7 h-0.5 bg-white" />

                <div className="flex justify-evenly mt-10">
                    <p
                        className={`mx-2 text-2xl cursor-pointer ${fetchedCategory !== "Top" ? "" : "border-blue-400 border-b-2"
                            }`}
                        onClick={() => {
                            changeCategory("Top");
                        }}
                    >
                        Top
                    </p>

                    <p
                        className={`mx-2 text-2xl cursor-pointer ${fetchedCategory !== "Media" ? "" : "border-blue-400 border-b-2"
                            }`}
                        onClick={() => {
                            changeCategory("Media");
                        }}
                    >
                        Photos
                    </p>
                    <p
                        className={`mx-2 text-2xl cursor-pointer ${fetchedCategory !== "Joke" ? "" : "border-blue-400 border-b-2"
                            }`}
                        onClick={() => {
                            changeCategory("Joke");
                        }}
                    >
                        Jokes
                    </p>
                    <p
                        className={`mx-2 text-2xl cursor-pointer ${fetchedCategory !== "Shayari"
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
                        className={`mx-2 text-2xl cursor-pointer ${fetchedCategory !== "Quote" ? "" : "border-blue-400 border-b-2"
                            }`}
                        onClick={() => {
                            changeCategory("Quote");
                        }}
                    >
                        Quotes
                    </p>
                </div>
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
                                        // className="w-1/3 text-center py-1 px-1 md:py-2 md:px-3"
                                        className="w-1/3 text-center my-2 mx-2"
                                    >
                                        <Image
                                            className="hover:opacity-40 hover:cursor-pointer"
                                            src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/posts/${post.photo}`}
                                            width={50}
                                            height={50}
                                            layout="responsive"
                                            onClick={() => {
                                                setPost(post);
                                                setModal(true);
                                            }}
                                        // onMouseEnter
                                        />
                                    </div>
                                ))}
                                
                            {fetchedCategory !== "Media" &&
                                posts.map((post) => (
                                    <div
                                        key={post._id}
                                        className="w-full my-2 py-2 px-1 rounded-md md:my-2 md:py-4 md:px-3 dark:bg-gray-600 dark:text-white bg-gray-300 text-black"
                                    >
                                        <p className="pl-4 text-2xl cursor-pointer" onClick={() => {
                                            setPost(post);
                                            setTextModal(true);
                                        }}>{post.body}</p>
                                        <p className="text-right pr-4">
                                            {new Date(post.createdAt).toLocaleDateString(
                                                "en-US",
                                                options
                                            )}
                                        </p>
                                        <div className="flex justify-evenly">
                                            {
                                                ((state && post.likes) && post.likes.includes(state._id))
                                                    ?
                                                    <div onClick={() => { unLikePost(post._id, posts, setPosts, setPost) }}>
                                                        <AiFillHeart className="cursor-pointer" />
                                                        <p>{post.likes.length} likes</p>
                                                    </div>
                                                    :
                                                    <div onClick={() => { likePost(post._id, posts, setPosts, setPost) }}>
                                                        <AiOutlineHeart className="cursor-pointer" />
                                                        <p>{post.likes.length} likes</p>
                                                    </div>
                                            }
                                            <div className="cursor-pointer" onClick={() => {
                                                setPost(post);
                                                setTextModal(true);
                                            }}>
                                                <FaRegComment />

                                                {
                                                    post.comments.length > 0
                                                        ?
                                                        <p>{post.comments.length} comments</p>
                                                        :
                                                        <p>No Comments</p>
                                                }
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
                        </div>
                    </InfiniteScroll>
                </div>
            </div>

            {/* {user == null && <div>Something went wrong...</div>} */}
        </div>
    );
}

