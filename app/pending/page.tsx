"use client";
import QaManage from "../_component/Table/qaManage";
import { columns } from "../_component/Table/colums";

export default function Pending() {
  const props = {
    columns,
    title: "指派",
  };
  return <QaManage props={props} />;
}
