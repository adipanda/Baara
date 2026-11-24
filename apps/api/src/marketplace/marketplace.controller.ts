import { Controller, Get, Query } from '@nestjs/common';
import type { CountryCode, CurrencyCode, ServiceVertical } from '@baara/shared-types';

@Controller('marketplace')
export class MarketplaceController {
  @Get('categories')
  getCategories(@Query('vertical') vertical?: ServiceVertical) {
    const categories = [
      { slug: 'software-dev', name: 'Software Developers', vertical: 'DIGITAL_FREELANCE' },
      { slug: 'ai-engineers', name: 'AI Engineers', vertical: 'DIGITAL_FREELANCE' },
      { slug: 'ui-ux-design', name: 'UI/UX Designers', vertical: 'DIGITAL_FREELANCE' },
      { slug: 'solar-tech', name: 'Solar Technicians', vertical: 'LOCAL_SERVICE' },
      { slug: 'electricians', name: 'Electricians', vertical: 'LOCAL_SERVICE' },
      { slug: 'plumbers', name: 'Plumbers', vertical: 'LOCAL_SERVICE' },
      { slug: 'moto-couriers', name: 'Motorcycle Couriers', vertical: 'LOCAL_SERVICE' },
    ];
    return vertical ? categories.filter((c) => c.vertical === vertical) : categories;
  }

  @Get('featured')
  getFeatured(
    @Query('country') country: CountryCode = 'SN',
    @Query('currency') currency: CurrencyCode = 'XOF',
  ) {
    return {
      country,
      currency,
      items: [
        {
          id: 'gig_01',
          title: 'Full-Stack Next.js & Mobile Money Integration',
          vertical: 'DIGITAL_FREELANCE',
          priceMinor: '150000',
          currency,
          rating: 4.95,
        },
        {
          id: 'gig_02',
          title: 'Certified Solar Inverter Installation & Maintenance',
          vertical: 'LOCAL_SERVICE',
          priceMinor: '45000',
          currency,
          rating: 4.9,
        },
      ],
    };
  }
}
