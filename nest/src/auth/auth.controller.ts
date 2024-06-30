import { Controller, Post, UseGuards, Get, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private rolesService: RolesService
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @UseGuards(ThrottlerGuard)
    @Throttle(5, 60)
    @ApiBody({ type: UserLoginDto, })
    @Post('/login')
    @ResponseMessage('User login')
    handleLogin(
        @Req() req,
        @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }

    @Post('register')
    @ResponseMessage('Regis a new user')
    async create(@Body() registerUserDto: RegisterUserDto) {

        let data = await this.usersService.register(registerUserDto);

        return {
            "_id": data.id,
            "createdAt": data.createdAt
        }
    }

    @Get('account')
    @ResponseMessage('Get User Infomaion')
    async getAccount(@User() user: IUser) {
        const temp = await this.rolesService.findOne(user.role._id) as any;
        user.permissions = temp.permissions;

        return { "user": user };
    }

    @Public()
    @Get('refresh')
    @ResponseMessage('Get User by Refresh Token')
    getUserbyRefreshToken(@Req() req: Request,
        @Res({ passthrough: true }) response: Response) {
        const refresh_token = req.cookies['refresh_token'];

        return this.authService.processNewToken(refresh_token, response);
    }


    @Post('logout')
    @ResponseMessage('Logout user')
    handleLogout(@Res({ passthrough: true }) response: Response, @User() user: IUser) {
        return this.authService.logout(response, user);
    }

}
