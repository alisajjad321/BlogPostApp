import { Injectable, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    constructor () {
        super ()
    }

    getRequest = (context: ExecutionContext) => {
        const gqlContext = GqlExecutionContext.create(context)
        const request = gqlContext.getContext()
        request.body = gqlContext.getArgs().loginDTO
        return request
    }
}