import { useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { getInitials } from "../utils";
import clsx from "clsx";
import ConfirmationDialog, { UserAction } from "../components/Dialogs";
import AddUser from "../components/AddUser";
import { useDeleteUserMutation, useGetTeamListQuery, useUserActionMutation } from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const {data,isLoading,error,refetch} = useGetTeamListQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  
  const userActionHandler = async() => {
    try {
      const result = await userAction({
        isActive: !selected?.isActive,
        id: selected?._id,
      });

      refetch();
      toast.success(result.data.message);
      setSelected(null);
      setTimeout(() => {
        setOpenAction(false);
      },500);

    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error || "Something went wrong");
      
    }
  };
  const deleteHandler = async () => {
    try {
      const result = await deleteUser(selected); // Use the deleteUser mutation
      refetch();
      toast.success(result?.data?.message || "User deleted successfully");
      setSelected(null);

      setTimeout(() => {
        setOpenDialog(false);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.message || "Failed to delete user");
    }
  };
  

  const deleteClick = (id) => {
    // Prevent admin from deleting their own profile
    if (id === user?._id) {
      toast.error("You cannot delete your own profile. Please ask another admin to delete your account.");
      return;
    }
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  const userStatusClick = (el) => {
    setSelected(el);
    setOpenAction(true);
  }
  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Title</th>
        <th className='py-2'>Email</th>
        <th className='py-2'>Role</th>
        {user?.isAdmin && <th className='py-2'>Active</th>}
        {user?.isAdmin && <th className='py-2'>Actions</th>}
      </tr>
    </thead>
  );

  /* eslint-disable react/prop-types */
  const TableRow = ({ user: teamMember }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='p-2'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700'>
            <span className='text-xs md:text-sm text-center'>
              {getInitials(teamMember.name)}
            </span>
          </div>
          {teamMember.name}
        </div>
      </td>

      <td className='p-2'>{teamMember.title}</td>
      <td className='p-2'>{teamMember.email || "user.email"}</td>
      <td className='p-2'>{teamMember.role}</td>

      {user?.isAdmin && (
        <td>
          <button
            onClick={() => userStatusClick(teamMember)}
            className={clsx(
              "w-fit px-4 py-1 rounded-full",
              teamMember?.isActive ? "bg-blue-200" : "bg-yellow-100"
            )}
          >
            {teamMember?.isActive ? "Active" : "Disabled"}
          </button>
        </td>
      )}

      {user?.isAdmin && (
        <td className='p-2 flex gap-4 justify-end'>
          <Button
            className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
            label='Edit'
            type='button'
            onClick={() => editClick(teamMember)}
          />

          {/* Prevent admin from deleting their own profile */}
          {teamMember?._id !== user?._id && (
            <Button
              className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
              label='Delete'
              type='button'
              onClick={() => deleteClick(teamMember?._id)}
            />
          )}
          
          {/* Show disabled delete button for self-deletion */}
          {teamMember?._id === user?._id && (
            <Button
              className='text-gray-400 font-semibold sm:px-0 cursor-not-allowed opacity-50'
              label='Delete'
              type='button'
              disabled={true}
            />
          )}
        </td>
      )}
    </tr>
  );
  /* eslint-enable react/prop-types */

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='  Team Members' />
          {user?.isAdmin && (
            <Button
              label='Add New User'
              icon={<IoMdAdd className='text-lg' />}
              className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5'
              onClick={() => setOpen(true)}
            />
          )}
        </div>

        <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded'>
          {isLoading ? (
            <div className='flex justify-center items-center py-8'>
              <div className='text-gray-500'>Loading team members...</div>
            </div>
          ) : error ? (
            <div className='flex justify-center items-center py-8'>
              <div className='text-red-500'>Error loading team members. Please try again.</div>
            </div>
          ) : data && data.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='w-full mb-5'>
                <TableHeader />
                <tbody>
                  {data.map((teamMember, index) => (
                    <TableRow key={index} user={teamMember} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='flex justify-center items-center py-8'>
              <div className='text-gray-500'>No team members found.</div>
            </div>
          )}
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </>
  );
};

export default Users;
