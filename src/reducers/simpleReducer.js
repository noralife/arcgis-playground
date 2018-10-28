export default (state = {}, action) => {
    switch (action.type) {
        case 'SIMPLE_ACTION':
             return { result: action.payload };
        case 'CHANGE_SETTING':
            return  { result: action.setting };
        default:
            return state
    }
}
