import mongoose from "mongoose";

const routeSchema = new mongoose.Schema([
    {
        day : {
            type : Number,
            required : true
        },
        routeTask : {
            type : String,
            required : true
        },
            sLocation : {
                lat :{
                type : Number,
                required : true
            },
            lng : {
                type : Number,
                required : true
            }
           },
                eLocation :{
                lat :{
                type : Number,
                required : true
            },
            lng : {
                type : Number,
                required : true
            }
        }
    }

])

export const Route = mongoose.model("Route", routeSchema)