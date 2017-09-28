import { APIResponse } from './../../../services/api-response.service';
import { Container } from 'typedi';
import { SCCommonService } from './../../../services/star-citizen/common-sc.service';
import { JsonController } from 'routing-controllers';
import { Get } from 'routing-controllers';

@JsonController("/sc")
export class APISController {

    private _scService: SCCommonService;

    constructor() {
        this._scService = Container.get(SCCommonService);
    }

    @Get("/modes")
    public getAllModes() {

    }

    public getAllSubModes() {

    }

    /**
     * Return both modes and submodes
     */
    @Get("/modes-and-sub")
    public async getAllModesAndSub() {
        return APIResponse.send({
            gameModes: await this._scService.getModes(),
            subModes: await this._scService.getSubModes(),
        });
    }
}