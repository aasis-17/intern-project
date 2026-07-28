import React, { useEffect,useState} from 'react'

function ImageSlider() {
    const slideImages = [
        "https://img.freepik.com/premium-photo/hiker-himalaya-mountains-sunset-trekking-nepal-embark-exhilarating-mountain-adventure-ai-generated_538213-11127.jpg",
        "https://www.shutterstock.com/image-photo/calm-weather-on-sea-ocean-600nw-2212935531.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtnvAOajH9gS4C30cRF7rD_voaTAKly2Ntaw&s"
    ]
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false)
  
    useEffect(() => {
          const slider = setInterval(()=>{     
          
          setIsAnimating(true)

            setTimeout(()=>{
            setCurrentIndex(prev =>{
            if(prev < slideImages.length-1 ){
              return prev + 1
            }else{
              return  0
          }
          })
          setIsAnimating(false)
          }, 400)

          }, 5000)
        return () => clearInterval(slider)
    },[slideImages.length])

  
  return (
    <>
          <div className=" relative w-full h-[80vh] overflow-hidden bg-zinc-500">
          <img 
          alt="Slide"
          className={`
            absolute inset-0 w-full h-full object-cover brightness-75
            transition-all duration-500 ease-in-out
            ${isAnimating ? "opacity-60 -translate-x-2" : "opacity-100 translate-x-0"}
          `}
          loading='lazy'
          src={slideImages[currentIndex]} />

          </div>
    </>
  )
}

export default ImageSlider