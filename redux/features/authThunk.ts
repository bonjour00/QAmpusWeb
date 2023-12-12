import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  getAuth,
  GoogleAuthProvider,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import app from "@/app/_firebase/Config";
import { setDoc, doc, getDoc, getFirestore } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);
//user logout
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await signOut(auth);
    return;
  } catch (err) {
    console.log(err);
  }
});

//Google sign-in
export const googleSignIn = createAsyncThunk("auth/googleSignIn", async () => {
  const googleAuthProvider = new GoogleAuthProvider();
  const res = await signInWithPopup(auth, googleAuthProvider);
  const usersCollectionRef = doc(db, "users", res.user.uid);

  const userAdd = async () => {
    try {
      await setDoc(usersCollectionRef, {
        email: auth?.currentUser?.email,
        url: auth?.currentUser?.photoURL,
        name: auth?.currentUser?.displayName,
        officeId: false, //預設false
      });
    } catch (err) {
      console.error(err);
    }
  };
  const checkHasAccount = async () => {
    try {
      const account = await getDoc(usersCollectionRef);

      if (!account.exists()) {
        userAdd();
        return account.data();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return;
  checkHasAccount();
});

//add movies bookmarks
// export const addMovieToBookmarkedDB = createAsyncThunk(
//   "bookmark/addMovieToBookmarked",
//   async (movie: MovieThunkProp, { dispatch, getState }) => {
//     const state = getState() as RootState;
//     const user = state.bookmark.user;
//     const movieId = movie.id.toString();
//     const { background, date, id, poster_path, title } = movie;

//     try {
//       const bookmarkedItemRef = doc(db, `${user?.uid as string}`, movieId);
//       const docSnap = await getDoc(bookmarkedItemRef);

//       if (docSnap.exists()) {
//         const existItem = docSnap.data();
//         dispatch(
//           addBookmarkFail(existItem.title + " already an existing item")
//         );
//       } else {
//         await setDoc(doc(db, `${user?.uid as string}`, movieId), {
//           background,
//           date,
//           id,
//           poster_path,
//           title,
//         });

//         dispatch(addMovieToBookmarked(movie));
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }
// );
