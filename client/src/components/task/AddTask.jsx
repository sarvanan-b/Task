import React, { useState } from "react";
import { useSelector } from "react-redux";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import Button from "../Button";
import { useCreateTaskMutation, useUpdateTaskMutation, useUpdateTaskForAdminMutation } from "../../redux/slices/api/taskApiSlice";
import { toast } from "sonner";
import { dateFormatter } from "../../utils";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "NONE"];

const AddTask = ({ open, setOpen, task }) => {
  const { user } = useSelector((state) => state.auth);
  
  const defaultValues = {
    title: task?.title || "",
    date: dateFormatter(task?.date || new Date()),
    team: [],
    stage: "",
    priority: "",
    description: task?.description || "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });
  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(task?.priority?.toUpperCase() || PRIORITY[3]);

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [updateTaskForAdmin, { isLoading: isUpdatingAdmin }] = useUpdateTaskForAdminMutation();

  const submitHandler = async (data) => {
    try {
      const newData = {
        ...data,
        team,
        stage,
        priority,
      };
      
      let res;
      if (task?._id) {
        // Update task - use admin mutation if user is admin
        res = user?.isAdmin 
          ? await updateTaskForAdmin({ ...newData, _id: task._id }).unwrap()
          : await updateTask({ ...newData, _id: task._id }).unwrap();
      } else {
        // Create task - only admins can create tasks
        res = await createTask(newData).unwrap();
      }

      toast.success(res.message);

      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>

          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Task Title'
              type='text'
              name='title'
              label='Task Title'
              className='w-full rounded'
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />

            <UserList setTeam={setTeam} team={team} />

            <div className='flex gap-4'>
              <SelectList
                label='Task Stage'
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <div className='w-full'>
                <Textbox
                  placeholder='Date'
                  type='date'
                  name='date'
                  label='Task Date'
                  className='w-full rounded'
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
            </div>

            <div className='flex gap-4'>
              <SelectList
                label='Priority Level'
                lists={PRIORITY}
                selected={priority}
                setSelected={setPriority}
              />

              <Textbox
                placeholder='Description'
                type='text'
                name='description'
                label='Task Description'
                className='w-full rounded'
                register={register("description", { required: "Description is required" })}
                error={errors.description ? errors.description.message : ""}
              />
            </div>

            <div className='bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4'>
              <Button
                label={isLoading || isUpdating || isUpdatingAdmin ? 'Processing...' : 'Submit'}
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto'
                disabled={isLoading || isUpdating || isUpdatingAdmin}
              />

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
