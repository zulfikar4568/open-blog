import { UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import AuthFacebookGuard from '../guards/facebook.guard';

export default function AuthFacebook() {
  return UseGuards(new AuthFacebookGuard(new Reflector()));
}
