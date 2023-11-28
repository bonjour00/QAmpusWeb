import Box from "@mui/material/Box";
import CustomSearch from "../Search/search";
import SelectOption from "../Select/select";

export default function ToolBar(props: any) {
  return (
    <Box
      sx={{
        mt: 1,
      }}
      display="flex"
      justifyContent="flex-end"
    >
      <CustomSearch setSearch={props.setSearch} search={props.search} />
      <SelectOption props={props.propsOrder} />
    </Box>
  );
}
