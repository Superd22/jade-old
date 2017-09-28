import { ISCLFGParams } from './../../../../common/interfaces/star-citizen/lfg-params.interface';
import { Delete } from 'routing-controllers';
import { JadeUserEntity } from './../../../entity/user/jade-user.entity';
import { CurrentUser, Patch, Get, JsonController, Body } from 'routing-controllers';

@JsonController("/sc/lfg")
export class APISCLFGController {

    /**
     * List all the currently active groups
     */
    @Get('/')
    public listGroups() {

    }

    /**
     * List all the available modes / game-modes
     */
    @Get('/available-modes')
    public listAvaliableModes() {
        
    }

    /**
     * Set the supplied user as looking for a group
     * 
     * @param user user to set
     * @param body param for the lfg
     */
    @Patch('lfg-user')
    public setUserLfg( @CurrentUser() user: JadeUserEntity, @Body() body: ISCLFGParams) {

    }

    /**
     * Remove the looking for group flag of the supplied user
     * 
     * @param user user to remove lfg for
     */
    @Delete('lfg-user')
    public deleteUserLfg(@CurrentUser() user: JadeUserEntity) {

    }
}