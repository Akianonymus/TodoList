import axios from "axios";
import { useMemo, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineFileAdd,
} from "react-icons/ai";
import { Navigate } from "react-router-dom";

import EditModal from "./component/EditModal";
import Message from "./component/Message";
import Spinner from "./component/Spinner";
import { API_URL } from "./utils";

const signIn = (
  <Navigate
    to="/signin"
    replace={true}
    state={{ message: "You need to Login First" }}
  />
);

const sortDataByDate = (data, sortingOrder) => {
  // Convert the Map to an array of entries
  const dataArray = Array.from(data.entries());

  // Sort the array based on the date values and sorting order
  dataArray.sort((a, b) => {
    const dateA = new Date(a[1].date);
    const dateB = new Date(b[1].date);

    if (sortingOrder === "asc") {
      return dateA - dateB;
    } else if (sortingOrder === "dsc") {
      return dateB - dateA;
    }

    // Default to no sorting
    return 0;
  });

  // Convert the sorted array back to a Map
  return new Map(dataArray);
};

const filterInData = (data, contentFilter, statusFilter) => {
  if (contentFilter === "" && statusFilter === "") return data;

  contentFilter = contentFilter?.toLowerCase();
  statusFilter = statusFilter?.toLowerCase();

  // Convert the Map to an array of entries
  const dataArray = Array.from(data.entries());

  return new Map(
    dataArray.filter((value) => {
      const contentMatches =
        contentFilter === "" ||
        value[1]?.content?.toLowerCase()?.includes(contentFilter);
      const statusMatches =
        statusFilter === "" || value[1]?.status?.toLowerCase() === statusFilter;
      return contentMatches && statusMatches;
    }),
  );
};

const Tp = ({ currentTarget, id }) => {
  if (currentTarget?.id !== id) return;
  return (
    <div className="flex flex-row -mt-[1%] text-sm">
      <div className="mr-2">{currentTarget?.text}</div>
      <Spinner spinner={true} />
    </div>
  );
};

const Todo = async (todo, success, error, cleanup, method = "post") => {
  const url = `${API_URL}/todo/`;

  const config = {
    method: method,
    url: url,
    headers: { access_token: todo.token },
  };

  switch (todo.name) {
    case "new":
      config.url += "create";
      config.data = { content: todo.content };
      break;
    case "edit":
      config.url += "update";
      config.data = { content: todo.content, todoId: todo.id };
      break;
    case "updateStatus":
      config.url += "update";
      config.data = { todoId: todo.id, status: todo.status };
      break;
    case "delete":
      config.method = "delete";
      config.url += "delete";
      config.data = { todoId: todo.id };
      break;
    case "deleteall":
      config.method = "delete";
      config.url += "deleteAll";
      break;
    default:
      break;
  }

  await axios(config)
    .then((result) => {
      success(result);
    })
    .catch((err) => {
      error(err);
    });
  cleanup();
};

const Todos = ({ loggedIn }) => {
  const [data, setData] = useState(new Map());
  const [newdata, setNewdata] = useState(new Map());
  const [contentFilter, setContentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [newTodo, setNewTodo] = useState("");

  const [currentTarget, setCurrentTarget] = useState([]);

  const [editid, setEditid] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editContentOld, setEditContentOld] = useState("");

  const [deleteall, setDeleteAll] = useState("");

  const [msg, setMsg] = useState("");
  const [spinner, setSpinner] = useState(false);

  const todo = [];
  todo.New = () => {
    if (newTodo === "") return;
    setCurrentTarget({ text: "New" });

    Todo(
      { name: "new", token: loggedIn.token, content: newTodo },
      (result) => {
        const id = result?.data?.data?.todo?._id;
        const content = result?.data?.data?.todo?.content;
        const date = result?.data?.data?.todo?.updatedAt;
        const status = result?.data?.data?.todo?.status;
        const dat = new Map([...newdata]).set(id, {
          content,
          date,
          status,
        });
        setNewdata(dat);
      },
      (error) => {
        console.log("Bad bad");
        // loggedIn.setToken("");
        console.log(error.response);
        return signIn;
      },
      () => setCurrentTarget([]),
    );
  };

  todo.Edit = () => {
    if (editContent === editContentOld || editContent === "") return;
    setCurrentTarget({ id: editid, text: "Editing" });
    Todo(
      { name: "edit", token: loggedIn.token, content: editContent, id: editid },
      (result) => {
        const id = editid;
        if (data.has(id)) {
          const dat = new Map(data);
          dat.set(id, {
            date: dat.get(id).date,
            content: editContent,
          });
          setData(dat);
        }
        if (newdata.has(id)) {
          const dat = new Map(newdata);
          dat.set(id, {
            date: dat.get(id).date,
            content: editContent,
          });
          setNewdata(dat);
        }
      },
      (error) => {
        // loggedIn.setToken("");
        console.log(error);
      },
      () => {
        setCurrentTarget([]);
        setEditid("");
      },
    );
  };

  todo.UpdateStatus = (todoId, status) => {
    setCurrentTarget({ text: "Updating Status" });
    Todo(
      {
        name: "updateStatus",
        token: loggedIn.token,
        status: status,
        id: todoId,
      },
      (result) => {
        if (data.has(todoId)) {
          const dat = new Map(data);
          dat.set(todoId, {
            date: dat.get(todoId).date,
            content: dat.get(todoId).content,
            status: status,
          });
          setData(dat);
        }
        if (newdata.has(todoId)) {
          const dat = new Map(newdata);
          dat.set(todoId, {
            date: dat.get(todoId).date,
            content: dat.get(todoId).content,
            status: status,
          });
          setNewdata(dat);
        }
      },
      (error) => {
        // loggedIn.setToken("");
        console.log(error);
      },
      () => {
        setCurrentTarget([]);
      },
    );
  };

  todo.Delete = (id) => {
    setCurrentTarget({ id: id, text: "Deleting" });
    Todo(
      { name: "delete", token: loggedIn.token, id: id },
      (_) => {
        {
          const dat = new Map(data);
          dat.delete(id);
          setData(dat);
        }
        {
          const dat = new Map(newdata);
          dat.delete(id);
          setNewdata(dat);
        }
      },
      (error) => {
        console.log("Bad bad");
        // loggedIn.setToken("");
        console.log(error.response);
      },
      () => setCurrentTarget([]),
    );
  };

  todo.DeleteAll = () => {
    setDeleteAll(true);
    Todo(
      { name: "deleteall", token: loggedIn.token },
      (_) => {
        setData(new Map());
        setNewdata(new Map());
      },
      (error) => {
        console.log("Bad bad");
        // loggedIn.setToken("");
        console.log(error.response);
      },
      () => setDeleteAll(false),
      "post",
    );
  };

  const buttonHandle = [];
  buttonHandle.New = async (e) => {
    e.preventDefault();
    todo.New();
  };
  buttonHandle.Edit = async (e) => {
    e.preventDefault();
    const id = e.currentTarget.parentNode.getAttribute("postid");
    setEditContent(data.get(id)?.content || newdata.get(id)?.content);
    setEditContentOld(editContent);
    setEditid(id);
  };
  buttonHandle.UpdateStatus = async (e, todoId) => {
    e.preventDefault();
    todo.UpdateStatus(todoId, e.target.value);
  };
  buttonHandle.Delete = async (e) => {
    e.preventDefault();
    const id = e.currentTarget.parentNode.getAttribute("postid");
    todo.Delete(id);
  };
  buttonHandle.DeleteAll = async (e) => {
    e.preventDefault();
    todo.DeleteAll();
  };

  const TodoLayout = ({ todos }) => {
    const a = [];
    todos?.forEach((value, key) => {
      const dateObj = new Date(value?.date);
      const date = `${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`;
      const renderStatusDropdown = (status, todoId) => {
        // Define base classes
        const baseClasses = "font-mono text-sm rounded-md px-2 py-1";

        let statusClasses = "";

        switch (status) {
          case "progress":
            statusClasses = "bg-blue-500 text-white";
            break;
          case "completed":
            statusClasses = "bg-green-500 text-white";
            break;
          case "hold":
            statusClasses = "bg-yellow-500 text-gray-900";
            break;
          default:
            break;
        }

        return (
          <select
            className={`${baseClasses} ${statusClasses}`}
            value={status}
            onChange={(e) => buttonHandle.UpdateStatus(e, todoId)}
          >
            <option value="progress">IN PROGRESS</option>
            <option value="completed">COMPLETED</option>
            <option value="hold">ON HOLD</option>
          </select>
        );
      };

      a.push(
        <div
          key={key}
          className="bg-gray-200 dark:bg-gray-800 mb-3 sm:w-[66%] lg:w-[40%] xl:w-[30%] w-[90%] text-center rounded-md shadow-md mx-2 flex flex-col"
        >
          <div
            className="py-3 px-3 flex flex-row justify-between items-start "
            postid={key}
          >
            <button
              title="Edit Todo"
              aria-label="Edit Todo"
              type="button"
              className="text-xl hover:text-blue-400 hover:scale-[115%]"
              onClick={buttonHandle.Edit}
            >
              <AiOutlineEdit />
            </button>
            <Tp currentTarget={currentTarget} id={key} />
            {renderStatusDropdown(value?.status, key)}
            <button
              title="Delete Todo"
              aria-label="Delete Todo"
              type="button"
              className="text-xl hover:text-blue-400 hover:scale-[115%]"
              onClick={buttonHandle.Delete}
            >
              <AiOutlineDelete />
            </button>
          </div>
          <div className="mx-5 overflow-auto max-h-[33vh] grow">
            <p className="text-base mb-5 break-all whitespace-pre-line">
              {value?.content?.replace("<br/>", "\n")}
            </p>
          </div>
          <div className="py-2 border-t border-gray-300 dark:border-gray-600 text-sm">
            Updated on {date}
          </div>
        </div>,
      );
    });
    return a.reverse();
  };

  useMemo(() => {
    async function fetchTodos() {
      if (loggedIn?.token === "") return;

      const configuration = {
        method: "get",
        url: `${API_URL}/todo`,
        headers: { access_token: loggedIn.token },
      };

      setMsg("Fetching todos from server");
      setSpinner(true);

      let done = false;
      let tmpmsg = "";
      await axios(configuration)
        .then((result) => {
          done = true;
          let dat = new Map();
          // modify the result array to a Map for easy insertion, deletion
          // reverse so new items are shown first
          result.data?.data?.todos?.forEach((todo) => {
            const [id, content, date, status] = [
              todo._id,
              todo.content,
              todo.updatedAt,
              todo.status,
            ];
            dat.set(id, {
              content,
              date,
              status,
            });
          });

          setData(dat);
        })
        .catch((error) => {
          console.log("Error: Cannot fetch todos " + error.message);
          // loggedIn.setToken("");
          tmpmsg = error.toJSON().message;
          return;
        });

      done ? setMsg("") : setMsg("Couldn't fetch todos. " + tmpmsg);
      setSpinner(false);
    }

    fetchTodos();
  }, [loggedIn?.token]);

  if (loggedIn?.token === "") return signIn;

  let timer = null;
  return (
    <>
      <div className="flex flex-wrap justify-center items-center flex-col gap-4">
        <div
          className={
            "flex flex-col items-stretch bg-gray-200 dark:bg-gray-800  sm:w-[66%] lg:w-[40%] w-[90%] p-1 rounded-md shadow-md mt-10 gap-4"
          }
        >
          <div className="flex gap-4">
            <textarea
              type="text"
              placeholder="Add your new todo"
              rows={2}
              className="bg-gray-200 dark:bg-gray-900 border border-solid border-gray-500 dark:border-gray-200 w-full rounded-sm pr-2 pt-2 text-center px-2 resize-y min-h-[8vh] max-h-[33vh]"
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button
              title="Add new Todo"
              aria-label="Add Todo"
              className="bg-gray-200 dark:bg-gray-900 border border-solid border-gray-500 dark:border-gray-200 rounded-sm mr-auto ml-1.5 px-2 hover:text-blue-400 text-4xl"
              type="submit"
              onClick={buttonHandle.New}
            >
              <AiOutlineFileAdd />
            </button>
          </div>
          <div className="flex justify-between items-stretch gap-4">
            <input
              className="bg-gray-200 dark:bg-gray-900 border border-solid border-gray-500 dark:border-gray-200 w-full rounded-sm pr-2 py-2 text-center px-2 "
              placeholder="Search..."
              onChange={(event) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                  setContentFilter(event.target.value);
                }, 500);
              }}
            />

            <div className="bg-gray-200 dark:bg-gray-900 border border-solid border-gray-500 dark:border-gray-200 w-full rounded-sm pr-2 py-2 text-center px-2">
              <select
                className="w-full dark:bg-gray-900"
                onChange={(e) => {
                  switch (e.target.value) {
                    case "asc":
                    case "dsc":
                      const ndata = sortDataByDate(
                        new Map([...data, ...newdata]),
                        e.target.value,
                      );
                      setData(ndata);
                      setNewdata(new Map());
                      break;
                    case "completed":
                    case "progress":
                    case "hold":
                      setStatusFilter(e.target.value);
                      break;
                    default:
                      setContentFilter("");
                      setStatusFilter("");
                  }
                }}
              >
                <option value="">Sort</option>
                <option value="asc">Date (Newer)</option>
                <option value="dsc">Date (Older)</option>
                <option value="completed">Status (completed)</option>
                <option value="progress">Status (progress)</option>
                <option value="hold">Status (hold)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <Message msg={msg} setMsg={setMsg} spinner={spinner}></Message>

      <EditModal
        editid={editid}
        setEditid={setEditid}
        editContent={editContent}
        setEditContent={setEditContent}
        editTodo={todo.Edit}
      />

      <div className="mt-4 flex flex-wrap justify-center ">
        <TodoLayout
          todos={filterInData(newdata, contentFilter, statusFilter)}
        />
        <TodoLayout todos={filterInData(data, contentFilter, statusFilter)} />
      </div>

      {data?.size !== 0 || newdata?.size !== 0 ? (
        <div className="sticky bottom-0 w-full backdrop-blur-[3px]">
          <div className="flex flex-row justify-center items-center ">
            <button
              className="flex flex-row justify-between bg-red-500 hover:bg-red-600 text-white my-2 p-3 rounded-md shadow-md tracking-widest"
              onClick={buttonHandle.DeleteAll}
            >
              <Spinner spinner={deleteall} classes="mr-5" />
              Delete All
              <Spinner spinner={deleteall} classes="ml-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="sticky bottom-0 text-center">
          <div className="flex flex-row justify-center items-center ">
            <div className="bg-gray-200 dark:bg-gray-800  sm:w-[66%] lg:w-[40%] w-[90%] p-5 px-10 rounded-md shadow-lg tracking-widest">
              No Todos
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Todos;
