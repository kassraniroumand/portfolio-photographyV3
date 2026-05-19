import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api";
import { imageGalleryReducer } from "./slices/image-gallery-slice";
import { imageModalReducer } from "./slices/image-modal-slice";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      imageGallery: imageGalleryReducer,
      imageModal: imageModalReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
  setupListeners(store.dispatch);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
