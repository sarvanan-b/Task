import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import Button from './Button';
import Loading from './Loader';
import ModalWrapper from './ModalWrapper';
import Textbox from './Textbox';
import { toast } from 'sonner';
import { useChangePasswordMutation } from '../redux/slices/api/userApiSlice';


const ChangePassword = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleOnSubmit = async (data) => {
    // Validate passwords match
    if (data.password !== data.cpass) {
      toast.warning("New passwords don't match");
      return;
    }

    // Validate new password is different from old password
    if (data.oldPassword === data.password) {
      toast.warning("New password must be different from current password");
      return;
    }

    try {
      const res = await changePassword(data).unwrap();
      toast.success("Password changed successfully");

      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (error) {
      console.log(error);
      
      if (error?.status === 400 && error?.data?.message?.includes("Current password is incorrect")) {
        toast.error("Current password is incorrect. Please try again.");
      } else if (error?.status === 400 && error?.data?.message?.includes("New password must be different")) {
        toast.error("New password must be different from current password.");
      } else if (error?.status === 400 && error?.data?.message?.includes("required")) {
        toast.error("Please fill in all required fields.");
      } else {
        toast.error(error?.data?.message || "Failed to change password. Please try again.");
      }
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="">
        <Dialog.Title as="h2" className="text-base font-bold leading-6 text-gray-900 mb-4">
          Change Password
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Current Password"
            type="password"
            name="oldPassword"
            label="Current Password"
            className="w-full rounded"
            register={register('oldPassword', {
              required: 'Current password is required!',
            })}
            error={errors.oldPassword ? errors.oldPassword.message : ''}
          />

          <Textbox
            placeholder="New Password"
            type="password"
            name="password"
            label="New Password"
            className="w-full rounded"
            register={register('password', {
              required: 'New Password is required!',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            error={errors.password ? errors.password.message : ''}
          />

          <Textbox
            placeholder="Confirm New Password"
            type="password"
            name="cpass"
            label="Confirm New Password"
            className="w-full rounded"
            register={register('cpass', {
              required: 'Confirm New Password is required!',
            })}
            error={errors.cpass ? errors.cpass.message : ''}
          />
        </div>

        {isLoading ? (
          <div className="py-5">
            <Loading />
          </div>
        ) : (
          <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
            <Button
              type="submit"
              className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue"
              label="Save"
            />

            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default ChangePassword;
