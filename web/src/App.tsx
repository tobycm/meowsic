import { Typography } from "@mui/material";
import Flex from "./components/Flex";

function App() {
  return (
    <Flex
      sx={{
        height: "100vh",
        padding: 2,
      }}
      bgcolor="background.default">
      <Typography variant="h4" color="primary">
        Welcome to meow music :3
      </Typography>
    </Flex>
  );
}

export default App;
