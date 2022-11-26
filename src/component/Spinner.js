import { ImSpinner9 } from "react-icons/im";

const Spinner = ({ spinner, classes }) => {
  if (!spinner) return <></>;

  return <ImSpinner9 className={"animate-spin " + classes} />;
};

export default Spinner;
