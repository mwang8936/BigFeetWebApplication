import { Language } from '../models/enums';

export const getLanguageFile = (language: Language): string => {
	if (language === Language.ENGLISH) {
		return 'en';
	} else if (language === Language.SIMPLIFIED_CHINESE) {
		return 'cn_simp';
	} else if (language === Language.TRADITIONAL_CHINESE) {
		return 'cn_trad';
	} else {
		return 'en';
	}
};
