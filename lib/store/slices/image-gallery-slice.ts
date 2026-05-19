import { createSlice } from "@reduxjs/toolkit";

type ImageGalleryState = {
  open: boolean;
};

const initialState: ImageGalleryState = {
  open: false,
};

const imageGallerySlice = createSlice({
  name: "imageGallery",
  initialState,
  reducers: {
    openGallery(state) {
      state.open = true;
    },
    closeGallery(state) {
      state.open = false;
    },
    toggleGallery(state) {
      state.open = !state.open;
    },
  },
});

export const { openGallery, closeGallery, toggleGallery } =
  imageGallerySlice.actions;
export const imageGalleryReducer = imageGallerySlice.reducer;
