
import { createSlice } from '@reduxjs/toolkit';
// stockage du user avec le token, username et le SIREN 
const initialState = {
 value: {token: null, username:null, SIREN:null},
};

export const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
    //ajoute le token dans le reducer 
    addtokenToSotre: (state, action) => {
        state.value.token = action.payload;
   },
   //ajoute le username dans le reducer 
   adduserToSotre: (state, action) => {
    state.value.username = action.payload;
  },
  //ajoute le SIREN dans le reducer 
   addSirenToSotre: (state, action) => {
    state.value.SIREN = action.payload;
  },
 },
});

export const { addtokenToSotre, adduserToSotre, addSirenToSotre } = user.actions;
export default user.reducer;