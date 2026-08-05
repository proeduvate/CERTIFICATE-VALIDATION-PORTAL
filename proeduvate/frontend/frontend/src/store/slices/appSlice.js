const initialState = {
    theme: 'light',
    notifications: [],
};

export default function appSlice(state = initialState, action) {
    switch (action.type) {
        case 'SET_THEME':
            return { ...state, theme: action.payload };
        case 'SET_NOTIFICATIONS':
            return { ...state, notifications: action.payload };
        default:
            return state;
    }
}