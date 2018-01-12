import axios from 'axios';

const initialState = {
    user: {} //we will need more than the user on the reducer, but this is what I'm starting with due to limited time. 
}

const USERINFO = 'USERINFO';

//action creator
export function getUser(){
    let userData = axios.get('/api/auth/setUser').then(res=>{
        return res.data;
    })

    return{
        type: USERINFO, 
        payload: userData
        } 
}

export default function Reducer(state=initialState, action){ //takes in an action and state. State comes from the store, which has the current state. The reducer returns the updated state to the store. 
    switch(action.type){
        case USERINFO + '_FULFILLED': //the second part comes from the promise middleware. We have to use this because of the async axios call. 
            return Object.assign({}, state, {user: action.payload})
        default:
        return state;
    }
}

