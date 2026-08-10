(() => {
  'use strict';

  const incomeMultipliers = {
    HIC: 1,
    UMC: 0.65,
    LMC: 0.40,
    LIC: 0.25
  };

  const incomeLabels = {
    HIC: 'revenu élevé — base 100 %',
    UMC: 'revenu intermédiaire supérieur — base 65 %',
    LMC: 'revenu intermédiaire inférieur — base 40 %',
    LIC: 'faible revenu — base 25 %'
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

  const franceFormatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  });

  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.setAttribute('role', isError ? 'alert' : 'status');
  };

  const roundCommercial = (value) => {
    if (value < 500) return Math.round(value / 10) * 10;
    if (value < 2000) return Math.round(value / 25) * 25;
    return Math.round(value / 50) * 50;
  };

  const getWorldBankCountry = async (countryCode) => {
    const response = await fetch(`https://api.worldbank.org/v2/country/${encodeURIComponent(countryCode)}?format=json`);
    if (!response.ok) throw new Error('Classification pays indisponible');
    const payload = await response.json();
    const country = payload?.[1]?.[0];
    if (!country) throw new Error('Pays non reconnu par la grille internationale');
    return country;
  };

  const getCurrency = async (countryCode) => {
    if (strategicCurrencyFallbacks[countryCode]) return strategicCurrencyFallbacks[countryCode];

    try {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${encodeURIComponent(countryCode)}?fields=currencies`);
      if (!response.ok) throw new Error('Devise indisponible');
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
      if (!response.ok) throw new Error('Taux de change indisponible');
      const payload = await response.json();
      return Number(payload?.rates?.[currency]) || 1;
    } catch (_) {
      return 1;
    }
  };

  const formatLocalCurrency = (amount, currency) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        maximumFractionDigits: currency === 'MGA' ? 0 : 0
      }).format(amount);
    } catch (_) {
      return `${Math.round(amount).toLocaleString('fr-FR')} ${currency}`;
    }
  };

  const applyCountryPricing = async (countryCode, detectedName = '') => {
    setStatus('Calcul du tarif local indicatif…');

    try {
      const worldBankCountry = await getWorldBankCountry(countryCode);
      const incomeCode = worldBankCountry?.incomeLevel?.id || 'HIC';
      const multiplier = incomeMultipliers[incomeCode] || 1;
      const countryName = detectedName || worldBankCountry.name || countryCode;
      const currency = await getCurrency(countryCode);
      const eurRate = await getEurRate(currency);

      priceNodes.forEach((node) => {
        const base = Number(node.dataset.baseEur);
        const adjustedEur = roundCommercial(base * multiplier);
        const localAmount = Math.round(adjustedEur * eurRate);

        const main = node.querySelector('[data-price-main]');
        const secondary = node.querySelector('[data-price-secondary]');

        if (main) {
          main.textContent = `À partir de ${franceFormatter.format(adjustedEur)}`;
        }

        if (secondary) {
          if (currency !== 'EUR' && eurRate !== 1) {
            secondary.textContent = `≈ ${formatLocalCurrency(localAmount, currency)} au taux indicatif du jour`;
            secondary.hidden = false;
          } else {
            secondary.textContent = '';
            secondary.hidden = true;
          }
        }
      });

      if (explanation) {
        explanation.textContent = `${countryName} : ${incomeLabels[incomeCode] || 'base internationale 100 %'}. Les montants restent indicatifs et sont confirmés sur devis.`;
      }

      setStatus(`Tarifs adaptés pour ${countryName}.`);
      document.documentElement.dataset.pricingCountry = countryCode;
    } catch (error) {
      resetPricing();
      setStatus(`${error.message}. Les tarifs France restent affichés.`, true);
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client');
    url.searchParams.set('latitude', latitude);
    url.searchParams.set('longitude', longitude);
    url.searchParams.set('localityLanguage', 'fr');

    const response = await fetch(url);
    if (!response.ok) throw new Error('Impossible d’identifier le pays');
    return response.json();
  };

  const locateByGps = () => {
    if (!navigator.geolocation) {
      setStatus('La géolocalisation n’est pas disponible sur ce navigateur. Choisissez votre pays manuellement.', true);
      return;
    }

    setStatus('Autorisez la localisation pour identifier uniquement votre pays…');

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const location = await reverseGeocode(coords.latitude, coords.longitude);
          const code = location?.countryCode;
          if (!code) throw new Error('Pays non identifié');
          if (countrySelect) countrySelect.value = code;
          await applyCountryPricing(code, location.countryName || '');
        } catch (error) {
          setStatus(`${error.message}. Choisissez votre pays manuellement.`, true);
        }
      },
      () => {
        setStatus('Localisation refusée ou indisponible. Vous pouvez choisir votre pays manuellement.', true);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 3600000 }
    );
  };

  const resetPricing = () => {
    priceNodes.forEach((node) => {
      const base = Number(node.dataset.baseEur);
      const main = node.querySelector('[data-price-main]');
      const secondary = node.querySelector('[data-price-secondary]');
      if (main) main.textContent = `À partir de ${franceFormatter.format(base)}`;
      if (secondary) {
        secondary.textContent = '';
        secondary.hidden = true;
      }
    });
    if (explanation) {
      explanation.textContent = 'France : tarifs de référence. Pour un autre pays, utilisez la localisation ou choisissez le pays.';
    }
    setStatus('Tarifs France affichés.');
    delete document.documentElement.dataset.pricingCountry;
  };

  const loadCountries = async () => {
    if (!countrySelect) return;

    try {
      const response = await fetch('https://api.worldbank.org/v2/country?format=json&per_page=400');
      if (!response.ok) throw new Error('Liste des pays indisponible');
      const payload = await response.json();
      const countries = (payload?.[1] || [])
        .filter((country) => country?.region?.id && country.region.id !== '')
        .filter((country) => /^[A-Z]{2}$/.test(country.iso2Code || ''))
        .sort((a, b) => a.name.localeCompare(b.name, 'fr'));

      countries.forEach((country) => {
        const option = document.createElement('option');
        option.value = country.iso2Code;
        option.textContent = country.name;
        countrySelect.append(option);
      });
    } catch (_) {
      setStatus('La liste automatique des pays n’a pas pu être chargée. Le bouton GPS reste disponible.', true);
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