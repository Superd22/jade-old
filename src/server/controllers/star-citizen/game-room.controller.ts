import {JsonController, Param, Body, Get, Post, Put, Delete} from "routing-controllers";

@JsonController("/rooms")
export class SCGameRoomController {

    @Get("/")
    getAll() {
       return "This action returns all users";
    }

}