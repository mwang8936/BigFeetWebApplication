import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import english_translation from '../locales/en/translation.json';
import chinese_simplified_translation from '../locales/cn_simp/translation.json';
import chinese_traditional_translation from '../locales/cn_trad/translation.json';

import { Language } from '../models/enums';

/**
 * Returns the language code for the specified Language enum value.
 *
 * @param language - The Language enum value to convert to a language code.
 * @returns A string representing the language code.
 */
export const getLanguageFile = (language: Language): string => {
	if (language === Language.ENGLISH) {
		return 'en'; // English language code.
	} else if (language === Language.SIMPLIFIED_CHINESE) {
		return 'cn_simp'; // Simplified Chinese language code.
	} else if (language === Language.TRADITIONAL_CHINESE) {
		return 'cn_trad'; // Traditional Chinese language code.
	} else {
		return 'en'; // Default to English if no match is found.
	}
};

const resources = {
	en: {
		translation: english_translation,
	},
	cn_simp: {
		translation: chinese_simplified_translation,
	},
	cn_trad: {
		translation: chinese_traditional_translation,
	},
};

i18n.use(initReactI18next).init({
	resources,
	fallbackLng: 'en',
	// debug: true,
});

export default i18n;
