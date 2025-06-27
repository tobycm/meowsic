import { Box, type BoxProps } from "@mui/material";

export default function Flex(props: BoxProps) {
  return (
    <Box
      {...props}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...props.sx,
      }}>
      {props.children}
    </Box>
  );
}
