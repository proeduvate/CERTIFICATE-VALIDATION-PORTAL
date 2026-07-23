const initialState = {
    users: [],
};

export default function userSlice(state = initialState, action) {
    switch (action.type) {
        case 'SET_USERS':
            return { ...state, users: action.payload };
        case 'ADD_USER':
            return { ...state, users: [...state.users, action.payload] };
        default:
            return state;
    }
}