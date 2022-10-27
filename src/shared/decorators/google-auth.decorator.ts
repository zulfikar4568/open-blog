import { UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import AuthGoogleGuard from '../guards/google.guard';

export default function AuthGoogle() {
  return UseGuards(new AuthGoogleGuard(new Reflector()));
}
