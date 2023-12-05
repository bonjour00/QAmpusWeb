import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DeleteBtn(props: any) {
  const handleDelete = () => {
    props.deleteQA(props.params.row.qaId);
  };
  return (
    <IconButton aria-label="delete" onClick={handleDelete}>
      <DeleteIcon />
    </IconButton>
  );
}
