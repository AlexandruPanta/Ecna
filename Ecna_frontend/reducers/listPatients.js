import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : []
}

export const listPatients = createSlice({
    name : 'listPatients',
    initialState,
    reducers : {
        defineListPatients : (state,action) => {
            state.value = action.payload
        }
    }
})

export const {defineListPatients} = listPatients.actions
export default listPatients.reducer