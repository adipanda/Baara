import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { JwtPayload, LoginRequest, RegisterRequest } from '@baara/shared-types';
import { AuthService } from './auth.service';
import { JwtAuthGuard, Roles, RolesGuard } from './auth.guard';

interface InMemoryUser {
  id: string;
  email: string;
  phoneE164: string;
  passwordHash: string;
  countryCode: RegisterRequest['countryCode'];
  roles: RegisterRequest['role'][];
  kycTier: 'TIER_0' | 'TIER_1' | 'TIER_2';
}

@Controller('auth')
export class AuthController {
  // Phase 1 bootstrap store; replaced by PrismaService when PostgreSQL is connected
  private readonly users = new Map<string, InMemoryUser>();

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterRequest) {
    if (!body.email || !body.password || !body.phoneE164 || !body.countryCode) {
      throw new BadRequestException('email, phoneE164, password, and countryCode are required');
    }
    if (this.users.has(body.email.toLowerCase())) {
      throw new BadRequestException('Email already registered');
    }
    const user: InMemoryUser = {
      id: crypto.randomUUID(),
      email: body.email.toLowerCase(),
      phoneE164: body.phoneE164,
      passwordHash: this.authService.hashPassword(body.password),
      countryCode: body.countryCode,
      roles: [body.role || 'CLIENT'],
      kycTier: 'TIER_0',
    };
    this.users.set(user.email, user);

    return {
      user: {
        id: user.id,
        email: user.email,
        countryCode: user.countryCode,
        roles: user.roles,
        kycTier: user.kycTier,
      },
      accessToken: this.authService.signAccessToken(user),
    };
  }

  @Post('login')
  login(@Body() body: LoginRequest) {
    const user = this.users.get(body.email?.toLowerCase());
    if (!user || !this.authService.verifyPassword(body.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return {
      accessToken: this.authService.signAccessToken(user),
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
        kycTier: user.kycTier,
      },
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: { user: JwtPayload }) {
    return { user: req.user };
  }

  @Post('kyc/submit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT', 'FREELANCER', 'LOCAL_PROVIDER', 'AGENCY')
  submitKyc(
    @Req() req: { user: JwtPayload },
    @Body() body: { documentType: string; documentNumberLast4: string },
  ) {
    if (!body.documentType || !body.documentNumberLast4) {
      throw new BadRequestException('documentType and documentNumberLast4 are required');
    }
    return {
      status: 'PENDING_VERIFICATION',
      userId: req.user.sub,
      targetTier: 'TIER_1',
      provider: 'SMILE_ID',
      submittedAt: new Date().toISOString(),
    };
  }
}
