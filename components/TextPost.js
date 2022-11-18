import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import useSWRInfinite from "swr/infinite";
import loader from "../public/loader.svg";
import { AiOutlineUserAdd, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { UserContext } from "../pages/_app";
import { BsPlay, BsPause, BsStop } from "react-icons/bs";
import Modal from "./Modal";
import TextModal from "./TextModal";
import { useRouter } from "next/router";
import Link from "next/link";

const PAGE_SIZE = 5;
let cat = "Joke";
const fetcher = (url) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  }).then((response) => response.json());

let currentPostFilter = "all"

let bdate1 = "";
let bdate2 = "";

const getKey = (pageIndex, previousPageData) => {
  pageIndex = pageIndex + 1;
  if (previousPageData && !previousPageData.length) return null; // reached the end
  // return `/api/allpost`; // SWR key
  return `/api/followingpost?page=${pageIndex}&limit=${PAGE_SIZE}&category=${cat}&postFilter=${currentPostFilter}&date1=${bdate1}&date2=${bdate2}`; // SWR key
};

export default function TextPost({
  speak,
  cancel,
  speaking,
  supported,
  voices,
  postFilter,
  previousPostFilter,
  date1,
  date2,
  posts,
  setPosts,
  post,
  setPost,
  likePost,
  unLikePost,
  makeComment
}) {
  const [state, dispatch] = useContext(UserContext);
  // const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("Joke");
  const [morePosts, setMorePosts] = useState(true);
  const [postId, setPostId] = useState("");
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [textModal, setTextModal] = useState(false);
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetcher
  );
  const router = useRouter();

  let isLoadingMore = true,
    isReachedEnd = false;

  useEffect(() => {
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
    // console.log(data);
  }, [data]);

  const changeCategory = (c) => {
    setCategory(c);
    cat = c;
    setSize(1);
  };
  useEffect(() => {
    // console.log("post filter called", postFilter);
    currentPostFilter = postFilter;
    setPosts([]);
  }, [postFilter]);

  useEffect(() => {
    // console.log("date1", date1);
    // console.log("date2", date2);
    if (date1 != null && date2 != null) {
      // console.log("both not null calling");

      bdate1 = date1;
      bdate2 = date2;
      setPosts([]);
    }
  }, [date1, date2])

  const handleAudio = (post) => {
    if (supported) {
      if (!post) {
        cancel();
        setPostId("");
        return;
      }

      if (speaking) {
        cancel();
        setTimeout(() => {
          setPostId(post._id);
          speak({ text: post.body, voice: voices[voiceIndex] });
        }, 300);
      } else {
        setPostId(post._id);
        speak({ text: post.body, voice: voices[voiceIndex] });
      }
    } else {
      alert("Sorry!! This feature is not supported in your browser");
    }
  };

  return (
    <div>
      <div id="modalBox">
        {textModal && (
          <TextModal
            post={post}
            state={state}
            likePost={likePost}
            unLikePost={unLikePost}
            makeComment={makeComment}
            speaking={speaking}
            handleAudio={handleAudio}
            postId={postId}
            closeTextModal={() => {
              setTextModal(false);
            }}
          />
        )}
      </div>
      <div className={`pt-1 md:pt-4 dark:bg-gray-800 dark:text-white bg-white text-black min-h-screen ${textModal ? 'opacity-80' : 'opacity-100'}`}>
        <div className="flex justify-evenly mb-2">
          <p
            className={`text-xl ${category === "Joke" ? "border-b-2 border-white font-semibold" : ""
              }  cursor-pointer px-2`}
            onClick={() => {
              changeCategory("Joke");
            }}
          >
            Jokes
          </p>
          <p
            className={`text-xl ${category === "Shayari" ? "border-b-2 border-white font-semibold" : ""
              }  cursor-pointer px-2`}
            onClick={() => {
              changeCategory("Shayari");
            }}
          >
            Shayari
          </p>
          <p
            className={`text-xl ${category === "Quote" ? "border-b-2 border-white font-semibold" : ""
              }  cursor-pointer px-2`}
            onClick={() => {
              changeCategory("Quote");
            }}
          >
            Quotes
          </p>
        </div>

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
          <div className="lg:w-3/4 px-2 mx-auto md:px-10">
            <div className="md:flex md:justify-between">
              <p className="text-xl">Select voice Language -&gt;</p>
              <select
                name="voice"
                className="bg-transparent rounded-md max-w-[95vw]"
                value={voiceIndex || ""}
                onChange={(e) => {
                  setVoiceIndex(e.target.value);
                }}
              >
                {voices.map((option, index) => (
                  <option
                    key={option.voiceURI}
                    value={index}
                    className="dark:text-black"
                  >
                    {`${option.lang} - ${option.name} ${option.default ? "- Default" : ""
                      }`}
                  </option>
                ))}
              </select>
            </div>
            {(posts && posts.length > 0) ?
              posts.map((post) => (
                <div
                  key={post._id}
                  className={`my-3 bg-gray-700 p-2 rounded-md`}
                >
                  <div className="flex items-center pb-1 border-b-2 border-gray-800 relative cursor-pointer"
                    onClick={() => {
                      if (post.postedBy._id !== state._id)
                        router.push("/profile/" + post.postedBy._id)
                      else
                        router.push("/profile");
                    }}
                  >
                    <Image
                      className="rounded-full bg-white"
                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${post.postedBy.pic}`}
                      width={35}
                      height={35}
                    />
                    <h1 className="pl-4 text-white">{post.postedBy.name}</h1>
                    <span className="absolute right-4 text-xl cursor-pointer text-gray-800">
                      {
                        (state && state.followings && state.followings.includes(post.postedBy._id)) &&

                        <AiOutlineUserAdd className="cursor-pointer" onClick={() => {
                          if (post.postedBy._id !== state._id)
                            router.push("/profile/" + post.postedBy._id)
                          else {
                            router.push("/profile");
                            closeModal();
                          }
                        }} />
                      }
                    </span>
                  </div>
                  <div className="my-1">
                    <p className="text-2xl px-1 py-2 text-white cursor-pointer" onClick={() => {
                      setPost(post); setTextModal(true);
                    }}>{post.body}</p>
                    <div className="flex my-2 justify-evenly text-2xl">
                      {
                        (state && post.likes.includes(state._id))
                          ?
                          <div onClick={() => { unLikePost(post._id) }}>
                            <AiFillHeart className="cursor-pointer" />
                            <p>{post.likes.length} likes</p>
                          </div>
                          :
                          <div onClick={() => { likePost(post._id) }}>
                            <AiOutlineHeart className="cursor-pointer" />
                            <p>{post.likes.length} likes</p>
                          </div>
                      }
                      <div className="cursor-pointer" onClick={() => { setPost(post); setTextModal(true); }}>
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
                          className="cursor-pointer"
                          onClick={() => {
                            handleAudio(null);
                          }}
                        />
                      ) : (
                        <BsPlay
                          className="cursor-pointer"
                          onClick={() => {
                            handleAudio(post);
                          }}
                        />
                      )}
                    </div>
                    <div className="flex justify-end my-1">
                      <p className="text-xs">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
              :
              <div className="text-center pt-4 pb-3">
                <p className="text-2xl">Start Following more people to see post here</p>
                <Link href={'/search'}>You can explore more post here &gt;</Link>
              </div>
            }
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
