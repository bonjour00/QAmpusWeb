"use client";
import { useState, useEffect } from "react";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import app from "@/app/_firebase/Config";
import { signInWithPopup } from "firebase/auth";
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
import { TextField } from "@mui/material";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Button, Card, CardContent, CardMedia, Input } from "@mui/material";

export default function SelectOption({ props }: any) {
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  const db = getFirestore(app);
  const storage = getStorage(app);
  const [file, setFile] = useState<File>();
  const handleUpload = async function (e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files !== null) {
      console.log(e.target.files[0]);
      setFile(e.target.files[0]);
    }
  };
  const [fileList, setFileList] = useState({ photo: "dog.png" });
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
              photo: file?.name ? file?.name : "dog.png",
            });
            if (file) {
              const imageRef = ref(storage, file?.name);
              await uploadBytes(imageRef, file);
            }
          } catch (err) {
            console.error(err);
          }
        };
        const checkHasAccount = async () => {
          const account = await getDoc(usersCollectionRef);

          if (!account.exists()) {
            const data = await getDocs(collection(db, "users"));
            userAdd();
            const starsRef = ref(storage, file?.name ? file?.name : "dog.png");
            const photoURL = await getDownloadURL(starsRef);
            setFileList({ photo: photoURL });
          }
        };
        checkHasAccount();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <>
      <button onClick={signInWithGoogle}>login</button>
      <TextField
        type="file"
        inputProps={{ accept: "image/x-png,image/jpeg" }}
        onChange={handleUpload}
      />
      <Card sx={{ maxWidth: "30vw" }}>
        <CardMedia component="img" image={fileList.photo} />
      </Card>
    </>
  );
}
