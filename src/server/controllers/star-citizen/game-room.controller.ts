import {JsonController, Param, Body, Get, Post, Put, Delete} from "routing-controllers";

@JsonController("/rooms")
export class SCGameRoomController {

    @Get("/")
    public getAll() {
       return "This action returns all rooms";
    }

    @Put("/Create/")
    public createRoom() {
        
    }

}