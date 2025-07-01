
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lunahzzxyauygssnbimx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1bmFoenp4eWF1eWdzc25iaW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODgzNzQsImV4cCI6MjA2Njk2NDM3NH0.y0BiStE78Y7_9mPHqRceBTmhhipiVgsULXTi4-Id1fA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
