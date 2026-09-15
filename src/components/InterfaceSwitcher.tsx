"use client";

import { createElement, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { registerInterfaceSwitcher, type PortfolioInterface } from '../../shared/interface-switcher';

export default function InterfaceSwitcher({ current, floating = false }: {
  current: PortfolioInterface;
  floating?: boolean;
}) {
  const { locale } = useLanguage();
  useEffect(() => { registerInterfaceSwitcher(); }, []);
  return createElement('portfolio-interface-switcher', {
    current, lang: locale, ...(floating ? { floating: '' } : {}),
  });
}
