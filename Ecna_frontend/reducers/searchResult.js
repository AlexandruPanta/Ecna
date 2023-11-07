import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value : []
}

export const searchResult = createSlice({
    name : 'searchResult',
    initialState,
    reducers : {
        updateSearchResults : (state,action) => {
            state.value = action.payload
        }
    }
})

export const {updateSearchResults} = searchResult.actions
export default searchResult.reducer