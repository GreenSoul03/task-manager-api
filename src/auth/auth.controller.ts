import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // 🔐 Login
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  // 🆕 Registro de usuario
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // Crear el usuario (con contraseña hasheada)
    const user = await this.usersService.create(createUserDto);

    // Generar el token inmediatamente después de registrarse
    const payload = { sub: user.id, email: user.email };
    const access_token = this.authService.getJwtToken(payload);

    return {
      message: 'Usuario registrado correctamente',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      access_token,
    };
  }
}
