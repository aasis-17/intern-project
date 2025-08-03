export const review = (builder) =>{
    return {
        getServiceReviews : builder.query({
            query(serviceId){
                console.log(serviceId)
                return {
                    url : "review",
                    method : "GET",
                    params : {
                        serviceId
                    }
                }
            },
            transformResponse : (res) => res.data
        }),
            getDestinationReviews : builder.query({
            query(destinationId){
                
                return {
                    url : "review",
                    method : "GET",
                    params : {
                        destinationId
                    }
                }
            },
            transformResponse : (res) => res.data
        }),
    }
}