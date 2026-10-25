import { fakerEN_IN as faker } from '@faker-js/faker';

export type FormData = {
  name: string;
  fatherName: string;
  postalAddress: string;
  personalAddress: string;
  sex: 'Male' | 'Female';
  pinCode: string;
  email: string;
};

export function generateFormData(): FormData {
  return {
    name: faker.person.fullName(),
    fatherName: faker.person.fullName({ sex: 'male' }),
    postalAddress: faker.location.streetAddress(),
    personalAddress: faker.location.streetAddress(),
    sex: faker.helpers.arrayElement(['Male', 'Female']),
    pinCode: faker.string.numeric(6),          // Indian PIN codes are 6 digits
    email: faker.internet.email(),
  };
}