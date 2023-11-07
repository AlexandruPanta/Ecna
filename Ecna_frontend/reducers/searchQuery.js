import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : null
}

export const searchQuery = createSlice({
    name : 'searchQuery',
    initialState,
    reducers : {
        updateSearchQuery : (state,action) => {
            state.value = action.payload
        }
    }
})

export const {updateSearchQuery} = searchQuery.actions
export default searchQuery.reducer