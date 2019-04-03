import { GET_ANSWER, ADD_ANSWER, DELETE_ANSWER, GET_ANSWERS, ANSWERS_LOADING } from './/types';
import axios from 'axios';

export const getAnswers = id => dispatch => {
    dispatch(setAnswersLoading());
    axios
        .get(`./api/answers/${id}`)
        .then(res =>
            dispatch({
                type: GET_ANSWERS,
                payload: id
            })
        )
};

export const addAnswer = (answer) => dispatch => {
    axios.post('/api/answers', answer).then(res =>
        dispatch({
            type: ADD_ANSWER,
            payload: res.data
        })
    );
};

export const deleteAnswer = (id) => dispatch =>{
    axios.delete(`/api/answers/${id}`).then(res => 
        dispatch({
            type: DELETE_ANSWER,
            payload: id
        })
    )
};

export const setAnswersLoading = () => {
    return {
        type: ANSWERS_LOADING
    };
};