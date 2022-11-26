// layout for message shown
import { AiOutlineClose } from "react-icons/ai";
import Spinner from "./Spinner";

const Message = ({ msg, setMsg, spinner }) => {
  if (!msg) return <></>;

  return (
    <div className="flex flex-row flex-wrap justify-center mt-4 p-3 overflow-auto backdrop-blur-2xl rounded-md shadow-md mx-auto break-all max-h-[33%] sm:w-[66%] w-[95%]">
      <Spinner spinner={spinner} />
      <div className="flex-auto pl-2">{msg}</div>
      <button onClick={() => setMsg("")}>
        <AiOutlineClose className="ml-2 flex-auto text-2xl" />
      </button>
    </div>
  );
};

export default Message;
