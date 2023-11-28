"use client";
import { useState, useEffect } from "react";
// import { columns } from "./colums";
import useQA from "../../_hooks/useMessage";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { QA } from "@/app/_settings/interface";
import DialogModel from "../Dialog/dialog";
import Table from "./table";

export default function QaManage({ props }: any) {
  const [
    rows, //QaListFilter
    createQA,
    deleteQA,
    updateQA,
    select,
    setSelect,
    search,
    setSearch,
    officeList,
  ] = useQA();

  const [editSelected, setEditSelected] = useState<QA>();
  const [open, setOpen] = useState(false);

  const editPop = (selectedRow: QA) => {
    setEditSelected(selectedRow);
    setOpen(true);
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "選項",
      // width: 200,
      flex: 1.65,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <div>
            <IconButton aria-label="edit" onClick={() => editPop(params.row)}>
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => deleteQA(params.row.qaId)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const dialogProps = {
    open,
    setOpen,
    editSelected,
    setEditSelected,
    label: "指派系所",
    options: officeList,
    select,
    setSelect,
    updateQA,
    title: props.title,
  };
  const tablePorps = {
    rows,
    select,
    setSelect,
    search,
    setSearch,
    columns: props.columns,
    actionColumn,
  };
  return (
    <>
      <Table props={tablePorps} />
      <DialogModel props={dialogProps} />
    </>
  );
}
