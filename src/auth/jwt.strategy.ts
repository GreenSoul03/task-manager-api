import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // lee el token del header
      ignoreExpiration: false, // no aceptar tokens expirados
      secretOrKey: process.env.JWT_SECRET || 'supersecret', // clave secreta
    });
  }

  async validate(payload: any) {
    // Lo que retorna aquí se inyecta en req.user
    return { id: payload.sub, email: payload.email };
  }
}
