import { Fragment } from "react";

const EditModal = ({
  editid,
  setEditid,
  editContent,
  setEditContent,
  editTask,
}) => {
  if (editid === "") return <></>;

  return (
    <Fragment>
      <div
        className="justify-center items-center flex backdrop-blur-[2px] fixed inset-0 z-50 outline-none focus:outline-none overflow-auto"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        onClick={() => setEditid("")}
      >
        <div
          className="my-6 mx-auto sm:w-[66%] w-[95%] modalOpen border border-solid rounded-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex  flex-col backdrop-blur-3xl outline-none focus:outline-none ">
            {/*header*/}
            <div className="flex justify-center p-5 border-b border-solid  rounded-t">
              <h3 className="text-3xl font-semibold">Edit</h3>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <div className=" backdrop-blur-2xl p-2 shadow-lg ">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setEditid("");
                    editTask();
                  }}
                >
                  <input
                    type="text"
                    placeholder="Add your new todo"
                    className="rounded-md w-full text-center bg-transparent py-4 border border-solid"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  ></input>
                </form>
              </div>
            </div>
            {/*footer*/}
            <div className="flex flex-row flex-wrap justify-between p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="bg-red-500 text-white hover:bg-red-800 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mx-4 mb-1 flex-1"
                type="button"
                onClick={() => setEditid("")}
              >
                Close
              </button>
              <button
                className="bg-blue-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mx-4 mb-1 flex-1"
                type="button"
                onClick={() => {
                  setEditid("");
                  editTask();
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </Fragment>
  );
};

export default EditModal;
