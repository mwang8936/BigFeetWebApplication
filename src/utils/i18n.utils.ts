import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import english_translation from '../locales/en/translation.json';
import chinese_simplified_translation from '../locales/cn_simp/translation.json';
import chinese_traditional_translation from '../locales/cn_trad/translation.json';

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
	debug: true,
});

export default i18n;
