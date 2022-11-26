import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { AiFillDelete, AiFillFileAdd } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Navigate } from "react-router-dom";

import EditModal from "./component/EditModal";
import Message from "./component/Message";
import Spinner from "./component/Spinner";
import API_URL from "./utils";

const signIn = (
  <Navigate
    to="/signin"
    replace={true}
    state={{ message: "You need to Login First" }}
  />
);

const Tp = ({ currentTarget, id }) => {
  if (currentTarget?.id !== id) return;
  return (
    <div className="flex flex-row -mt-[1%]">
      <div className="mr-2">{currentTarget?.text}</div>
      <Spinner spinner={true} classes="mt-1" />
    </div>
  );
};

const Task = async (task, success, error, cleanup) => {
  const url = `${API_URL}/`;

  const config = {
    method: "post",
    url: url,
    headers: {
      Authorization: `Bearer ${task.token}`,
    },
  };

  switch (task.name) {
    case "new":
      config.url += "new/";
      config.data = { content: task.content };
      break;
    case "edit":
      config.url += "edit/" + task.id;
      config.data = { content: task.content };
      break;
    case "delete":
      config.url += "delete/" + task.id;
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

  const [newtask, setNewTask] = useState("");

  const [currentTarget, setCurrentTarget] = useState([]);

  const [editid, setEditid] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editContentOld, setEditContentOld] = useState("");

  const [msg, setMsg] = useState("");
  const [spinner, setSpinner] = useState(false);

  const task = [];
  task.New = () => {
    if (newtask === "") return;
    setCurrentTarget({ text: "New" });

    Task(
      { name: "new", token: loggedIn.token, content: newtask },
      (result) => {
        const id = result?.data?.result?._id;
        const content = result?.data?.result?.content;
        const date = result?.data?.result?.date;
        const dat = new Map([...newdata]).set(id, {
          content,
          date,
        });
        setNewdata(dat);
      },
      (error) => {
        console.log("Bad bad");
        // loggedIn.setToken("");
        console.log(error.response);
        return signIn;
      },
      () => setCurrentTarget([])
    );
  };

  task.Edit = () => {
    if (editContent === editContentOld || editContent === "") return;
    setCurrentTarget({ id: editid, text: "Editing" });
    Task(
      { name: "edit", token: loggedIn.token, content: editContent, id: editid },
      (result) => {
        console.log(result.data);
        const id = result?.data?.id;
        const content = result?.data?.content;
        if (data.has(id)) {
          const dat = new Map(data);
          dat.set(id, {
            date: dat.get(id).date,
            content: content,
          });
          setData(dat);
        }
        if (newdata.has(id)) {
          const dat = new Map(newdata);
          dat.set(id, {
            date: dat.get(id).date,
            content: content,
          });
          setNewdata(dat);
        }
      },
      (error) => {
        console.log("Bad bad");
        // loggedIn.setToken("");
        console.log(error);
      },
      () => {
        setCurrentTarget([]);
        setEditid("");
      }
    );
  };

  task.Delete = (id) => {
    setCurrentTarget({ id: id, text: "Deleting" });
    Task(
      { name: "delete", token: loggedIn.token, id: id },
      (result) => {
        console.log(result.data);
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
      () => setCurrentTarget([])
    );
  };

  const buttonHandle = [];
  buttonHandle.New = async (e) => {
    e.preventDefault();
    task.New();
  };
  buttonHandle.Edit = async (e) => {
    e.preventDefault();
    const id = e.currentTarget.parentNode.getAttribute("postid");
    setEditContent(data.get(id)?.content || newdata.get(id)?.content);
    setEditContentOld(editContent);
    setEditid(id);
  };
  buttonHandle.Delete = async (e) => {
    e.preventDefault();
    const id = e.currentTarget.parentNode.getAttribute("postid");
    task.Delete(id);
  };

  const TodoLayout = ({ tasks }) => {
    return Array.from(Array.from(tasks).reverse(), ([key, value]) => {
      const dateObj = new Date(value?.date);
      const date = `${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`;
      return (
        <div
          key={key}
          className="backdrop-blur-2xl mb-3 sm:w-[66%] lg:w-[45%] xl:w-[30%] w-[95%] text-center rounded-lg shadow-xl mx-2 "
        >
          <div
            className="py-4 px-5 flex flex-row justify-between items-start "
            postid={key}
          >
            <button
              type="button"
              className="text-xl hover:text-blue-400 hover:scale-[110%]"
              onClick={buttonHandle.Edit}
            >
              <FaEdit />
            </button>
            <Tp currentTarget={currentTarget} id={key} />
            <button
              type="button"
              className="text-xl hover:text-blue-400 hover:scale-[110%]"
              onClick={buttonHandle.Delete}
            >
              <AiFillDelete />
            </button>
          </div>
          <div className="mx-5 overflow-auto max-h-[33vh]">
            <p className="text-base mb-5 break-all ">{value.content}</p>
          </div>
          <div className="py-2 border-t border-gray-600 text-sm">
            Added on {date}
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    async function fetchTasks() {
      if (loggedIn?.token === "") return;

      const configuration = {
        method: "get",
        url: `${API_URL}/tasks`,
        headers: { Authorization: `Bearer ${loggedIn.token}` },
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
          result.data?.tasks?.forEach((todo) => {
            const [id, content, date] = [todo._id, todo.content, todo.date];
            dat.set(id, {
              content,
              date,
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

    fetchTasks();
  }, [loggedIn]);

  if (loggedIn?.token === "") return signIn;

  const formClass = {
    parent: "flex flex-wrap justify-center text-center text-white",
    child: "sm:w-[66%] w-[95%] backdrop-blur-2xl p-2 rounded-lg shadow-lg",
  };
  return (
    <Fragment>
      <form>
        <div className={formClass.parent}>
          <div className={formClass.child + " mt-10"}>
            <input
              type="text"
              placeholder="Add your new todo"
              className="w-full rounded-sm text-center bg-transparent pt-4 pb-4 pr-2 border border-solid "
              onChange={(e) => setNewTask(e.target.value)}
            />
          </div>
        </div>
        <div className={formClass.parent}>
          <div className={formClass.child + " mt-1"}>
            <div className="flex items-start justify-center w-full">
              <Spinner
                spinner={currentTarget.text === "New"}
                classes="self-center mx-2"
              />
              <button
                className="text-white hover:text-blue-400 inline-flex justify-center w-full h-full text-4xl"
                type="submit"
                onClick={buttonHandle.New}
              >
                <AiFillFileAdd />
              </button>

              <Spinner
                spinner={currentTarget.text === "New"}
                classes="self-center mx-2"
              />
            </div>
          </div>
        </div>
      </form>

      <Message msg={msg} setMsg={setMsg} spinner={spinner}></Message>

      <EditModal
        editid={editid}
        setEditid={setEditid}
        editContent={editContent}
        setEditContent={setEditContent}
        editTask={task.Edit}
      />

      <div className="pt-4 flex flex-wrap justify-center  text-white ">
        <TodoLayout tasks={newdata} />
        <TodoLayout tasks={data} />
      </div>
    </Fragment>
  );
};

export default Todos;
