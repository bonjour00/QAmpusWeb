"use client";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import useQA from "../_hooks/useMessage";

export default function Message() {
  const [message, setMessage] = useState("");
  const [QaListFilter, createQA, deleteQA, updateQA] = useQA();
  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async () => {
    const res = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: message,
      }),
    });
    const result = await res.json();
    const answer = result.message.answers[0].answer;
    createQA({
      question: message,
      answer,
    });
    console.log(answer);
  };

  const keyPress = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(`Pressed keyCode ${ev.key}`);
    if (ev.key === "Enter") {
      handleSubmit();
      setMessage("");
    }
  };
  return (
    <>
      {QaListFilter.map((x) => (
        <div key={x.qaId}>
          {x.question}/{x.answer}
        </div>
      ))}
      <TextField
        id="fullWidth"
        fullWidth
        label="問啥?"
        variant="filled"
        value={message}
        onKeyUp={keyPress}
        onChange={handleClick}
      />
    </>
  );
}
