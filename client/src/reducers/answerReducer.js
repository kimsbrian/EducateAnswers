import { GET_ANSWERS, ADD_ANSWER, DELETE_ANSWER, ANSWERS_LOADING } from '../actions/types';

const initialState = {
    answers: [],
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ANSWERS:
            return {
                ...state,
                items: action.payload,
                loading: false
            }
        case DELETE_ANSWER:
        return{
            ...state,
            items: state.answers.filter(item => item._id !== action.payload)

        }
        case ADD_ANSWER:
        return{
            ...state,
            items:[action.payload, ...state.answers]
        }
        case ANSWERS_LOADING:
        return{
            ...state,
            loading: true
        }
        default:
            return state;
    }
}