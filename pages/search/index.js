import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import useSWRInfinite from "swr/infinite";
import loader from "../../public/loader.svg";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai";
import { BsPlay, BsPause, BsStop } from "react-icons/bs";
import { UserContext } from "../_app";
import Modal from "../../components/Modal";
import {
  likePost,
  unLikePost,
  makeComment,
} from "../../components/Functionset";
import { FaRegComment } from "react-icons/fa";
import TextModal from "../../components/TextModal";
import { GrClose } from "react-icons/gr";

const PAGE_SIZE = 3;
let category = "Media";
let sCategory = "Accounts";
const fetcher = (url) =>
  fetch(url, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  }).then((response) => response.json());

const getKey = (pageIndex, previousPageData) => {
  pageIndex = pageIndex + 1;
  if (previousPageData && !previousPageData.length) return null; // reached the end
  // return `/api/allpost`; // SWR key
  return `/api/allpost?page=${pageIndex}&limit=${PAGE_SIZE}&category=${category}`; // SWR key
};

export default function Search({ speak, cancel, speaking, supported, voices }) {
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

  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);
  const [resultData, setResultData] = useState([]);
  const [mediaData, setMediaData] = useState([]);
  const [textPostData, setTextPostData] = useState([]);
  const [isSearchData, setIsSearchData] = useState(false);
  const [searchCategory, setSearchCategory] = useState("Accounts");

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
    console.log(posts);
  }, [data]);

  const changeCategory = (cat) => {
    setFetchedCategory(cat);
    category = cat;
    setSize(1);
  };
  const changeSearchCategory = (cat) => {
    setSearchCategory(cat);
    sCategory = cat;
    // setSize(1);
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

  const handleSearchTermChange = (event) => {
    // console.log("handlesearchTerm called");
    setIsSearchData(true);
    const input = event.target.value;
    if (input === "") {
      setIsSearchData(false);
    }
    setSearchTerm(input);
    searchRef.current = input;
    BetterFunction();
  };
  const handleAPICall = () => {
    const searchTermCurrent = searchRef.current;
    // console.log("searchTermCurrent", searchTermCurrent);
    // console.log("searchRef is ", searchRef);
    // console.log("searchRef Current ", searchRef.current);
    // console.log("handleAPICall called");
    console.log("im before fetch");
    fetch("/api/accountsearch", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        searchquery: searchTermCurrent,
      }),
    })
      .then((response) => response.json())
      .then(({ accountdata }) => {
        console.log("accountdata", accountdata);
        setResultData(accountdata);
      });

    console.log("im after fetch");

    fetch("/api/mediasearch", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        searchquery: searchTermCurrent,
      }),
    })
      .then((response) => response.json())
      .then(({ mediadata }) => {
        console.log("mediadata", mediadata);
        setMediaData(mediadata);
      });

    console.log("im after mediasearch");
    fetch("/api/textpostsearch", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        searchquery: searchTermCurrent,
      }),
    })
      .then((response) => response.json())
      .then(({ textpostdata }) => {
        console.log("textpostdata", textpostdata);
        setTextPostData(textpostdata);
      });
    console.log("im after textsearch");
  };

  const myDeBounce = (fn, delay) => {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn();
      }, delay);
    };
  };

  const BetterFunction = useCallback(
    myDeBounce(() => handleAPICall(), 500),
    []
  );

  return (
    <div>
      {/* this is for modal */}

      <div id="modalBox">
        {modal && (
          <Modal
            post={post}
            state={state}
            posts={mediaData}
            setPosts={setMediaData} //changed
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
        {textModal && (
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
            postId={post._id}
            voices={voices}
            speaking={speaking}
            isFromFunctionset="true"
            //just some

            closeTextModal={() => {
              setTextModal(false);
            }}
          />
        )}
      </div>
      <div
        className={`min-h-screen px-2 dark:text-white dark:bg-gray-800 ${
          modal || textModal ? "opacity-80" : "opacity-100"
        }`}
      >
        <Head>
          <title>Search - Followgram</title>
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

        <div className="flex text-black pt-2 relative">
          {/* <p className="">Hello </p> */}
          <input
            className="w-[70vw] md:w-[80vw] lg:w-[90vw] rounded-md py-1 text-lg px-2"
            type="text"
            placeholder="search"
            onChange={handleSearchTermChange}
          />
          <span
            className="absolute cursor-pointer left-[60vw] md:left-[76vw] lg:left-[87vw] mt-3 pl-2"
            onClick={() => {
              setIsSearchData(false);
              // setSearchTerm("");
            }}
          >
            <GrClose />
          </span>
          <button onClick={handleAPICall} className="pl-2 text-white">
            Search
          </button>
        </div>

        {/* load posts here */}
        <hr className="mt-7 h-0.5 bg-white" />

        {isSearchData ? (
          <div>
            <div className="flex justify-evenly mt-10">
              {/* <p
                className={`mx-2 text-2xl cursor-pointer ${
                  searchCategory !== "Recent"
                    ? ""
                    : "border-blue-400 border-b-2"
                }`}
                onClick={() => {
                  changeSearchCategory("Recent");
                }}
              >
                Recent
              </p> */}

              <p
                className={`mx-2 text-2xl cursor-pointer ${
                  searchCategory !== "Accounts"
                    ? ""
                    : "border-blue-400 border-b-2"
                }`}
                onClick={() => {
                  changeSearchCategory("Accounts");
                }}
              >
                Accounts
              </p>

              <p
                className={`mx-2 text-2xl cursor-pointer ${
                  searchCategory !== "Media" ? "" : "border-blue-400 border-b-2"
                }`}
                onClick={() => {
                  changeSearchCategory("Media");
                }}
              >
                Photos
              </p>
              <p
                className={`mx-2 text-2xl cursor-pointer ${
                  searchCategory !== "TextPost"
                    ? ""
                    : "border-blue-400 border-b-2"
                }`}
                onClick={() => {
                  changeSearchCategory("TextPost");
                }}
              >
                TextPost
              </p>
              {/* <p
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
                    </p> */}
            </div>
            <div
              className={`w-full px-2 md:px-10 dark:bg-gray-800 ${
                searchCategory === "Media" ? "flex flex-wrap items-center" : ""
              }`}
            >
              {searchCategory === "Media" && (
                <>
                  {mediaData.length > 0 ? (
                    mediaData.map((mitem) => (
                      <div
                        key={mitem._id}
                        className="w-1/3 text-center py-1 px-1 md:py-2 md:px-3"
                      >
                        <Image
                          className="hover:opacity-40 hover:cursor-pointer"
                          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/posts/${mitem.photo}`}
                          width={50}
                          height={50}
                          layout="responsive"
                          onClick={() => {
                            setPost(mitem);
                            setModal(true);
                          }}
                          // onMouseEnter
                        />
                      </div>
                    ))
                  ) : (
                    <p>No Media Post available for current search</p>
                  )}
                </>
              )}
              {searchCategory === "Accounts" && (
                <>
                  {resultData.length > 0 ? (
                    resultData.map((acitem) => (
                      <div
                        className="flex m-5 cursor-pointer pl-2"
                        key={acitem._id}
                        onClick={() => {
                          if (acitem._id !== state._id) {
                            router.push("/profile/" + acitem._id);
                          } else {
                            router.push("/profile");
                          }
                        }}
                      >
                        <Image
                          className="rounded-full bg-white "
                          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${acitem.pic}`}
                          width={50}
                          height={50}
                        />
                        <div>
                          <p className="pl-2">{acitem.name}</p>
                          <p className="font-light pl-2">{acitem.email}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No Account available for current search</p>
                  )}
                </>
              )}
              {searchCategory === "TextPost" && (
                <>
                  {textPostData.length > 0 ? (
                    textPostData.map((tpitem) => (
                      <div
                        key={tpitem._id}
                        className="w-full my-2 py-2 px-1 rounded-md md:my-2 md:py-4 md:px-3 dark:bg-gray-600 dark:text-white bg-gray-300 text-black"
                      >
                        <p>{tpitem.type}</p>
                        <p
                          className="pl-4 text-2xl cursor-pointer"
                          onClick={() => {
                            setPost(tpitem);
                            setTextModal(true);
                          }}
                        >
                          {tpitem.body}
                        </p>
                        {/* <p className="text-right pr-4">
                                                {new Date(tpitem.createdAt).toLocaleDateString(
                                                    "en-US",
                                                    options
                                                )}
                                            </p> */}
                        <div className="flex justify-evenly">
                          {/* {
                                                    ((state && tpitem.likes) && tpitem.likes.includes(state._id))
                                                        ?
                                                        <div onClick={() => { unLikePost(tpitem._id, posts, setPosts, setPost) }}>
                                                            <AiFillHeart className="cursor-pointer" />
                                                            <p>{tpitem.likes.length} likes</p>
                                                        </div>
                                                        :
                                                        <div onClick={() => { likePost(tpitem._id, posts, setPosts, setPost) }}>
                                                            <AiOutlineHeart className="cursor-pointer" />
                                                            <p>{tpitem.likes.length} likes</p>
                                                        </div>
                                                } */}
                          {/* <div className="cursor-pointer" onClick={() => {
                                                    setPost(tpitem);
                                                    setTextModal(true);
                                                }}>
                                                    <FaRegComment />

                                                    {
                                                        tpitem.comments.length > 0
                                                            ?
                                                            <p>{tpitem.comments.length} comments</p>
                                                            :
                                                            <p>No Comments</p>
                                                    }
                                                </div> */}
                          {speaking && postId === tpitem._id ? (
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
                    ))
                  ) : (
                    <p>No Text Post available for current search</p>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-evenly mt-10">
              {/* <p
                className={`mx-2 text-2xl cursor-pointer ${
                  fetchedCategory !== "Top" ? "" : "border-blue-400 border-b-2"
                }`}
                onClick={() => {
                  changeCategory("Top");
                }}
              >
                Top
              </p> */}

              <p
                className={`mx-2 text-2xl cursor-pointer ${
                  fetchedCategory !== "Media"
                    ? ""
                    : "border-blue-400 border-b-2"
                }`}
                onClick={() => {
                  changeCategory("Media");
                }}
              >
                Photos
              </p>
              <p
                className={`mx-2 text-2xl cursor-pointer ${
                  fetchedCategory !== "Joke" ? "" : "border-blue-400 border-b-2"
                }`}
                onClick={() => {
                  changeCategory("Joke");
                }}
              >
                Jokes
              </p>
              <p
                className={`mx-2 text-2xl cursor-pointer ${
                  fetchedCategory !== "Shayari"
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
                className={`mx-2 text-2xl cursor-pointer ${
                  fetchedCategory !== "Quote"
                    ? ""
                    : "border-blue-400 border-b-2"
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
                        className="w-1/3 text-center py-1 px-1 md:py-2 md:px-3"
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
                        <p
                          className="pl-4 text-2xl font-bold cursor-pointer"
                          onClick={() => {
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
                          {state &&
                          post.likes &&
                          post.likes.includes(state._id) ? (
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
                </div>
              </InfiniteScroll>
            </div>
          </>
        )}

        {/* posts */}
      </div>

      {/* {user == null && <div>Something went wrong...</div>} */}
    </div>
  );
}
