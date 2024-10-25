import { useMediaQuery } from "@mui/material";

const useScreenSize = () => {
  const matches = useMediaQuery("(min-width:810px)");
  return matches;
};

export default useScreenSize;
