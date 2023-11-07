import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : []
}

export const interventions = createSlice({
    name : 'interventions',
    initialState,
    reducers : {
        defineListInter : (state,action) => {
            state.value = action.payload
        }
    }
})

export const {defineListInter} = interventions.actions
export default interventions.reducer