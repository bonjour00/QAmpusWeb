"use client";
import { useState, useEffect } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import app from "@/app/_firebase/Config";
import {
  setDoc,
  doc,
  getDoc,
  serverTimestamp,
  getDocs,
  collection,
  getFirestore,
} from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";

export default function AuthLogin({ props }: any) {
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  const db = getFirestore(app);
  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        const usersCollectionRef = doc(db, "users", res.user.uid);

        const userAdd = async () => {
          try {
            await setDoc(usersCollectionRef, {
              email: auth?.currentUser?.email,
              url: auth?.currentUser?.photoURL,
              name: auth?.currentUser?.displayName,
              officeId: "user", //預設user
            });
          } catch (err) {
            console.error(err);
          }
        };
        const checkHasAccount = async () => {
          const account = await getDoc(usersCollectionRef);
          if (!account.exists()) {
            userAdd();
          }
        };
        checkHasAccount();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleLogout = async function () {
    await signOut(auth);
  };

  return (
    <>
      <button onClick={signInWithGoogle}>login</button>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
