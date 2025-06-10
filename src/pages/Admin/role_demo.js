import pJson from '@/cfg/permissionTemplate.json';

export default [
  {
    ID: 1,
    Role: 'Superadmin',
    Created: Date.now() - 3000000,
    Updated: Date.now() - 3000,
    Status: 'enable',
    Permission: pJson,
  },
  {
    ID: 2,
    Role: 'Vendor',
    Created: Date.now() - 4000000,
    Updated: Date.now() - 4000,
    Status: 'enable',
    Permission: pJson,
  },
  {
    ID: 3,
    Role: 'Farmer',
    Created: Date.now() - 5000000,
    Updated: Date.now() - 5000,
    Status: 'enable',
    Permission: pJson,
  },
  {
    ID: 4,
    Role: 'Hacker',
    Created: Date.now() - 6000000,
    Updated: Date.now() - 6000,
    Status: 'enable',
    Permission: pJson,
  },
];
