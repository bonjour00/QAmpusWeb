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
    const res = await fetch(
      "https://fju-test3.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=shelly-search-test&api-version=2021-10-01",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": "fde6fc08d2e14a71b844af69aeea65f7",
        },
        body: JSON.stringify({
          question: message,
        }),
      }
    );
    const result = await res.json();
    const answer = result.answers[0].answer;
    createQA({
      question: message,
      answer,
    });
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
