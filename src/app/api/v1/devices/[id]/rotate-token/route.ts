import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateDeviceToken } from '@/lib/security/telemetry';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. RBAC check: Verify requesting user is an administrator
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: deviceId } = await params;

    // 2. Verify device exists
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('id, serial_number')
      .eq('id', deviceId)
      .single();

    if (deviceError || !device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    // 3. Generate new device credentials
    const { rawToken, hashedToken } = generateDeviceToken();
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year expiration

    // 4. Save hashed credentials in database
    const { error: updateError } = await supabase
      .from('devices')
      .update({
        hashed_api_token: hashedToken,
        token_created_at: new Date().toISOString(),
        token_expires_at: expiresAt.toISOString(),
      })
      .eq('id', deviceId);

    if (updateError) {
      console.error('Failed to update device credentials:', updateError.message);
      return NextResponse.json({ error: 'Failed to rotate credentials' }, { status: 500 });
    }

    // 5. Return raw credentials (displayed ONLY once to admin)
    return NextResponse.json({
      success: true,
      device_id: device.id,
      serial_number: device.serial_number,
      token: rawToken,
      expires_at: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Token rotation failure:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
