import { faker } from '@faker-js/faker';
import { JobStatus, UserTier } from '@app/constants';
import type {
  InsertApplicationRow,
  InsertCompanyRow,
  InsertCredentialRow,
  InsertUserRow,
} from '../types';

const APPLICATION_ROLES = [
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack Engineer',
  'Software Engineer',
  'Platform Engineer',
  'Site Reliability Engineer',
  'DevOps Engineer',
  'Staff Engineer',
  'Engineering Manager',
] as const;

const APPLICATION_STATUSES = [
  JobStatus.ENTERED,
  JobStatus.APPLIED,
  JobStatus.INTERVIEW,
  JobStatus.OFFER,
  JobStatus.ACCEPTED,
  JobStatus.REJECTED,
] as const;

const APPLICATION_NOTES = [
  'Applied through company career page',
  'Reached out by recruiter',
  'Strong alignment with role requirements',
  'Pending recruiter screen',
  'Waiting on final interview feedback',
  'Referral from network',
] as const;

const normalizeEmailPart = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const createUserTier = () => {
  const randomWeight = faker.number.int({ min: 1, max: 100 });

  if (randomWeight <= 85) return UserTier.FREE;
  if (randomWeight <= 97) return UserTier.PREMIUM;

  return UserTier.ADMIN;
};

export const createUsers = (count: number, createdBy: string): InsertUserRow[] => {
  return Array.from({ length: count }, (_, index) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const emailPrefix = normalizeEmailPart(`${firstName}.${lastName}.${index + 1}`);

    return {
      email: `${emailPrefix}@example.com`,
      firstName,
      lastName,
      isLocked: faker.datatype.boolean({ probability: 0.03 }),
      tier: createUserTier(),
      lastLoginAt: faker.datatype.boolean({ probability: 0.7 })
        ? faker.date.recent({ days: 90 })
        : undefined,
      createdBy,
    };
  });
};

export const createCompanies = (count: number, createdBy: string): InsertCompanyRow[] => {
  return Array.from({ length: count }, (_, index) => {
    const companyName = faker.company.name();
    const domain = `${normalizeEmailPart(faker.internet.domainWord())}-${index + 1}.example.com`;

    return {
      name: companyName,
      website: `https://${domain}`,
      abn: index % 3 === 0 ? `53${String(index + 1).padStart(9, '0')}` : undefined,
      jobDescription: faker.datatype.boolean({ probability: 0.8 })
        ? faker.company.catchPhrase()
        : undefined,
      createdBy,
    };
  });
};

export const createCredentials = (
  userIds: string[],
  passwordHash: string,
): InsertCredentialRow[] => {
  return userIds.map((userId) => ({
    userId,
    hash: passwordHash,
    valid: true,
    invalidatedAt: undefined,
  }));
};

export const createApplications = (options: {
  companyIds: string[];
  createdBy: string;
  maxApplicationsPerUser: number;
  userIds: string[];
}): InsertApplicationRow[] => {
  const applications: InsertApplicationRow[] = [];
  const { userIds, companyIds, maxApplicationsPerUser, createdBy } = options;

  for (const userId of userIds) {
    const totalApplications = faker.number.int({ min: 1, max: maxApplicationsPerUser });

    for (let applicationIndex = 0; applicationIndex < totalApplications; applicationIndex += 1) {
      applications.push({
        userId,
        companyId: faker.helpers.arrayElement(companyIds),
        role: faker.helpers.arrayElement(APPLICATION_ROLES),
        status: faker.helpers.arrayElement(APPLICATION_STATUSES),
        url: faker.datatype.boolean({ probability: 0.75 }) ? faker.internet.url() : undefined,
        notes: faker.datatype.boolean({ probability: 0.7 })
          ? faker.helpers.arrayElement(APPLICATION_NOTES)
          : undefined,
        createdBy,
      });
    }
  }

  return applications;
};
