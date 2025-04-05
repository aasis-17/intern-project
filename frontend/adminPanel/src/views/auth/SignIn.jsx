import InputField from "../../components/fields/InputField";
import {useForm} from "react-hook-form"

export default function SignIn() {

  const {register, handleSubmit} = useForm()

  const handleLogin = (data) =>{
    console.log(data)
  }

  return (
    <div className="bg-gray-50  flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:items-center">
      {/* Sign in section */}
      <form onSubmit={handleSubmit(handleLogin)} className="shadow-xl p-4 rounded-lg mt-[10vh] w-full max-w-full flex-col items-center md:pl-4  xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>

        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@simmmple.com"
          id="email"
          type="text"
          {...register("email",{required : true})}
        />

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="Min. 8 characters"
          id="password"
          type="password"
          {...register("password",{required : true})}
        />

        <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
          Sign In
        </button>

      </form>
    </div>
  );
}
