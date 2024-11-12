import clsx from "clsx";
import moment from "moment";
import React from "react";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import { LuClipboardEdit } from "react-icons/lu";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { Chart } from "../components/Chart";
import Loading from "../components/Loader";
import UserInfo from "../components/UserInfo";
import { useGetDashboardStatsQuery } from "../redux/slices/api/taskApiSlice";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";

const TaskTable = ({ tasks }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-200 bg-gray-100'>
      <tr className='text-black text-left'>
        <th className='py-3 px-4'>Task Title</th>
        <th className='py-3 px-4'>Priority</th>
        <th className='py-3 px-4'>Team</th>
        <th className='py-3 px-4 hidden md:block'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className='border-b border-gray-200 hover:bg-gray-50'>
      <td className='py-3 px-4'>
        <div className='flex items-center gap-3'>
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />
          <p className='text-base text-gray-700'>{task.title}</p>
        </div>
      </td>

      <td className='py-3 px-4'>
        <div className='flex items-center gap-2'>
          <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className='capitalize text-gray-700'>{task.priority}</span>
        </div>
      </td>

      <td className='py-3 px-4'>
        <div className='flex'>
          {task.team.map((m, index) => (
            <div
              key={index}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index % BGS.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>
      <td className='py-3 px-4 hidden md:block'>
        <span className='text-sm text-gray-500'>
          {moment(task?.date).fromNow()}
        </span>
      </td>
    </tr>
  );
  return (
    <div className='w-full md:w-2/3 bg-white shadow-md rounded-lg'>
      <table className='w-full'>
        <TableHeader />
        <tbody>
          {tasks?.map((task, id) => (
            <TableRow key={id} task={task} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UserTable = ({ users }) => {
  const TableHeader = () => (
    <thead className='border-b border-gray-200 bg-gray-100'>
      <tr className='text-black text-left'>
        <th className='py-3 px-4'>Full Name</th>
        <th className='py-3 px-4'>Status</th>
        <th className='py-3 px-4'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className='border-b border-gray-200 hover:bg-gray-50'>
      <td className='py-3 px-4'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-500'>
            <span>{getInitials(user?.name)}</span>
          </div>
          <div>
            <p className='text-base text-gray-700'>{user.name}</p>
            <span className='text-sm text-gray-500'>{user?.role}</span>
          </div>
        </div>
      </td>

      <td className='py-3 px-4'>
        <p
          className={clsx(
            "w-fit px-3 py-1 rounded-full text-sm",
            user?.isActive ? "bg-blue-100 text-blue-600" : "bg-yellow-100 text-yellow-600"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </p>
      </td>
      <td className='py-3 px-4'>
        <span className='text-sm text-gray-500'>
          {moment(user?.createdAt).fromNow()}
        </span>
      </td>
    </tr>
  );

  return (
    <div className='w-full md:w-1/3 bg-white shadow-md rounded-lg'>
      <table className='w-full'>
        <TableHeader />
        <tbody>
          {users?.map((user, index) => (
            <TableRow key={index + user?._id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const {data ,isLoading } = useGetDashboardStatsQuery();
  if (isLoading)
    return(
    <div className="py-10">
      <Loading/>
    </div>
  );
  const totals = data?.tasks || {};

  const stats = [
    {
      _id: "1",
      label: "TOTAL TASK",
      total: data?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-blue-500",
    },
    {
      _id: "2",
      label: "COMPLETED TASK",
      total: totals["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-green-500",
    },
    {
      _id: "3",
      label: "TASK IN PROGRESS",
      total: totals["in progress"] || 0,
      icon: <LuClipboardEdit />,
      bg: "bg-yellow-500",
    },
    {
      _id: "4",
      label: "TODOS",
      total: totals["todo"],
      icon: <FaArrowsToDot />,
      bg: "bg-pink-600",
    },
  ];

  const Card = ({ label, count, bg, icon }) => (
    <div className='w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between'>
      <div className='h-full flex flex-col justify-between'>
        <p className='text-sm text-gray-500'>{label}</p>
        <span className='text-2xl font-semibold text-gray-800'>{count}</span>
        <span className='text-sm text-gray-400'>{"110 last month"}</span>
      </div>
      <div
        className={clsx(
          "w-12 h-12 rounded-full flex items-center justify-center text-white",
          bg
        )}
      >
        {icon}
      </div>
    </div>
  );

  return (
    <div className='h-full py-8 px-4 bg-gray-50'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>

      <div className='w-full bg-white my-10 p-6 rounded shadow-sm'>
        <h4 className='text-lg text-gray-700 font-semibold mb-4'>Chart by Priority</h4>
        <Chart data={data?.graphData} />
      </div>

      <div className='flex flex-col md:flex-row gap-6 py-8'>
        <TaskTable tasks={data?.last10Task} />
        <UserTable users={data?.users} />
      </div>
    </div>
  );
};

export default Dashboard;