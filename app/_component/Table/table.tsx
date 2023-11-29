"use client";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import PaginationControlled from "./pagination";
import ToolBar from "./toolBar";

export default function Table({ props }: any) {
  const PAGE_SIZE = 3;
  const [paginationModel, setPaginationModel] = useState({
    pageSize: PAGE_SIZE,
    page: 0,
  });

  const propsOrder = {
    label: "順序",
    options: [
      { value: "desc", name: "最新" },
      { value: "asc", name: "最舊" },
    ],
    current: "desc",
    select: props.select,
    setSelect: props.setSelect,
  };

  return (
    <DataGrid
      autoHeight
      rows={props.rows}
      columns={props.columns.concat(props.actionColumn)}
      disableColumnMenu
      disableRowSelectionOnClick
      slots={{
        toolbar: ToolBar,
        pagination: PaginationControlled,
      }}
      slotProps={{
        toolbar: {
          search: props.search,
          setSearch: props.setSearch,
          propsOrder,
        },
      }}
      pageSizeOptions={[PAGE_SIZE]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      // loading={true}
    />
  );
}