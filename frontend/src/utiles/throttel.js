export const useThrottel = (fn, delay) => {
    let timer = false
    return (...args)=>{
        if(!timer){
            setTimeout(() => {
                fn(...args)
            },delay)
            timer = false
        }
        timer= true
    }
}