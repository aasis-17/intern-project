import Button from '../components/Button'
import { useNetwork } from '../store/networkContext'

const Error = ({mode}) => {
 
  const {isOnline} = useNetwork()

  
  const goBack = () =>{
  window.location.reload()
  }

  const errorMsg = mode === "offline" ? "No internet connection! Please check your network and try again."
  : "We can’t seem to find the page you are looking for!"

  if(isOnline && mode === "offline") return null

  return (
    <>
     <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">

        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
            ERROR !
          </h1>
           
          <img src='https://www.mexc.co/images/error/404-dark.svg' alt="404" className="dark:hidden" />

          <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
            {errorMsg}
          </p>

          <Button
            variant='noCss'
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            onClick={goBack}
            children="Back to Home Page"
          />
            
          
        </div>
        {/* <!-- Footer --> */}
        <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
          &copy; {new Date().getFullYear()}
        </p>
      </div>
    </>
  )
}

export default Error