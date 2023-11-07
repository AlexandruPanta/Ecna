import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 value: {},
};

export const patient = createSlice({
    name: 'patient',
    initialState,
    reducers: {
    addpatientToStore: (state, action) => {
        state.value = action.payload ;
   },
 },
});

export const { addpatientToStore } = patient.actions;
export default patient.reducer;