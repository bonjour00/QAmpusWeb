//QA
export type QAadd = {
  question: string;
  answer: string;
};

export type QA = {
  id?: string;
  qaId: string;
  question: string;
  answer: string;
  qaAskTime: Date;
  qaCheckTime: Date | string;
  stuNum: string; //學號
  office: string; //目前指派單位
  officeId: string;
  assignCount: number; //轉介次數
  history: string[];
  status: string; //狀態 e.g 是否審核過
  // QaCanCheck?: boolean;
};
// export type QaUpate = {
//   question: string;
//   answer: string;
//   office: string;
//   officeId: number;
//   canCheck: boolean;
// };

//office
export type Office = {
  id: string;
  value: string;
  name: string;
};
