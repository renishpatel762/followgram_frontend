import React, { useState } from "react";
import Image from "next/image";
import {CgClose} from "react-icons/cg"
import { AiOutlineUserAdd, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import styles from "../styles/TextModal.module.css";
import { BsPlay, BsPause, BsStop } from "react-icons/bs";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function TextModal({
  closeTex,
  tModal,
  post,
  state,
  likePost,
  makeComment,
  unLikePost,
  speaking,
  postId,
  handleAudio,
  closeTextModal,
  collectionName,
  collectionId,
  isFromFunctionset,
  isFromCollection,
  isFromProfilePage,
  posts,
  setPosts,
  setPost,
  handleRemoveFromCollection,
  handleDeletePost,
  voices
}) {
  const [postSettingModal, setPostSettingModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // console.log(voices);
  },[voices]);
  // console.log("post is", post);
  return (
    <div className="opacity-100">
      <div
        className={`fixed max-h-[90vh] scroll-smooth overflow-y-auto w-[100vw] md:w-[90vw] lg:w-[80vw] md:ml-[5vw] lg:ml-[10vw] top-[5vh] z-30 md:text-lg xl:text-xl bg-gray-800 text-white rounded-md py-4`}
      >
        <div className="relative">
          <span
            className="absolute right-4 -top-1 cursor-pointer z-30"
            onClick={closeTextModal}
          >
            <CgClose />
          </span>
        </div>
        {
          postSettingModal
          &&
          <div className="opacity-100">
            <div
              className={`fixed w-[50vw] md:w-[50vw] lg:w-[50vw] md:ml-[25vw] lg:ml-[25vw] top-[20vh] z-30 md:text-lg xl:text-xl bg-gray-600 rounded-md py-4`}
            >
              <div className="text-center cursor-pointer">
                <p className="text-red-400" onClick={() => {
                  handleDeletePost(post._id)
                  closeTextModal()
                }}>Delete Post</p>
                {
                  (isFromCollection && collectionName) &&
                  <>
                    <p>In Collection : {collectionName}</p>
                    <p className="text-red-400" onClick={() => {
                      handleRemoveFromCollection(collectionId, post._id, "Text")
                      closeTextModal();
                    }}>remove from Collection</p>
                  </>
                }
                <p onClick={() => setPostSettingModal(false)}>Cancel</p>
              </div>
            </div>
          </div>
        }
        <div className="lg:flex">
          <div className="lg:px-3 lg:w-1/2 pt-4 px-2">
            <h3 className="text-sm">{post && post.type}</h3>
            <pre className="text-2xl overflow-x-auto whitespace-pre-wrap break-words font-sans">{post && post.body}</pre>
            {/* <Image
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/posts/${post.photo}`}
              width={500}
              height={500}
            /> */}
            <hr className="h-[1px] bg-gray-600 my-4" />
            <div className="text-4xl my-10">
              {post && speaking && postId === post._id ? (
                <BsStop
                  className="cursor-pointer mx-auto"
                  onClick={() => {
                    handleAudio(null);
                  }}
                />
              ) : (
                <BsPlay
                  className="cursor-pointer mx-auto"
                  onClick={() => {
                    handleAudio(post);
                  }}
                />
              )}
            </div>
          </div>
          {/* className="relative pl-6 w-1/2 pr-6 " */}
          <div className={`${styles.maincontainer} pl-2`}>
            <div
              className="flex items-center pb-1 border-b-2 border-gray-600 upperdiv cursor-pointer"            >
              <Image
                className="rounded-full bg-white"
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${post && post.postedBy.pic}`}
                width={40}
                height={40}
                onClick={() => {
                  if (post.postedBy._id !== state._id)
                    router.push("/profile/" + post.postedBy._id);
                  else {
                    router.push("/profile");
                    closeTextModal();
                  }
                }}
                alt="miage"
              />
              <div>
                <p className="pl-4"
                  onClick={() => {
                    if (post.postedBy._id !== state._id)
                      router.push("/profile/" + post.postedBy._id);
                    else {
                      router.push("/profile");
                      closeTextModal();
                    }
                  }}
                >{post && post.postedBy.name}</p>
                {/* <p className="pl-4 text-sm">{post.body}</p> */}
              </div>
              <div className="absolute right-5 text-xl">
                {
                  // console.log("isFromProfilePage",isFromProfilePage)
                  isFromProfilePage
                    ?
                    <p className="text-3xl text-white cursor-pointer" onClick={() => {
                      // console.log("ds fkjdsfh ds------------");
                      setPostSettingModal(true)
                    }
                    }>...</p>
                    :
                    <>
                      {
                        post && (((state && !state.following) || (!state.following.includes(post.postedBy._id))) && state._id !== post.postedBy._id)
                        &&

                        <AiOutlineUserAdd className="cursor-pointer" onClick={() => {
                          if ((post && post.postedBy._id) !== state._id)
                            router.push("/profile/" + post.postedBy._id)
                          else {
                            router.push("/profile");
                            closeTextModal();
                          }
                        }} />
                      }
                    </>
                }
                <p className="text-xs">
                  {new Date(post && post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

              </div>
            </div>
            {/* border-b-2 border-gray-300  */}
            <div className={`${styles.middlediv} scrollbar-hide`}>
              {post && post.comments.length > 0 ? (
                post.comments.map((citem) => {
                  // console.log(citem);
                  return (
                      <div
                        className="flex m-5 cursor-pointer"
                        onClick={() => {
                          closeTextModal();
                          if (citem.postedBy._id !== state._id) {
                            router.push("/profile/" + post.postedBy._id);
                          } else {
                            router.push("/profile");
                          }
                        }}
                        key={citem._id}
                      >
                        <Image
                          className="rounded-full bg-white"
                          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${citem.postedBy.pic}`}
                          width={40}
                          height={40}
                        />
                        <p className="pl-1">{citem.postedBy.name}</p>
                        <p className="font-light pl-2">{citem.text}</p>
                      </div>
                  );
                })
              ) : (
                <div>
                  <p className="m-5">No Comments yet</p>
                </div>
              )}
            </div>
            {/* flex text-2xl mt-2 */}
            <hr className="h-[1px] bg-gray-600 my-1" />
            <div className={`${styles.bottomdiv} pt-1`}>
              {state && post && post.likes.includes(state._id) ? (
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
                  <p>{post && post.likes.length} likes</p>
                </div>
              )}
              <div className="ml-2">
                <form
                  className={styles.CommentBox}
                  onSubmit={(e) => {
                    e.preventDefault();
                    // console.log(e.target[0].value);
                    makeComment(
                      e.target[0].value,
                      post._id,
                      posts,
                      setPost,
                      setPosts
                    );
                    e.target[0].value = "";
                  }}
                >
                  <input
                    className={styles.CommentInput}
                    type="text"
                    placeholder="add a comment"
                  />
                  <button>Post</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}