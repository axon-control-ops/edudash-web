#!/usr/bin/env node

/**
 * Fix Zanele Makunyane organization assignment and sync
 */

import { createClient } from '@supabase/supabase-js';

const EDUDASH_URL = 'https://lvvvjywrmpcqrpvuptdi.supabase.co';
const EDUDASH_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2dnZqeXdybXBjcXJwdnVwdGRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzAzNzgzOCwiZXhwIjoyMDY4NjEzODM4fQ.p8cRGywZP4qVglovv-T3VCDi9evfeCVZEBQM2LTeCmc';

const EDUSITE_URL = 'https://bppuzibjlxgfwrujzfsz.supabase.co';
const EDUSITE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwcHV6aWJqbHhnZndydWp6ZnN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzc0MzczMCwiZXhwIjoyMDY5MzE5NzMwfQ.5zPPaAo1Jj5-SknVMDwvo1DBCXhmS60obAEckJV7o1I';

const edudashClient = createClient(EDUDASH_URL, EDUDASH_SERVICE_KEY);
const edusiteClient = createClient(EDUSITE_URL, EDUSITE_SERVICE_KEY);

const EMAIL = 'zanelemakunyane@gmail.com';

async function main() {
  console.log('\n============================================');
  console.log('FIX: Zanele Makunyane Organization & Sync');
  console.log('============================================\n');

  // Step 1: Get registration request details
  console.log('📍 Step 1: Fetching registration request...');
  
  const { data: regRequest, error: regError } = await edusiteClient
    .from('organization_registration_requests')
    .select('*')
    .eq('email', EMAIL)
    .single();

  if (regError || !regRequest) {
    console.error('❌ Registration request not found:', regError?.message);
    process.exit(1);
  }

  const orgId = regRequest.created_organization_id;
  
  console.log('✅ Registration found:');
  console.log(`   Organization: ${regRequest.organization_name}`);
  console.log(`   Org ID: ${orgId}`);
  console.log(`   Status: ${regRequest.status}\n`);

  // Step 2: Get organization details from EduSitePro
  console.log('📍 Step 2: Fetching organization from EduSitePro...');
  
  const { data: edusiteOrg, error: orgError } = await edusiteClient
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single();

  if (orgError || !edusiteOrg) {
    console.error('❌ Organization not found in EduSitePro:', orgError?.message);
    process.exit(1);
  }

  console.log('✅ Organization found:');
  console.log(`   Name: ${edusiteOrg.name}`);
  console.log(`   Slug: ${edusiteOrg.slug}\n`);

  // Step 3: Update profile in EduSitePro with org_id
  console.log('📍 Step 3: Updating profile in EduSitePro...');
  
  const { error: updateError } = await edusiteClient
    .from('profiles')
    .update({ organization_id: orgId })
    .eq('email', EMAIL);

  if (updateError) {
    console.error('❌ Failed to update profile:', updateError.message);
    process.exit(1);
  }

  console.log('✅ Profile updated with organization_id\n');

  // Step 4: Create organization in EduDashPro
  console.log('📍 Step 4: Creating organization in EduDashPro...');
  
  const { error: edudashOrgError } = await edudashClient
    .from('organizations')
    .upsert({
      id: orgId, // Use SAME ID
      name: edusiteOrg.name,
      slug: edusiteOrg.slug,
      status: 'active'
    }, {
      onConflict: 'id'
    });

  if (edudashOrgError) {
    console.error('❌ Failed to create organization in EduDashPro:', edudashOrgError.message);
    process.exit(1);
  }

  console.log('✅ Organization created in EduDashPro\n');

  // Step 5: Get user from EduSitePro auth
  console.log('📍 Step 5: Fetching user from EduSitePro auth...');
  
  const { data: edusiteProfile } = await edusiteClient
    .from('profiles')
    .select('*')
    .eq('email', EMAIL)
    .single();

  if (!edusiteProfile) {
    console.error('❌ Profile not found in EduSitePro');
    process.exit(1);
  }

  const userId = edusiteProfile.id;
  console.log(`✅ User ID: ${userId}\n`);

  // Step 6: Create user in EduDashPro auth
  console.log('📍 Step 6: Creating user in EduDashPro auth...');
  
  const { data: authUser } = await edudashClient.auth.admin.getUserById(userId);

  if (!authUser.user) {
    console.log('   Creating new auth user...');
    
    const { error: createError } = await edudashClient.auth.admin.createUser({
      id: userId, // Use SAME user ID
      email: EMAIL,
      password: 'TempPassword123!',
      email_confirm: true,
      user_metadata: {
        full_name: edusiteProfile.full_name,
        role: 'admin',
        organization_id: orgId
      }
    });

    if (createError) {
      console.error('   ❌ Failed to create user:', createError.message);
      process.exit(1);
    }
    
    console.log('   ✅ User created in EduDashPro auth');
  } else {
    console.log('   ✅ User already exists in EduDashPro auth');
  }

  // Step 7: Create profile in EduDashPro
  console.log('\n📍 Step 7: Creating profile in EduDashPro...');
  
  const names = edusiteProfile.full_name.split(' ');
  const firstName = names[0] || edusiteProfile.full_name;
  const lastName = names.slice(1).join(' ') || '';

  const { error: profileError } = await edudashClient
    .from('profiles')
    .upsert({
      id: userId,
      email: EMAIL,
      first_name: firstName,
      last_name: lastName,
      role: 'admin',
      organization_id: orgId
    }, {
      onConflict: 'id'
    });

  if (profileError) {
    console.error('❌ Failed to create profile:', profileError.message);
    process.exit(1);
  }

  console.log('✅ Profile created in EduDashPro\n');

  // Summary
  console.log('============================================');
  console.log('✅ FIX COMPLETE');
  console.log('============================================\n');
  console.log('🏢 Organization:', edusiteOrg.name);
  console.log('🆔 Organization ID:', orgId);
  console.log('📧 Email:', EMAIL);
  console.log('\n🌐 Platforms:');
  console.log('   📝 EduSitePro (CMS): https://edusitepro.edudashpro.org.za');
  console.log('   🎓 EduDashPro (LMS): https://edudashpro.org.za');
  console.log('\n✨ Same organization_id used in both databases\n');
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
