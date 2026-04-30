import { JobStatus } from '@app/constants';

export const users = [
  {
    email: 'alice@example.com',
    firstName: 'Alice',
    lastName: 'Smith',
    passwordHash: 'hash_placeholder',
    isAdmin: false,
  },
  {
    email: 'bob@example.com',
    firstName: 'Bob',
    lastName: 'Jones',
    passwordHash: 'hash_placeholder',
    isAdmin: false,
  },
  {
    email: 'carol@example.com',
    firstName: 'Carol',
    lastName: 'White',
    passwordHash: 'hash_placeholder',
    isAdmin: false,
  },
];

export const companies = [
  {
    name: 'Atlassian',
    website: 'https://atlassian.com',
    abn: '53102443916',
    jobDescription: 'Building collaboration tools',
  },
  { name: 'Canva', website: 'https://canva.com', abn: null, jobDescription: null },
  {
    name: 'Afterpay',
    website: 'https://afterpay.com',
    abn: null,
    jobDescription: 'Buy now, pay later',
  },
  {
    name: 'REA Group',
    website: 'https://realestate.com.au',
    abn: '54008559269',
    jobDescription: 'Real estate listings',
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
  },
  {
    userIndex: 0,
    companyIndex: 1,
    role: 'Full Stack Developer',
    status: JobStatus.APPLIED,
    url: null,
    notes: null,
  },
  {
    userIndex: 1,
    companyIndex: 2,
    role: 'Backend Engineer',
    status: JobStatus.OFFER,
    url: 'https://afterpay.com/jobs/2',
    notes: 'Good culture fit',
  },
  {
    userIndex: 1,
    companyIndex: 3,
    role: 'Platform Engineer',
    status: JobStatus.REJECTED,
    url: null,
    notes: 'Rejected after round 2',
  },
  {
    userIndex: 2,
    companyIndex: 0,
    role: 'DevOps Engineer',
    status: JobStatus.APPLIED,
    url: null,
    notes: null,
  },
  {
    userIndex: 2,
    companyIndex: 3,
    role: 'Software Engineer',
    status: JobStatus.ACCEPTED,
    url: 'https://rea.com/jobs/5',
    notes: 'Accepted offer!',
  },
];
