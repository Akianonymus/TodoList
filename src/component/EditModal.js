import { Fragment } from "react";

const EditModal = ({
  edit,
  setEdit,
  editContent,
  setEditContent,
  editTask,
}) => {
  if (!edit) return <></>;

  return (
    <Fragment>
      <div
        className="justify-center items-center flex backdrop-blur-[2px] fixed inset-0 z-50 outline-none focus:outline-none "
        style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
        onClick={() => setEdit(false)}
      >
        <div
          className="my-6 mx-auto w-full max-w-lg modalOpen"
          onClick={(e) => e.stopPropagation()}
        >
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col backdrop-blur-3xl outline-none focus:outline-none ">
            {/*header*/}
            <div className="flex justify-center p-5 border-b border-solid  rounded-t">
              <h3 className="text-3xl font-semibold text-center justify-center">
                Edit
              </h3>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <div className="flex justify-center">
                <div className="backdrop-blur-lg p-2 rounded-lg shadow-lg ">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setEdit(false);
                      editTask();
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Add your new todo"
                      className=" rounded-sm text-center bg-transparent pt-4 pb-4 pr-2  border border-solid active:border-solid"
                      autoFocus={true}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    ></input>
                  </form>
                </div>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="bg-red-500 text-white hover:bg-red-800 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full "
                type="button"
                onClick={() => setEdit(false)}
              >
                Close
              </button>
              <button
                className="bg-blue-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                type="button"
                onClick={() => {
                  setEdit(false);
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
