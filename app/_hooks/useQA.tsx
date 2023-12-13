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
import { useEffect, useState, useRef } from "react";
import { QAadd, QA, Office } from "../_settings/interface";
import { usePathname } from "next/navigation";
import { fail, successs } from "../_component/Table/ActionBtn/animateAction";

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
  const [loading, setLoading] = useState(false);
  const [select, setSelect] = useState<SelectState>({
    順序: "desc",
    指派系所: "",
  });
  const [search, setSearch] = useState("");
  const pathname = usePathname().substring(1);
  const canFetch = useRef(false);

  const autoDelete = async (qaID: string) => {
    try {
      await updateDoc(doc(db, "QA", qaID), {
        lastUpdaterId: "system",
        // qaUpdateTime: serverTimestamp(),
        qaDeleteTime: serverTimestamp(),
        status: "totalDel",
      });
    } catch (error) {
      console.error(error);
    }
  };
  const autoAssign = async (qaID: string) => {
    try {
      await updateDoc(doc(db, "QA", qaID), {
        qaUpdateTime: serverTimestamp(),
        lastUpdaterId: "system",
        office: "資訊中心",
        officeId: "iFzUP8v4QxfQYVkBkoc7",
        status: "noAssign",
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!canFetch.current) {
      canFetch.current = true;
      return;
    }

    const fetchQA = async () => {
      setLoading(true);
      const orderByWhat =
        pathname == "checked"
          ? "qaUpdateTime"
          : pathname == "recentDel"
          ? "qaDeleteTime"
          : "qaAskTime";
      const q = query(
        qaRef,
        where("officeId", "==", "GxBe4slDyHU2ETgvJDMF"), //等註冊
        where("status", "==", pathname), //pending or checked...
        orderBy(orderByWhat, select.順序 as OrderByDirection)
      );
      try {
        const data = await getDocs(q);
        const list = data.docs.map((doc: any) => ({
          id: doc.id,
          qaId: doc.id,
          ...doc.data(),
        }));
        if (list.some(Boolean)) {
          switch (pathname) {
            case "pending":
              const toNoAssign = list.filter(
                (x) => new Date(x.needAssignTime.toDate()) < new Date()
              ); //丟到noAssign
              const remain = list.filter(
                (x) => new Date(x.needAssignTime.toDate()) >= new Date()
              ); //還在(不動)
              toNoAssign.map((x) => autoAssign(x.qaId));
              setQalist(remain);
              break;
            case "recentDel":
              const toTotalDel = list.filter(
                (x) => new Date(x.autoDeleteTime.toDate()) < new Date()
              ); //丟到noAssign
              const delRemain = list.filter(
                (x) => new Date(x.autoDeleteTime.toDate()) >= new Date()
              ); //還在(不動)
              toTotalDel.map((x) => autoDelete(x.qaId));
              setQalist(delRemain);
              break;
            default:
              setQalist(list);
          }
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
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
    const needAssignTime = new Date();
    needAssignTime.setDate(needAssignTime.getDate() + 7);
    try {
      await addDoc(qaRef, {
        question: QAadd.question,
        answer: QAadd.answer,
        qaAskTime: serverTimestamp(),
        qaUpdateTime: "",
        qaDeleteTime: "",
        needAssignTime,
        stuNum: "001", //學號(要改auth)
        lastUpdaterId: "", //最後修改的人(要改auth)
        office: "資管", //目前指派單位
        officeId: "GxBe4slDyHU2ETgvJDMF",
        assignCount: 1,
        history: ["資管"],
        status: "pending", //狀態 e.g 是否審核過
        sendResponse: true, //當check時給使用者回信過嗎(只要回一次)
        autoDeleteTime: false,
      });
      setUpdated((currentValue) => currentValue + 1);
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  };

  const updateQA = async (QA: QA) => {
    const QaCanCheck =
      QA.status == "noAssign" ? false : QA.officeId === select.指派系所;
    const officeCurrent = officeList.filter((x) => x.id === select.指派系所)[0]
      .name;
    const sendResponse =
      QA.status == "noAssign"
        ? true
        : QaCanCheck && QA.sendResponse
        ? false
        : true; //在此發信(!assignCount > 3 = true發)
    const assignCount =
      QA.status == "noAssign"
        ? 1 //重新計算
        : QaCanCheck
        ? 1 //重新計算
        : QA.assignCount + 1; //轉介次數
    const status =
      assignCount > 3 ? "noAssign" : QaCanCheck ? "checked" : "pending"; //如果assignCount轉過3次丟改指派單位，接下來才看是否checked
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const needAssignTime =
      QA.status == "noAssign"
        ? date
        : QaCanCheck
        ? false
        : QA.needAssignTime
        ? QA.needAssignTime
        : date; //代表從check變pending所以要重設
    const history =
      assignCount > 3
        ? QA.history
        : QaCanCheck
        ? QA.history
        : [...QA.history, officeCurrent];
    try {
      setLoading(true);
      await updateDoc(doc(db, "QA", QA.qaId), {
        question: QA.question,
        answer: QA.answer,
        qaUpdateTime: serverTimestamp(),
        needAssignTime,
        lastUpdaterId: "update001", //最後修改的人(要改auth)
        office: assignCount > 3 ? "資訊中心" : officeCurrent,
        officeId: assignCount > 3 ? "iFzUP8v4QxfQYVkBkoc7" : select.指派系所,
        assignCount,
        history,
        status,
        sendResponse,
      });
      successs("修改成功");
      setUpdated((currentValue) => currentValue + 1);
    } catch (error) {
      console.log(error);
      fail("發生錯誤");
      setLoading(false);
    }
  };

  const deleteQA = async (qaID: string) => {
    const autoDeleteTime = new Date();
    autoDeleteTime.setDate(autoDeleteTime.getDate() + 30);
    setLoading(true);
    try {
      await updateDoc(doc(db, "QA", qaID), {
        lastUpdaterId: "update001",
        // qaUpdateTime: serverTimestamp(),
        qaDeleteTime: serverTimestamp(),
        status: pathname == "recentDel" ? "totalDel" : "recentDel",
        autoDeleteTime,
      });
      successs("刪除成功");
      setUpdated((currentValue) => currentValue + 1);
    } catch (error) {
      console.error(error);
      fail("發生錯誤");
      setLoading(false);
    }
  };

  const recoverQA = async (qaID: string) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "QA", qaID), {
        lastUpdaterId: "update001",
        qaUpdateTime: serverTimestamp(),
        status: pathname == "noAssign" ? "noAssign" : "pending",
        autoDeleteTime: false,
      });
      successs("已復原");
      setUpdated((currentValue) => currentValue + 1);
    } catch (error) {
      console.error(error);
      fail("發生錯誤");
      setLoading(false);
    }
  };

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
    loading,
    recoverQA,
  ] as const;
}