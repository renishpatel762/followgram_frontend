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
            console.log(err);
        })
}