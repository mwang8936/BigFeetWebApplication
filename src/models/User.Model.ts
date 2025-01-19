import Employee from './Employee.Model';
import { Language } from './enums';

export default interface User extends Employee {
	language: Language;
}
