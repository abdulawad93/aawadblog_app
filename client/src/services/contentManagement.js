import axios from "axios";
import qs from "querystring";

const API_URL = "/api/";

const URLEncodedHeader={"Content-Type":"application/x-www-form-urlencoded"};



//Getting all post
const getPosts= (setPosts,source)=>{
    const url=API_URL+"get-posts";
        const headers={"Content-Type": "application/json"}
        axios.get(url,{cancelToken:source.token},headers).then(response=>{setPosts(response.data.reverse());}).catch(err=>{console.log(err);});
}


//Getting post by user id to display in profile page
const getPostsByUserID= (userID,setPosts)=>{
    const url=API_URL+"get-posts-by-user-id";
        const data={userID:userID};
        axios.post(url,qs.stringify(data),URLEncodedHeader).then(response=>{setPosts(response.data);}).catch(err=>{console.log(err);});
}


//Creating new post in mongoDB
const addPost= (postTitle,postContent,publisher,userID)=>{
    const url=API_URL+"create-post";
    const data={title:postTitle,content:postContent,publisher:publisher,userID:userID};
    axios.post(url,qs.stringify(data),URLEncodedHeader)
    .then((response)=>console.log(response))
    .catch(err=>{console.log(err);});
}


//Editing/patching a post with title and content
const editPost= (postID,title,content)=>{
    const url=API_URL+"edit-post";
            const data={_id:postID,title:title,content:content};
            axios.patch(url,qs.stringify(data),URLEncodedHeader)
            .then((response)=>console.log(response))
            .catch(err=>{console.log(err);});
}

//Removing a post using params
const removePost= (postID)=>{
    const url=API_URL+"delete-post/"+postID;
        axios.delete(url)
        .then((response)=>console.log(response))
        .catch(err=>{console.log(err);});
}


//Getting comments per post
const getComments=(postID,comments,setComments,setNumberOfComments,source)=>{
    const url=API_URL+"get-comments";
    const data={postID:postID};
    axios.post(url,qs.stringify(data),{cancelToken:source.token},URLEncodedHeader).then(
        response=>setComments(response.data.reverse())
        ).catch(err=>{console.log(err);});
    setNumberOfComments(comments.length);
}

//Adding comment to MongoDB
const addComment=(content,userID,postID,username)=>{
    const url=API_URL+"add-comment";
    const data={content:content,userID:userID,postID:postID,commenter:username};
    axios.post(url,qs.stringify(data),URLEncodedHeader).then(response=>console.log(response)).catch(err=>{console.log(err);});
}

//Editing/patching comment
const editComment=(content,commentID)=>{
    const url=API_URL+"edit-comment";
    const data={content:content,commentID:commentID};
    axios.patch(url,qs.stringify(data),URLEncodedHeader).then(response=>{console.log(response);}).catch(err=>{console.log(err);});
}

//Removing comment using params
const removeComment= (commentID=>{
    const url=API_URL+"delete-comment/"+commentID;
    axios.delete(url).then(response=>console.log(response)).catch(err=>{console.log(err);});
})

//Adding a user ID to a post that indicate the addition of a like
const likePost=(postID,userID)=>{
    const url=API_URL+"add-like";
    const data={postID:postID,userID:userID};
    axios.post(url,qs.stringify(data),URLEncodedHeader).then((response)=>console.log(response)).catch(err=>console.log(err));
}

//Removing a user ID from a post that indicate the removal of a like
const unlikePost=(postID,userID)=>{
    const url=API_URL+"remove-like/user/"+userID+"/post/"+postID;
    axios.delete(url).then((response)=>console.log(response)).catch(err=>console.log(err));
}

export {getPosts, getPostsByUserID, addPost, editPost, removePost, getComments, addComment, editComment, removeComment, likePost, unlikePost};