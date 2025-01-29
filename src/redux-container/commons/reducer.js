const initialState = {
    coe: []
};

const commonReducer = (state = initialState, action) => {
    switch (action.type) {
        case  'SET_COE':
            return {
                ...state,
                coe: action?.payload,
            }
        default:{
            return state
        }
    }
}

export default commonReducer;