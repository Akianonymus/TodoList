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
        className="justify-center items-center flex backdrop-blur-[2px] absolute inset-0 z-50 outline-none focus:outline-none overflow-auto"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        onClick={() => setEditid("")}
      >
        <div
          className="bg-gray-200 dark:bg-gray-900 my-6 mx-auto sm:w-[66%] lg:w-[40%] w-[90%] modalOpen rounded-lg shadow-md border border-gray-500 dark:border-gray-600"
          onClick={(e) => e.stopPropagation()}
        >
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col outline-none focus:outline-none ">
            {/*header*/}
            <div className="flex justify-center p-5 border-b border-solid  dark:border-gray-600 border-gray-500 rounded-t">
              <h3 className="text-3xl font-semibold">Edit</h3>
            </div>
            {/*body*/}
            <div className="relative p-6  flex-auto">
              <div className="p-2 rounded-md ">
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
                    className="rounded-md w-full text-center bg-gray-300 dark:bg-gray-800 py-4 border dark:border-gray-200 border-gray-500 "
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  ></input>
                </form>
              </div>
            </div>
            {/*footer*/}
            <div className="text-white flex flex-row flex-wrap justify-between p-6 border-t border-solid dark:border-gray-600 border-gray-500 rounded-b">
              <button
                className="bg-red-500  hover:bg-red-800 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mx-4 mb-1 flex-1"
                type="button"
                onClick={() => setEditid("")}
              >
                Close
              </button>
              <button
                className="bg-blue-500  hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mx-4 mb-1 flex-1"
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
    </Fragment>
  );
};

export default EditModal;
