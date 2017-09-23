import { UserRegisterService } from './../../services/user-register.service';
import { JsonController, Param, Body, Get, Post, Put, Delete } from "routing-controllers";

@JsonController("/API")
export class APIIdentifyController {

    public constructor(protected userService: UserRegisterService) {

    }

    @Get("/")
    public getIdentifyPacket() {
        return "This action returns all rooms";
    }

    @Put("/Create/")
    public createRoom() {

    }

}