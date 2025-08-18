import { XpressWalletSDK } from '../src';

async function teamManagementExample() {
  const sdk = new XpressWalletSDK({
    baseUrl: 'https://api.xpresswallet.com'
  });

  // Login as admin
  await sdk.auth.login({
    email: 'admin@example.com',
    password: 'password123'
  });

  try {
    // Get all available permissions
    const permissions = await sdk.team.getAllPermissions();
    console.log('Available permissions:', permissions.data?.map(p => p.name));

    // Create a custom role
    const newRole = await sdk.team.createRole({
      name: 'Customer Support Agent',
      permissions: [
        'BROWSE_CUSTOMERS',
        'UPDATE_CUSTOMERS',
        'BROWSE_CUSTOMER_WALLETS',
        'BROWSE_TRANSACTIONS'
      ]
    });

    console.log('Created role:', newRole.data?.name);

    // Invite team member with the new role
    await sdk.team.inviteTeamMember({
      roleId: newRole.data!.id,
      email: 'support@example.com',
      approvalLimit: 5000
    });

    console.log('Team member invited successfully');

    // Get all team members
    const teamMembers = await sdk.team.getTeamMembers();
    console.log('Team members:', teamMembers.data?.map(m => `${m.firstName} ${m.lastName} (${m.role})`));

    // Get pending invitations
    const invitations = await sdk.team.getAllInvitations();
    console.log('Pending invitations:', invitations.data?.filter(i => !i.accepted));

    // Get all roles
    const roles = await sdk.team.getAllRoles();
    console.log('Available roles:', roles.data?.map(r => r.name));

  } catch (error) {
    console.error('Team management failed:', error);
  }
}

teamManagementExample().catch(console.error);