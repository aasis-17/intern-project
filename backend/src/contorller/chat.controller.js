import { isValidObjectId } from "mongoose";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { Chat } from "../model/chat.model.js";

export const createChat = asyncHandler(async(req, res) => {

    const { receiver_id, message} = req.body

    if(!isValidObjectId(receiver_id)) throw new ApiError(400, "Invalid id!!")

    if(!receiver_id || !message) throw new ApiError(400, "field missing!!")

    const chat = await Chat.create({
        sender_id : req.user._id,
        receiver_id,
        message
    })

    return res.status(200).json(new ApiResponse(200, chat, "Chat created successfully!!"))
})

export const deleteChat = asyncHandler(async(req, res) => {

    const {chatId} = req.params

    if(!isValidObjectId(chatId)) throw new ApiError(400, "Invalid id!!")

    const deletedChat = await Chat.findByIdAndDelete(chatId)

    return res.status(200).json(new ApiResponse(200, deletedChat, "Chat deleted successfully!!"))
})