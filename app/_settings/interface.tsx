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
  qaUpdateTime: Date | string;
  qaDeleteTime: Date | string;
  stuNum: string; //學號
  lastUpdaterId: string;
  office: string; //目前指派單位
  officeId: string;
  assignCount: number; //轉介次數
  history: string[];
  status: string; //狀態 e.g 是否審核過
};

//office
export type Office = {
  id: string;
  value: string;
  name: string;
};
