import { memo } from "react"
import Button from "../../../components/Button"

const ServiceCard = ({service, onReview}) => {
    return <>
     <div className='shadow-md flex justify-between items-center h-32 mb-3'>
          <div  className={`h-full w-[35%] bg-red-50   rounded overflow-hidden shadow-lg relative`}>
          {/* Image Container */}
          <div className="h-32 w-full relative rounded-lg overflow-hidden">
            {/* Image */}
            <img
              className={`h-32 w-full object-cover transition-transform duration-300 transform hover:scale-110`}
              src={service.serviceCoverImage}
              alt={service.serviceName}
            />
        {/* Dark Gradient Overlay at the Bottom */}
        <div className="absolute h-8 top-24 inset-0 bg-gradient-to-t from-black/80 to-transparent -z-0"></div>
          </div>
    
          {/* Destination Name */}
          <div className="absolute bottom-2 left-2 text-white font-bold text-xl">
            {service.serviceName}
          </div>
          <div>

          </div>

          </div>
          {/* <span className='text-sm '>Status : {service.isApproved === "approved" ? <MdCheckCircle className="text-green-500 me-1 dark:text-green-300 inline" /> : <MdOutlineError className="text-amber-500 me-1 dark:text-amber-300 inline" />}<span >{service.isApproved.toUpperCase()}</span> </span> */}
          <div className='mr-5 '>
            <Button 
              onClick={onReview}
              children="Review" 
              variant='outline'
              className='mr-5'
              />
          </div>
        </div>
    </>
}

export default memo(ServiceCard)