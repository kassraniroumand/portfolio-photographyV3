import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ImagesModel as Image } from "@/lib/generated/prisma/models";

type ImageModalState = {
  selected: Image | null;
};

const initialState: ImageModalState = {
  selected: null,
};

const imageModalSlice = createSlice({
  name: "imageModal",
  initialState,
  reducers: {
    openImage(state, action: PayloadAction<Image>) {
      state.selected = action.payload;
    },
    closeImage(state) {
      state.selected = null;
    },
  },
});

export const { openImage, closeImage } = imageModalSlice.actions;
export const imageModalReducer = imageModalSlice.reducer;
