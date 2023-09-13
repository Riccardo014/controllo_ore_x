export const ROLE_SEED: any = [
  {
    name: 'SuperAdmin',
    permissions: {
      description: 'permission1',
      active: true,
    },
    isModifiable: false,
  },
  {
    name: 'Admin',
    permissions: {
      description: 'permission1',
      active: true,
    },
    isModifiable: true,
  },
  {
    name: 'Collaborator',
    permissions: {
      description: 'permission1',
      active: false,
    },
    isModifiable: true,
  },
];
