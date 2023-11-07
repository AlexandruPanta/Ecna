import { createSlice } from '@reduxjs/toolkit';


const initialState = {
 value: [],
};

export const vehicules = createSlice({
    name: 'vehicules',
    initialState,
    reducers: {
    defineListVehicules : (state,action) => {
      state.value = action.payload
    },
    updateEtatVehicule : (state,action) => {
      state.value.filter(e => e.plaque === action.payload.plaque).etat = action.payload.etat
    }
 },
});

export const { defineListVehicules , updateEtatVehicule } = vehicules.actions;
export default vehicules.reducer;