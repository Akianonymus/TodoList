// layout for message shown
import { AiOutlineClose } from "react-icons/ai";

const Message = ({ msg, setMsg }) => {
  if (!msg) return <></>;

  return (
    <div className="flex justify-center place-items-center mt-4 p-4 overflow-scroll backdrop-blur-lg rounded-md shadow-md max-w-lg mx-auto break-all max-h-[33%]">
      <div className="flex-auto">{msg}</div>
      <button onClick={() => setMsg("")}>
        <AiOutlineClose className="ml-2 flex-auto text-2xl" />
      </button>
    </div>
  );
};

export default Message;
