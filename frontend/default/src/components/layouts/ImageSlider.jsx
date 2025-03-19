import React, { useEffect,useState, useRef } from 'react'

function ImageSlider() {
    const [slideImages, setSlideImages] = useState([
        "https://img.freepik.com/premium-photo/hiker-himalaya-mountains-sunset-trekking-nepal-embark-exhilarating-mountain-adventure-ai-generated_538213-11127.jpg",
        "https://www.shutterstock.com/image-photo/calm-weather-on-sea-ocean-600nw-2212935531.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtnvAOajH9gS4C30cRF7rD_voaTAKly2Ntaw&s"
    ])
    const [translate, setTranslate] = useState(0)
  
    useEffect(() => {
            let slider;
            let hasStarted = true
            if(hasStarted){
              let index = 0
              slider = setInterval(()=>{     
            
              if(index < slideImages.length-1 ){
                index++
              }else{
                index =0
              }
              hasStarted = false
              setTranslate(index)
            },5000)
            }

    },[])
  
  
  return (
    <>
          <div className="w-full">
          <img className="w-full h-full object-cover brightness-75" src={slideImages[translate]} />
            {/* <div className='absolute top-96 inset-0 bg-gradient-to-b backdrop-blur-xl from-transparent/10 to-transparent'></div> */}

             {/* {slideImages.map((image) => <div className='w-screen'><img className='w-full' key={image} src={image} /></div>)} */}
          </div>
    </>
  )
}

export default ImageSlider