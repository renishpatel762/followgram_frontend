import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineUserAdd, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import styles from "../styles/Modal.module.css";
import { useRouter } from "next/router";
import { CgClose } from "react-icons/cg";

export default function Modal({
  closeModal,
  post,
  state,
  likePost,
  makeComment,
  unLikePost,
  posts,
  setPosts,
  setPost,
  isFromProfilePage,
  handleDeletePost,
  isFromCollection,
  collectionId,
  collectionName,
  collectionData,
  handleRemoveFromCollection,
}) {
  // console.log("post is", post);
  const [postSettingModal, setPostSettingModal] = useState(false);
  const router = useRouter();

  return (
    <div className="opacity-100">
      <div
        className={`fixed max-h-[90vh] scroll-smooth overflow-y-auto w-[100vw] md:w-[90vw] lg:w-[80vw] md:ml-[5vw] lg:ml-[10vw] top-[5vh] z-30 md:text-lg text-white xl:text-xl bg-gray-800 rounded-md py-4`}
      >
        <div className="relative">
          <span
            className="absolute right-4 -top-1 cursor-pointer z-30"
            onClick={closeModal}
          >
            <CgClose />
          </span>
        </div>
        {postSettingModal && (
          <div className="opacity-100">
            <div
              className={`fixed w-[50vw] md:w-[50vw] lg:w-[50vw] md:ml-[25vw] lg:ml-[25vw] top-[20vh] z-30 md:text-lg xl:text-xl bg-gray-600 rounded-md py-4`}
            >
              <div className="text-center cursor-pointer">
                <p
                  className="text-red-400"
                  onClick={() => {
                    handleDeletePost(post._id);
                    // handleRemoveFromCollection()
                    closeModal();
                  }}
                >
                  Delete Post
                </p>
                {isFromCollection && collectionName && (
                  <>
                    <p>In Collection : {collectionName}</p>
                    <p
                      className="text-red-400"
                      onClick={() => {
                        handleRemoveFromCollection(
                          collectionId,
                          post._id,
                          "Media"
                        );
                        closeModal();
                      }}
                    >
                      remove from Collection
                    </p>
                  </>
                )}
                <p onClick={() => setPostSettingModal(false)}>Cancel</p>
              </div>
            </div>
          </div>
        )}
        <div className="lg:flex">
          <div className="lg:pl-6 lg:w-1/2 text-center px-3 lg:px-0">
            <Image
              className="rounded-sm"
              src={`https://res.cloudinary.com/${
                process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
              }/image/upload/v1661253897/posts/${post && post.photo}`}
              width={500}
              height={500}
            />
          </div>
          {/* className="relative pl-6 w-1/2 pr-6 " */}
          <div className={`${styles.maincontainer} pl-2 pr-6 pt-3 lg:pt-0`}>
            <div className="flex items-center pb-1 border-b-2 border-gray-600 upperdiv">
              <Image
                className="rounded-full bg-white cursor-pointer"
                src={`https://res.cloudinary.com/${
                  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                }/image/upload/v1661253897/profile_pics/${
                  post && post.postedBy.pic
                }`}
                width={40}
                height={40}
                onClick={() => {
                  if (post.postedBy._id !== state._id)
                    router.push("/profile/" + post.postedBy._id);
                  else {
                    router.push("/profile");
                    closeModal();
                  }
                }}
              />
              <div className="w-2/3">
                <p
                  className="pl-4 cursor-pointer"
                  onClick={() => {
                    if (post.postedBy._id !== state._id)
                      router.push("/profile/" + post.postedBy._id);
                    else {
                      router.push("/profile");
                      closeModal();
                    }
                  }}
                >
                  {post && post.postedBy.name}
                </p>
                <p className="pl-4 text-sm">{post && post.body}</p>
              </div>

              <div className="absolute right-5 text-xl">
                {
                  // console.log("isFromProfilePage",isFromProfilePage)
                  isFromProfilePage ? (
                    <p
                      className="text-3xl text-white cursor-pointer"
                      onClick={() => setPostSettingModal(true)}
                    >
                      ...
                    </p>
                  ) : (
                    <>
                      {post &&
                        ((state && !state.following) ||
                          !state.following.includes(post.postedBy._id)) &&
                        state._id !== post.postedBy._id && (
                          <AiOutlineUserAdd
                            className="cursor-pointer"
                            onClick={() => {
                              if (post.postedBy._id !== state._id)
                                router.push("/profile/" + post.postedBy._id);
                              else {
                                router.push("/profile");
                                closeModal();
                              }
                            }}
                          />
                        )}
                    </>
                  )
                }
                <p className="text-xs">
                  {new Date(post && post.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
            {/* border-b-2 border-gray-300  */}
            <div className={`${styles.middlediv} scrollbar-hide`}>
              {post && post.comments.length > 0 ? (
                post.comments.map((citem) => {
                  // console.log(citem)
                  return (
                    <div className="flex m-5" key={citem._id}>
                      <div
                        className="flex cursor-pointer"
                        onClick={() => {
                          closeModal();
                          if (citem.postedBy._id !== state._id) {
                            router.push("/profile/" + citem.postedBy._id);
                          } else {
                            router.push("/profile");
                          }
                        }}
                      >
                        <Image
                          className="rounded-full bg-white"
                          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1661253897/profile_pics/${citem.postedBy.pic}`}
                          width={40}
                          height={40}
                        />
                        <p className="pl-1">{citem.postedBy.name}</p>
                      </div>
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
            <hr className="h-[1px] bg-gray-600 my-1" />
            {/* flex text-2xl mt-2 */}
            <div className={`${styles.bottomdiv} pt-1`}>
              {state && post && post.likes.includes(state._id) ? (
                <div
                  onClick={() => {
                    unLikePost(post._id, posts, setPosts, setPost);
                  }}
                >
                  <AiFillHeart className="cursor-pointer" />
                  <p>{post && post.likes.length} likes</p>
                </div>
              ) : (
                <div
                  onClick={() => {
                    // ikePost(post._id)
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
                    console.log(e.target[0].value);
                    // makeComment(e.target[0].value, post._id);
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
