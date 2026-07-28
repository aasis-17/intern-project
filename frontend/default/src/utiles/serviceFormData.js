export const serviceFormData = (data, mapState) => {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
        if(key === "serviceCoverImage"){
            formData.append(key, data[key][0])
        }else{
            formData.append(key, data[key])
        }
    })
    formData.append("latitude",mapState.position.lat)
    formData.append("longitude", mapState.position.lng)
    formData.append("serviceDestination",mapState.region )

    return formData
}