import moment from "moment";
export const columns = [
  {
    field: "question",
    headerName: "問題",
    // width: 800,
    flex: 4,
  },
  {
    field: "stuNum",
    headerName: "發問者學號",
    //  width: 350,
    flex: 1.5,
  },
  {
    field: "qaAskTime",
    headerName: "發問時間",
    // width: 400,
    flex: 2,
    renderCell: (params: any) => {
      return <div>{moment(params.row.qaAskTime.toDate()).format("LLL")}</div>;
    },
  },
];
