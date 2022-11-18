import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ImagePost from "../components/ImagePost";
import TextPost from "../components/TextPost";

export default function Home({
  speak,
  cancel,
  speaking,
  supported,
  voices,
  photoPost,
  postFilter,
  previousPostFilter,
  date1,
  date2,
}) {
  const router = useRouter();
  // const [photoPost, setPhotoPost] = useState(true);
  // const [postFilter, setPostFilter] = useState("all");
  // const [previousPostFilter, setPreviousPostFilter] = useState("all");
  // const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);


  useEffect(() => {
    if (!localStorage.getItem("user")) {
      router.push("/welcome");
    }
  }, []);

  useEffect(() => {
    // console.log(date1);
    // console.log(date2);
  }, [date1, date2]);

  const likePost = (pid) => {
    // console.log(pid);
    fetch('/api/like', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId: pid
      })
    })
      .then((res) => res.json())
      .then(result => {
        setPost(result);
        const newData = posts.map(item => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        })
        setPosts(newData);
        // console.log("like result is", result);
      }).catch(err => {
        console.error(err);
      })
  }

  const unLikePost = (pid) => {
    // console.log(pid);
    fetch('/api/unlike', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId: pid
      })
    })
      .then((res) => res.json())
      .then(result => {
        setPost(result);//setting post for modal

        const newData = posts.map(item => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        })
        setPosts(newData);
        // console.log("like result is", result);
      }).catch(err => {
        console.error(err);
      })
  }

  const makeComment = (text, postId) => {
    if (text === "" || text === null || text == " ") {
      return;
    }
    fetch("/api/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId,
        text
      }),
    }).then((response) => response.json())
      .then(result => {
        setPost(result);//for modal
        const newData = posts.map(item => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        })
        setPosts(newData);
      }).catch(err => {
        // console.log(err);
      })
  }

  return (
    <div className="h-full">
      <Head>
        <title>Followgram</title>
        <meta
          name="description"
          content="Followgram share posts & text with your friend"
        />
      </Head>
      <div>
        {photoPost ? (
          <ImagePost
          posts={posts}
          setPosts={setPosts}
          post={post}
          setPost={setPost}
          likePost={likePost}
          unLikePost={unLikePost}
          makeComment={makeComment}
          postFilter={postFilter}
          previousPostFilter={previousPostFilter}
          date1={date1}
          date2={date2}
          />
          ) : (
          <TextPost
            speak={speak}
            posts={posts}
            setPosts={setPosts}
            post={post}
            setPost={setPost}
            likePost={likePost}
            unLikePost={unLikePost}
            makeComment={makeComment}
            cancel={cancel}
            speaking={speaking}
            supported={supported}
            voices={voices}
            postFilter={postFilter}
            previousPostFilter={previousPostFilter}
            date1={date1}
            date2={date2}
          />
        )}
      </div>
    </div>
  );
}
