export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          type: 'hospital' | 'airport' | 'smart_city' | 'corporate';
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['organizations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>;
      };
      locations: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          address: string | null;
          city: string | null;
          country: string | null;
          latitude: number | null;
          longitude: number | null;
          active_device_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['locations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['locations']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          first_name: string | null;
          last_name: string | null;
          role: 'patient' | 'admin' | 'operator';
          weight_kg: number | null;
          timezone: string;
          risk_level: 'low' | 'medium' | 'high' | null;
          location_id: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      devices: {
        Row: {
          id: string;
          location_id: string;
          serial_number: string;
          model: string;
          firmware_version: string | null;
          status: 'online' | 'offline' | 'maintenance' | 'error';
          battery_level: number | null;
          last_seen_at: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['devices']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['devices']['Insert']>;
      };
      sensor_readings: {
        Row: {
          id: string;
          device_id: string;
          profile_id: string | null;
          ph: number | null;
          tds_ppm: number | null;
          turbidity_ntu: number | null;
          temperature_c: number | null;
          flow_rate_ml_min: number | null;
          total_volume_ml: number | null;
          color_r: number | null;
          color_g: number | null;
          color_b: number | null;
          hydration_index: number | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sensor_readings']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['sensor_readings']['Insert']>;
      };
      reports: {
        Row: {
          id: string;
          profile_id: string;
          sensor_reading_id: string | null;
          title: string;
          summary: string | null;
          ai_summary: string | null;
          status: 'pending' | 'processing' | 'complete' | 'error';
          pdf_url: string | null;
          verification_hash: string | null;
          parameters: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          message: string;
          type: 'info' | 'warning' | 'critical' | 'success';
          read: boolean;
          action_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      device_telemetry: {
        Row: {
          id: string;
          device_id: string;
          cpu_temp: number | null;
          wifi_rssi: number | null;
          free_heap: number | null;
          uptime_seconds: number | null;
          error_code: string | null;
          recorded_at: string;
        };
        Insert: Omit<Database['public']['Tables']['device_telemetry']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['device_telemetry']['Insert']>;
      };
      bladder_diary_entries: {
        Row: {
          id: string;
          profile_id: string;
          recorded_at: string;
          type: 'INTAKE' | 'VOID' | 'LEAK';
          volume_ml: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bladder_diary_entries']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bladder_diary_entries']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'patient' | 'admin' | 'operator';
      device_status: 'online' | 'offline' | 'maintenance' | 'error';
      report_status: 'pending' | 'processing' | 'complete' | 'error';
      notification_type: 'info' | 'warning' | 'critical' | 'success';
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];
