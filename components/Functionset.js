export const likePost = (pid, posts, setPosts, setPost) => {
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

export const unLikePost = (pid, posts, setPosts, setPost) => {
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

export const makeComment = (text, postId, posts, setPost, setPosts) => {
    if (text === "" || text === null || text == " ") {
        return;
    }
    fetch('https://neutrinoapi-bad-word-filter.p.rapidapi.com/bad-word-filter',{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key":`${process.env.NEXT_PUBLIC_RAPID_RAPIDKEY}`,
          "X-RapidAPI-Host":`${process.env.NEXT_PUBLIC_RAPID_RAPID_HOST_WORD}`
        },
        body: JSON.stringify({
          "content":text          
        }),
      }).then(res=>res.json())
      .then(resultofapi=>{
        // console.log("resultofapi",resultofapi);
        if(!resultofapi['is-bad']){
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
        }else{
          toast.error("You can't post this text...", {
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