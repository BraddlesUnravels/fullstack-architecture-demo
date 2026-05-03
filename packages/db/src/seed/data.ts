import { JobStatus } from '@app/constants';
const SEED_CREATED_BY_USER_ID = '00000000-0000-0000-0000-000000000001';

export const users = [
  {
    email: 'alice@example.com',
    firstName: 'Alice',
    lastName: 'Smith',
    passwordHash: 'hash_placeholder',
    isAdmin: false,
    createdBy: SEED_CREATED_BY_USER_ID,
  },
  {
    email: 'bob@example.com',
    firstName: 'Bob',
    lastName: 'Jones',
    passwordHash: 'hash_placeholder',
    isAdmin: false,
    createdBy: SEED_CREATED_BY_USER_ID,
  },
  {
    email: 'carol@example.com',
    firstName: 'Carol',
    lastName: 'White',
    passwordHash: 'hash_placeholder',
    isAdmin: false,
    createdBy: SEED_CREATED_BY_USER_ID,
  },
];

export const companies = [
  {
    name: 'Atlassian',
    website: 'https://atlassian.com',
    abn: '53102443916',
    jobDescription: 'Building collaboration tools',
    createdBy: SEED_CREATED_BY_USER_ID,
  },
  {
    name: 'Canva',
    website: 'https://canva.com',
    abn: null,
    jobDescription: null,
    createdBy: SEED_CREATED_BY_USER_ID,
  },
  {
    name: 'Afterpay',
    website: 'https://afterpay.com',
    abn: null,
    jobDescription: 'Buy now, pay later',
    createdBy: SEED_CREATED_BY_USER_ID,
  },
  {
    name: 'REA Group',
    website: 'https://realestate.com.au',
    abn: '54008559269',
    jobDescription: 'Real estate listings',
    createdBy: SEED_CREATED_BY_USER_ID,
  },
];

// userId/companyId are resolved by index after insert
export const applications = [
  {
    userIndex: 0,
    companyIndex: 0,
    role: 'Senior Frontend Engineer',
    status: JobStatus.INTERVIEW,
    url: 'https://atlassian.com/jobs/1',
    notes: 'Referred by a friend',
    createdBy: SEED_CREATED_BY_USER_ID,
  },
  {
    userIndex: 0,
    companyIndex: 1,
    role: 'Full Stack Developer',
    status: JobStatus.APPLIED,
    url: null,
    notes: null,
    createdBy: SEED_CREATED_BY_USER_ID,
  },
  {
    userIndex: 1,
    companyIndex: 2,
    role: 'Backend Engineer',
    status: JobStatus.OFFER,
    url: 'https://afterpay.com/jobs/2',
    notes: 'Good culture fit',
    createdBy: SEED_CREATED_BY_USER_ID,
  },
  {
    userIndex: 1,
    companyIndex: 3,
    role: 'Platform Engineer',
    status: JobStatus.REJECTED,
    url: null,
    notes: 'Rejected after round 2',
    createdBy: SEED_CREATED_BY_USER_ID,
  },
  {
    userIndex: 2,
    companyIndex: 0,
    role: 'DevOps Engineer',
    status: JobStatus.APPLIED,
    url: null,
    notes: null,
    createdBy: SEED_CREATED_BY_USER_ID,
  },
  {
    userIndex: 2,
    companyIndex: 3,
    role: 'Software Engineer',
    status: JobStatus.ACCEPTED,
    url: 'https://rea.com/jobs/5',
    notes: 'Accepted offer!',
    createdBy: SEED_CREATED_BY_USER_ID,
  },
];
