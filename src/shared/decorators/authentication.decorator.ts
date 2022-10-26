import { UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import AuthLocalGuard from '../guards/local.guard';

export default function Authentication(auth: boolean) {
  if (auth) {
    return UseGuards(new AuthLocalGuard(new Reflector()));
  }
  return () => {
    return;
  };
}
