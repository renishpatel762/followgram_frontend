// const getUser=()=>{
//     return JSON.parse(localStorage.getItem("user"))
// }
export const initialState = null;
export const reducer = (state,action)=>{
    // console.log(localStorage.getItem("user"));
    if(action.type==="USER"){
        return action.payload;
    }if(action.type==="CLEAR"){
        return null;
    }
    if(action.type==="UPDATE"){
        return{
            ...state,
            followers:action.payload.followers,
            following:action.payload.following
        }
    }
    if(action.type==="UPDATEPIC"){
        return{
            ...state,
            pic:action.payload.pic
        }
    }
    if(action.type==="UPDATEARRAY"){
        return{
            ...state,
            imagePost:action.payload.imagePost,
            textPost:action.payload.textPost
        }
    }
    return state;
}