(() => {
  'use strict';

  const rawLang = (document.documentElement.lang || 'fr').toLowerCase();
  const lang = rawLang.startsWith('mg') ? 'mg' : rawLang.startsWith('en') ? 'en' : 'fr';

  const messages = {
    fr: {
      locale: 'fr-FR',
      income: {
        HIC: 'revenu élevé — base 100 %',
        UMC: 'revenu intermédiaire supérieur — base 65 %',
        LMC: 'revenu intermédiaire inférieur — base 40 %',
        LIC: 'faible revenu — base 25 %'
      },
      calculating: 'Calcul du tarif local indicatif…',
      from: 'À partir de',
      exchangeRate: (value) => `≈ ${value} au taux indicatif du jour`,
      explanation: (country, income) => `${country} : ${income}. Les montants restent indicatifs et sont confirmés sur devis.`,
      adapted: (country) => `Tarifs adaptés pour ${country}.`,
      fallbackError: (message) => `${message}. Les tarifs France restent affichés.`,
      geolocationUnavailable: 'La géolocalisation n’est pas disponible sur ce navigateur. Choisissez votre pays manuellement.',
      geolocationPrompt: 'Autorisez la localisation pour identifier uniquement votre pays…',
      countryUnknown: 'Pays non identifié',
      countryLookupFailed: 'Impossible d’identifier le pays',
      manualChoice: (message) => `${message}. Choisissez votre pays manuellement.`,
      geolocationDenied: 'Localisation refusée ou indisponible. Vous pouvez choisir votre pays manuellement.',
      resetExplanation: 'France : tarifs de référence. Pour un autre pays, utilisez la localisation ou choisissez le pays.',
      resetStatus: 'Tarifs France affichés.',
      countriesUnavailable: 'La liste automatique des pays n’a pas pu être chargée. Le bouton GPS reste disponible.',
      currencyUnavailable: 'Devise indisponible',
      exchangeUnavailable: 'Taux de change indisponible',
      safetyBase: 'base internationale 100 %'
    },
    en: {
      locale: 'en-GB',
      income: {
        HIC: 'high income — 100% base',
        UMC: 'upper-middle income — 65% base',
        LMC: 'lower-middle income — 40% base',
        LIC: 'low income — 25% base'
      },
      calculating: 'Calculating the indicative local price…',
      from: 'From',
      exchangeRate: (value) => `≈ ${value} at today’s indicative exchange rate`,
      explanation: (country, income) => `${country}: ${income}. Amounts are indicative and confirmed by quotation.`,
      adapted: (country) => `Prices adapted for ${country}.`,
      fallbackError: (message) => `${message}. France reference prices remain displayed.`,
      geolocationUnavailable: 'Geolocation is not available in this browser. Please choose your country manually.',
      geolocationPrompt: 'Allow location access to identify only your country…',
      countryUnknown: 'Country not identified',
      countryLookupFailed: 'Unable to identify the country',
      manualChoice: (message) => `${message}. Please choose your country manually.`,
      geolocationDenied: 'Location access was refused or is unavailable. You can choose your country manually.',
      resetExplanation: 'France: reference prices. For another country, use location detection or choose the country.',
      resetStatus: 'France reference prices displayed.',
      countriesUnavailable: 'The automatic country list could not be loaded. GPS detection remains available.',
      currencyUnavailable: 'Currency unavailable',
      exchangeUnavailable: 'Exchange rate unavailable',
      safetyBase: 'international 100% base'
    },
    mg: {
      locale: 'mg-MG',
      income: {
        HIC: 'fidiram-bola ambony — fototra 100 %',
        UMC: 'fidiram-bola antonony ambony — fototra 65 %',
        LMC: 'fidiram-bola antonony ambany — fototra 40 %',
        LIC: 'fidiram-bola ambany — fototra 25 %'
      },
      calculating: 'Kajiana ny sarany eo an-toerana…',
      from: 'Manomboka amin’ny',
      exchangeRate: (value) => `≈ ${value} araka ny tahan’ny fifanakalozana ankehitriny`,
      explanation: (country, income) => `${country}: ${income}. Tombanana ireo vola ireo ary hamafisina amin’ny devis.`,
      adapted: (country) => `Nampifanarahana amin’i ${country} ny sarany.`,
      fallbackError: (message) => `${message}. Mijanona aseho ny sarany fototra any Frantsa.`,
      geolocationUnavailable: 'Tsy misy géolocalisation amin’ity navigateur ity. Fidio amin’ny tanana ny firenenao.',
      geolocationPrompt: 'Omeo alalana ny toerana mba hamantarana ny firenenao ihany…',
      countryUnknown: 'Tsy fantatra ny firenena',
      countryLookupFailed: 'Tsy afaka mamantatra ny firenena',
      manualChoice: (message) => `${message}. Fidio amin’ny tanana ny firenenao.`,
      geolocationDenied: 'Nolavina na tsy misy ny géolocalisation. Afaka misafidy firenena amin’ny tanana ianao.',
      resetExplanation: 'Frantsa: sarany fototra. Raha firenena hafa, ampiasao ny GPS na fidio ny firenena.',
      resetStatus: 'Aseho ny sarany fototra any Frantsa.',
      countriesUnavailable: 'Tsy afaka nampidirina ny lisitry ny firenena. Mbola azo ampiasaina ny bokotra GPS.',
      currencyUnavailable: 'Tsy hita ny vola ampiasaina',
      exchangeUnavailable: 'Tsy hita ny tahan’ny fifanakalozana',
      safetyBase: 'fototra iraisam-pirenena 100 %'
    }
  };

  const t = messages[lang];

  const incomeMultipliers = {
    HIC: 1,
    UMC: 0.65,
    LMC: 0.40,
    LIC: 0.25
  };

  const territoryNames = {
    RE: { fr: 'La Réunion', en: 'Réunion', mg: 'La Réunion' },
    YT: { fr: 'Mayotte', en: 'Mayotte', mg: 'Mayotte' },
    GP: { fr: 'Guadeloupe', en: 'Guadeloupe', mg: 'Guadeloupe' },
    MQ: { fr: 'Martinique', en: 'Martinique', mg: 'Martinique' },
    GF: { fr: 'Guyane française', en: 'French Guiana', mg: 'Guyane française' },
    PM: { fr: 'Saint-Pierre-et-Miquelon', en: 'Saint Pierre and Miquelon', mg: 'Saint-Pierre-et-Miquelon' }
  };

  const strategicCurrencyFallbacks = {
    FR: 'EUR', RE: 'EUR', YT: 'EUR', GP: 'EUR', MQ: 'EUR', GF: 'EUR', PM: 'EUR',
    MG: 'MGA', MU: 'MUR', ZA: 'ZAR', SN: 'XOF', CI: 'XOF', CM: 'XAF', MA: 'MAD',
    DZ: 'DZD', TN: 'TND', KE: 'KES', TZ: 'TZS', RW: 'RWF', US: 'USD', CA: 'CAD',
    GB: 'GBP', CH: 'CHF', AU: 'AUD', NZ: 'NZD', IN: 'INR', JP: 'JPY', BR: 'BRL'
  };

  const geoButton = document.querySelector('[data-pricing-geolocate]');
  const countrySelect = document.querySelector('[data-pricing-country]');
  const resetButton = document.querySelector('[data-pricing-reset]');
  const status = document.querySelector('[data-pricing-status]');
  const explanation = document.querySelector('[data-pricing-explanation]');
  const priceNodes = [...document.querySelectorAll('[data-base-eur]')];

  if (!status || !priceNodes.length) return;

  const eurFormatter = new Intl.NumberFormat(t.locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  });

  const countryDisplayNames = typeof Intl.DisplayNames === 'function'
    ? new Intl.DisplayNames([lang === 'mg' ? 'mg' : lang], { type: 'region' })
    : null;

  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.setAttribute('role', isError ? 'alert' : 'status');
  };

  const roundCommercial = (value) => {
    if (value < 500) return Math.round(value / 10) * 10;
    if (value < 2000) return Math.round(value / 25) * 25;
    return Math.round(value / 50) * 50;
  };

  const territoryName = (countryCode) => territoryNames[countryCode]?.[lang] || territoryNames[countryCode]?.fr;

  const fallbackCountry = (countryCode) => ({
    iso2Code: countryCode,
    name: territoryName(countryCode) || countryDisplayNames?.of(countryCode) || countryCode,
    incomeLevel: { id: 'HIC', value: t.safetyBase }
  });

  const getWorldBankCountry = async (countryCode) => {
    if (territoryNames[countryCode]) return fallbackCountry(countryCode);

    try {
      const response = await fetch(`https://api.worldbank.org/v2/country/${encodeURIComponent(countryCode)}?format=json`);
      if (!response.ok) return fallbackCountry(countryCode);
      const payload = await response.json();
      return payload?.[1]?.[0] || fallbackCountry(countryCode);
    } catch (_) {
      return fallbackCountry(countryCode);
    }
  };

  const getCurrency = async (countryCode) => {
    if (strategicCurrencyFallbacks[countryCode]) return strategicCurrencyFallbacks[countryCode];

    try {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${encodeURIComponent(countryCode)}?fields=currencies`);
      if (!response.ok) throw new Error(t.currencyUnavailable);
      const payload = await response.json();
      const country = Array.isArray(payload) ? payload[0] : payload;
      const currencyCode = Object.keys(country?.currencies || {})[0];
      return currencyCode || 'EUR';
    } catch (_) {
      return 'EUR';
    }
  };

  const getEurRate = async (currency) => {
    if (currency === 'EUR') return 1;
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/EUR');
      if (!response.ok) throw new Error(t.exchangeUnavailable);
      const payload = await response.json();
      return Number(payload?.rates?.[currency]) || 1;
    } catch (_) {
      return 1;
    }
  };

  const formatLocalCurrency = (amount, currency) => {
    try {
      return new Intl.NumberFormat(t.locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (_) {
      return `${Math.round(amount).toLocaleString(t.locale)} ${currency}`;
    }
  };

  const localCountryName = (countryCode, apiName = '') => {
    return territoryName(countryCode) || countryDisplayNames?.of(countryCode) || apiName || countryCode;
  };

  const applyCountryPricing = async (countryCode, detectedName = '') => {
    setStatus(t.calculating);

    try {
      const worldBankCountry = await getWorldBankCountry(countryCode);
      const incomeCode = worldBankCountry?.incomeLevel?.id || 'HIC';
      const multiplier = incomeMultipliers[incomeCode] || 1;
      const countryName = localCountryName(countryCode, detectedName || worldBankCountry.name);
      const currency = await getCurrency(countryCode);
      const eurRate = await getEurRate(currency);

      priceNodes.forEach((node) => {
        const base = Number(node.dataset.baseEur);
        const adjustedEur = roundCommercial(base * multiplier);
        const localAmount = Math.round(adjustedEur * eurRate);
        const main = node.querySelector('[data-price-main]');
        const secondary = node.querySelector('[data-price-secondary]');

        if (main) main.textContent = `${t.from} ${eurFormatter.format(adjustedEur)}`;

        if (secondary) {
          if (currency !== 'EUR' && eurRate !== 1) {
            secondary.textContent = t.exchangeRate(formatLocalCurrency(localAmount, currency));
            secondary.hidden = false;
          } else {
            secondary.textContent = '';
            secondary.hidden = true;
          }
        }
      });

      if (explanation) explanation.textContent = t.explanation(countryName, t.income[incomeCode] || t.safetyBase);
      setStatus(t.adapted(countryName));
      document.documentElement.dataset.pricingCountry = countryCode;
    } catch (error) {
      resetPricing();
      setStatus(t.fallbackError(error.message), true);
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client');
    url.searchParams.set('latitude', latitude);
    url.searchParams.set('longitude', longitude);
    url.searchParams.set('localityLanguage', lang === 'mg' ? 'mg' : lang);
    const response = await fetch(url);
    if (!response.ok) throw new Error(t.countryLookupFailed);
    return response.json();
  };

  const locateByGps = () => {
    if (!navigator.geolocation) {
      setStatus(t.geolocationUnavailable, true);
      return;
    }

    setStatus(t.geolocationPrompt);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const location = await reverseGeocode(coords.latitude, coords.longitude);
          const code = location?.countryCode;
          if (!code) throw new Error(t.countryUnknown);
          if (countrySelect) countrySelect.value = code;
          await applyCountryPricing(code, location.countryName || '');
        } catch (error) {
          setStatus(t.manualChoice(error.message), true);
        }
      },
      () => setStatus(t.geolocationDenied, true),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 3600000 }
    );
  };

  const resetPricing = () => {
    priceNodes.forEach((node) => {
      const base = Number(node.dataset.baseEur);
      const main = node.querySelector('[data-price-main]');
      const secondary = node.querySelector('[data-price-secondary]');
      if (main) main.textContent = `${t.from} ${eurFormatter.format(base)}`;
      if (secondary) {
        secondary.textContent = '';
        secondary.hidden = true;
      }
    });
    if (explanation) explanation.textContent = t.resetExplanation;
    setStatus(t.resetStatus);
    delete document.documentElement.dataset.pricingCountry;
  };

  const loadCountries = async () => {
    if (!countrySelect) return;

    try {
      const response = await fetch('https://api.worldbank.org/v2/country?format=json&per_page=400');
      if (!response.ok) throw new Error(t.countriesUnavailable);
      const payload = await response.json();
      const countries = (payload?.[1] || [])
        .filter((country) => country?.region?.id && country.region.id !== '')
        .filter((country) => /^[A-Z]{2}$/.test(country.iso2Code || ''))
        .map((country) => ({
          code: country.iso2Code,
          name: localCountryName(country.iso2Code, country.name)
        }));

      Object.keys(territoryNames).forEach((code) => {
        if (!countries.some((country) => country.code === code)) {
          countries.push({ code, name: localCountryName(code) });
        }
      });

      countries
        .sort((a, b) => a.name.localeCompare(b.name, lang === 'mg' ? 'mg' : lang))
        .forEach((country) => {
          const option = document.createElement('option');
          option.value = country.code;
          option.textContent = country.name;
          countrySelect.append(option);
        });
    } catch (_) {
      setStatus(t.countriesUnavailable, true);
    }
  };

  geoButton?.addEventListener('click', locateByGps);
  resetButton?.addEventListener('click', resetPricing);
  countrySelect?.addEventListener('change', () => {
    const code = countrySelect.value;
    if (code) applyCountryPricing(code);
  });

  resetPricing();
  loadCountries();
})();