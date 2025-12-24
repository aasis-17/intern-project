
const ReviewStar = ({avgReview = 0, className=""}) => {
    const averageReview = Number(avgReview?.toFixed()) || 0

  return (
       <div className={`${className} flex justify-end `}>
        {[...Array(averageReview)].map((_, i) => (
        <span key={i} className="text-yellow-400 md:text-xl text-md">
          ★
        </span>
      ))}
      </div>   
  )
}

export default ReviewStar