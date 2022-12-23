import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ImagePost from "../components/ImagePost";
import TextPost from "../components/TextPost";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    fetch('https://neutrinoapi-bad-word-filter.p.rapidapi.com/bad-word-filter', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": `${process.env.NEXT_PUBLIC_RAPID_RAPIDKEY}`,
        "X-RapidAPI-Host": `${process.env.NEXT_PUBLIC_RAPID_RAPID_HOST_WORD}`
      },
      body: JSON.stringify({
        "content": text
      }),
    }).then(res => res.json())
      .then(resultofapi => {
        // console.log("resultofapi",resultofapi);
        if (!resultofapi['is-bad']) {
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
        } else {
          toast.error("You can't comment this text...", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
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
