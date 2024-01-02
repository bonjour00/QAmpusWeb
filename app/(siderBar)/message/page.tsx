"use client";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import useQA from "../../_hooks/useQA";
import axios from "axios";
type Message = {
  question: string;
  answer: string;
  confidenceScore: number;
  questionsOrgin: string;
  source: string;
};
export default function Message() {
  const [question, setQuestion] = useState("");
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [
    QaListFilter,
    createQA,
    deleteQA,
    updateQA,
    select,
    setSelect,
    search,
    setSearch,
    officeList,
    loading,
    recoverQA,
  ] = useQA();
  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async () => {
    const result = await axios.post("/api", {
      question,
    });
    const answer = result.data.message.answers[0].answer;
    const confidenceScore = result.data.message.answers[0].confidenceScore;
    const questionsOrgin = result.data.message.answers[0].questions[0];
    const source = result.data.message.answers[0].source;
    setMessageList(() => [
      ...messageList,
      { answer, question, confidenceScore, questionsOrgin, source },
    ]);
    if (confidenceScore < 0.7) {
      createQA({
        question,
        answer,
      });
    }
  };

  const keyPress = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(`Pressed keyCode ${ev.key}`);
    if (ev.key === "Enter") {
      handleSubmit();
      setQuestion("");
    }
  };
  return (
    <>
      {/* {messageList.map((x, index) => (
        <div key={index}>
          {x.question}
          <br />
          {x.answer}
          <br />
          {x.confidenceScore}
          <br />
          {x.questionsOrgin}
          <br />
          {x.source}
        </div>
      ))}
      <TextField
        id="fullWidth"
        fullWidth
        label="問啥?"
        variant="filled"
        value={question}
        onKeyUp={keyPress}
        onChange={handleClick}
      /> */}

      <div className="flex flex-col items-center justify-center w-screen min-h-screen  text-gray-800 p-10">
        <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
            {messageList.map((x, index) => (
              <div key={index}>
                <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                  <div>
                    <div className="bg-blue-500 text-white p-3 rounded-l-lg rounded-br-lg">
                      <p className="text-sm">{x.question}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                </div>
                <div className="flex w-full mt-2 space-x-3 max-w-xs">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                  <div>
                    <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                      <p className="text-sm">
                        {x.answer}
                        <br />
                        {x.confidenceScore !== 0 && (
                          <>
                            {x.confidenceScore}
                            <br />
                            {x.questionsOrgin}
                            <br />
                            <a href={x.source}>{x.source}</a>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-300 p-4">
            <input
              className="flex items-center h-10 w-full rounded px-3 text-sm"
              type="text"
              placeholder="Type your message…"
              value={question}
              onKeyUp={keyPress}
              onChange={handleClick}
            />
          </div>
        </div>
      </div>
    </>
  );
}
