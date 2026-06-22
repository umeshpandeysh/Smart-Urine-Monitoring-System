import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // 1. Try querying different possible tables to locate the schema
    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    const { data: devices, error: devError } = await supabase
      .from('devices')
      .select('id')
      .limit(1);

    if (profError && devError) {
      return NextResponse.json({ 
        success: false, 
        step: 'database_query', 
        error: `Profiles error: ${profError.message} | Devices error: ${devError.message}` 
      }, { status: 500 });
    }

    // 2. Query auth configuration
    const { data: authConfig, error: authError } = await supabase.auth.getSession();
    if (authError) {
      return NextResponse.json({ 
        success: false, 
        step: 'auth_connection', 
        error: authError.message 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection verified successfully!',
      database: {
        connection: 'established',
        profilesFound: profiles,
        devicesFound: devices
      },
      auth: {
        connection: 'established',
        hasSession: !!authConfig.session
      },
      env: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing'
      }
    });

  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      step: 'unexpected_error', 
      error: err.message 
    }, { status: 500 });
  }
}
