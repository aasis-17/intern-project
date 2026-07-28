import { useForm } from 'react-hook-form'
import FormField from '../../../../components/form/FormField'
import TextField from "../../../../components/form/TextField"
import Button from '../../../../components/Button'


const UserForm = ({mutation, userDetails, isEditable, isEditForm}) => {

	const {register, handleSubmit} = useForm()

  return (
    <form onSubmit={ handleSubmit(mutation.mutate) } >
        
        {/* Full Name */}
        <FormField 
            defaultValue={userDetails?.fullname}
            readOnly={!isEditable}
            label = "Fullname"
            required
						className={`${isEditForm ? "w-1/2" : "w-full"}`}
            placeholder = "Enter your name"
            {...register("fullname", {
                required : true,
            })
        }
            />

        {/* Username */}

        <FormField
					defaultValue={userDetails?.username}
					label="Username:"  
					readOnly={!isEditable}
					required
					className={`${isEditForm ? "w-1/2" : "w-full"}`}
					placeholder="Choose a username"
					{...register("username",{required : true})}
        />

        {/* Email */}
            <FormField
							defaultValue={userDetails?.email}
							label="Email:"
							readOnly={!isEditable}
							type="email"
							required
							className={`${isEditForm ? "w-1/2" : "w-full"}`}
							placeholder="Enter your email"
							// labelClassName="block text-sm font-medium text-gray-600"
							{...register("email",{required : true})}
        />

        {!isEditForm && (
        
        <FormField
					label="Password:"
					type="password"
					required
					className={`${isEditForm ? "w-1/2" : "w-full"}`}
					placeholder="Create a password"
					{...register("password",{required : true})}
        />

        )}

        <div className='flex '>

        {/* Gender */}
        <div className={`${isEditForm ? "w-1/2" : "w-full"} mb-2`}>
        <label className="block text-sm font-medium text-gray-600">
            Gender
        </label>
        <select
        defaultValue={userDetails?.gender}
            required
            disabled={!isEditable}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none "
            {...register("gender",{required : "true"})}
        >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
        </select>
        </div>
        </div>

        {/* <div className='flex'> */}

        {/* Contact Number */}
        
        <FormField
          defaultValue={userDetails?.contactNo}
          label="Contact No:"
          type="tel"
          required
          readOnly={!isEditable}
          placeholder="Enter your contact number"
          className={`${isEditForm ? "w-1/2" : "w-full"}`}
          pattern="[7-9]{1}[0-9]{9}"
          {...register("contactNo",{required : true})}
        />

        {/* Address */}
        <TextField
          label="Address :"
          defaultValue={userDetails?.address}
          readOnly={!isEditable}
          required
          placeholder="Enter your address"
          className={`${isEditForm ? "w-1/2" : "w-full"}`}        
          {...register("address")}
        />
        
        {!isEditForm &&(
        /* Submit Button */
        <Button
        loading ={mutation.isPending}
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
        children="Sign Up"
        />
    )}
    {isEditForm && isEditable &&(
        /* Submit Button */
        <Button
        loading={mutation.isPending}
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
        children="Save"
        />
    )}

    </form>
  )
}

export default UserForm