// import React from "react";
// import TaskCard from "./TaskCard";

// const BoardView = ({ tasks }) => {
//   return (
//     <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10'>
//       {tasks.map((task, index) => (
//         <TaskCard task={task} key={index} />
//       ))}
//     </div>
//   );
// };

// export default BoardView;
import React from "react";
import TaskCard from "./TaskCard";

const BoardView = ({ tasks }) => {
  return (
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10'>
      {Array.isArray(tasks) ? (
        tasks.map((task, index) => (
          <TaskCard task={task} key={index} />
        ))
      ) : (
        <p>No tasks available</p> // This handles cases where tasks is not an array or is undefined
      )}
    </div>
  );
};

export default BoardView;
