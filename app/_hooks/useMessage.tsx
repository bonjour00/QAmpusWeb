"use client";
import {
  collection,
  getFirestore,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  OrderByDirection,
  where,
} from "firebase/firestore";
import app from "@/app/_firebase/Config";
import { useEffect, useState } from "react";
import { QAadd, QA, Office } from "../_settings/interface";
import { usePathname } from "next/navigation";

interface SelectState {
  [key: string]: string;
}

export default function useQA() {
  const db = getFirestore(app);
  const qaRef = collection(db, "QA");
  const officeRef = collection(db, "office");
  const [QaList, setQalist] = useState<QA[]>([]);
  const [officeList, setOfficelist] = useState<Office[]>([]);
  const [QaListFilter, setQalistFilter] = useState<QA[]>([]);
  const [updated, setUpdated] = useState(0);
  const [select, setSelect] = useState<SelectState>({
    順序: "desc",
    指派系所: "",
  });
  const [search, setSearch] = useState("");
  const pathname = usePathname().substring(1);

  useEffect(() => {
    const fetchQA = async () => {
      const q = query(
        qaRef,
        where("officeId", "==", "GxBe4slDyHU2ETgvJDMF"), //等註冊
        where("status", "==", pathname), //pending or checked
        orderBy("qaAskTime", select.順序 as OrderByDirection)
      );
      try {
        const data = await getDocs(q);
        const list = data.docs.map((doc: any) => ({
          id: doc.id,
          qaId: doc.id,
          ...doc.data(),
        }));
        setQalist(list);
      } catch (error) {
        console.log("hi");
        console.log(error);
      }
    };
    fetchQA();
    console.log("fetch");
  }, [updated, db, select.順序]);

  useEffect(() => {
    setQalistFilter(
      QaList.filter(
        (QA) =>
          QA.question.toLowerCase().includes(search.toLowerCase()) ||
          QA.stuNum.toLowerCase().includes(search.toLowerCase())
      )
    );
    console.log("searchQuery");
  }, [QaList, search]);

  useEffect(() => {
    const fetchQffice = async () => {
      try {
        const data = await getDocs(officeRef);
        const list = data.docs.map((doc: any) => ({
          id: doc.id,
          value: doc.id,
          ...doc.data(),
        }));
        setOfficelist(list);
      } catch (error) {
        console.log(error);
      }
    };

    fetchQffice();
  }, [db]);

  const createQA = async (QAadd: QAadd) => {
    try {
      await addDoc(qaRef, {
        question: QAadd.question,
        answer: QAadd.answer,
        qaAskTime: serverTimestamp(),
        qaCheckTime: "",
        stuNum: "001", //學號
        office: "資管", //目前指派單位
        officeId: "GxBe4slDyHU2ETgvJDMF",
        assignCount: 0,
        history: ["資管"],
        status: "pending", //狀態 e.g 是否審核過
      });
      setUpdated((currentValue) => currentValue + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const updateQA = async (QA: QA) => {
    console.log("updateing");
    const QaCanCheck = QA.officeId === select.指派系所;
    const officeCurrent = officeList.filter((x) => x.id === select.指派系所)[0]
      .name;
    try {
      await updateDoc(doc(db, "QA", QA.qaId), {
        question: QA.question,
        answer: QA.answer,
        qaCheckTime: QaCanCheck ? serverTimestamp() : "",
        office: officeCurrent,
        officeId: select.指派系所,
        assignCount: QaCanCheck ? QA.assignCount : QA.assignCount + 1, //轉介次數
        history: QaCanCheck ? QA.history : [...QA.history, officeCurrent],
        status: QaCanCheck ? "checked" : "pending",
      });
      setUpdated((currentValue) => currentValue + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteQA = async (qaID: string) => {
    try {
      await deleteDoc(doc(db, "QA", qaID));
      setUpdated((currentValue) => currentValue + 1);
    } catch (error) {
      console.error(error);
    }
  };
  // console.log("selectOffice", select);
  // console.log("search", search);

  // const createOffice = async () => {
  //   try {
  //     const list = [
  //       { value: "1", name: "資管" },
  //       { value: "2", name: "統資" },
  //       { value: "3", name: "圖資" },
  //     ];
  //     const add = async (name: string) => {
  //       await addDoc(officeRef, {
  //         name,
  //       });
  //     };
  //     list.map((x) => add(x.name));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return [
    QaListFilter,
    createQA,
    deleteQA,
    updateQA,
    select,
    setSelect,
    search,
    setSearch,
    officeList,
  ] as const;
}