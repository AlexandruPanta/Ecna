import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : {plaque:null,interventions:[]}
}

export const interVehicules = createSlice({
    name : 'interVehicules',
    initialState,
    reducers : {
        addInterPlaque : (state,action) => {
            state.value = {plaque:action.payload.plaque,interventions:action.payload.interventions}
        }
    }
})

export const { addInterPlaque} = interVehicules.actions
export default interVehicules.reducer