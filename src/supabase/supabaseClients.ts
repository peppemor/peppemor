import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pernbjndcinuzldyhfam.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlcm5iam5kY2ludXpsZHloZmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMDAwMDgsImV4cCI6MjA1OTc3NjAwOH0.Hzv2OFiXRO4mAQ_2UzSFNwNninmHOAVP5dmgUPPq488'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)