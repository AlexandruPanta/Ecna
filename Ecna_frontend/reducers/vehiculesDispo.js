import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : []
}

export const vehiculesDispo = createSlice({
    name : 'vehiculesDispo',
    initialState,
    reducers : {
        defineListVehiculesDispo : (state,action) => {
            state.value = action.payload
        }
    }
})

export const {defineListVehiculesDispo} = vehiculesDispo.actions
export default vehiculesDispo.reducer