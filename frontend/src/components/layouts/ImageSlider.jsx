import React, { useEffect,useState, useRef } from 'react'

function ImageSlider() {
    const [slideImages, setSlideImages] = useState([
        "https://img.freepik.com/premium-photo/hiker-himalaya-mountains-sunset-trekking-nepal-embark-exhilarating-mountain-adventure-ai-generated_538213-11127.jpg",
        "https://www.shutterstock.com/image-photo/calm-weather-on-sea-ocean-600nw-2212935531.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtnvAOajH9gS4C30cRF7rD_voaTAKly2Ntaw&s"
    ])
    const [translate, setTranslate] = useState(0)

    useEffect(() => {
      let count = 0
         const slider = setInterval(()=>{     
          
          if(count < slideImages.length-1 ){
            setTranslate(count)
            // setTranslate(`-${count * 100}%`)
            count++
          }else{
            setTranslate(count)
            // setTranslate("-0%")
            count=0
          }
        },3000)
        return clearInterval(slider)
    },[])
  
  return (
    <>
          <div className=" flex  w-full max-h-[350px]">
            <img className="w-full h-full object-cover" src={slideImages[translate]} />
             {/* {slideImages.map((image) => <div className='w-screen'><img className='w-full' key={image} src={image} /></div>)} */}
          </div>
    </>
  )
}

export default ImageSlider