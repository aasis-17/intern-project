import { useState } from "react";
import Button from '../../../components/Button.jsx';
import UserForm from './component/UserForm.jsx';
import { useUser } from './hook/useUser.js';

const User = ({option}) => {

  const [isEditable, setIsEditable] =useState(() => option !== "edit")

  const isEditForm = option === "edit"

  const {mutation, userData} = useUser({option, setIsEditable})
 
  return (
    <div className='h-screen bg-white p-6 rounded-lg shadow-md'>
      <div className=" h-full relative flex flex-col justify-evenly ml-4">
        <div className='flex justify-between'>
          <h1 className='text-3xl font-garamond font-medium'>{isEditForm ? "Basic Details" : "Your Details"}</h1>
            
          {isEditForm && (
            <Button
            children={!isEditable ? "Cancel" : "Edit"}
            onClick={()=> setIsEditable(prev => !prev)}
            size='sm'
            className={` w-16 ${isEditable ? "bg-red-400 hover:bg-red-500" : ""} `}
            variant='outline'
            />
            )}

        </div>

      <UserForm 
        isEditable={isEditable}
        isEditForm={isEditForm}
        userDetails={userData}
        mutation={mutation}
        />

    </div>
    </div>
  )
}

export default User