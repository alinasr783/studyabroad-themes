-- Add client_id to existing tables and create necessary tables for the admin dashboard

-- Add client_id to existing tables
ALTER TABLE countries ADD COLUMN client_id uuid REFERENCES clients(id) DEFAULT NULL;
ALTER TABLE universities ADD COLUMN client_id uuid REFERENCES clients(id) DEFAULT NULL;
ALTER TABLE programs ADD COLUMN client_id uuid REFERENCES clients(id) DEFAULT NULL;
ALTER TABLE articles ADD COLUMN client_id uuid REFERENCES clients(id) DEFAULT NULL;
ALTER TABLE consultations ADD COLUMN client_id uuid REFERENCES clients(id) DEFAULT NULL;
ALTER TABLE contact_messages ADD COLUMN client_id uuid REFERENCES clients(id) DEFAULT NULL;

-- Add client_id to managers table
ALTER TABLE managers ADD COLUMN client_id uuid REFERENCES clients(id) DEFAULT NULL;

-- Create testimonials table
CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) NOT NULL,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  title_ar text,
  title_en text,
  content_ar text NOT NULL,
  content_en text NOT NULL,
  avatar_url text,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create site_settings table
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) NOT NULL UNIQUE,
  site_name_ar text DEFAULT 'موقع الدراسة بالخارج',
  site_name_en text DEFAULT 'Study Abroad Site',
  logo_url text,
  primary_color_1 text DEFAULT '#3b82f6',
  primary_color_2 text DEFAULT '#1e40af', 
  primary_color_3 text DEFAULT '#1e3a8a',
  whatsapp_number text,
  email text,
  office_location text,
  facebook_url text,
  instagram_url text,
  twitter_url text,
  linkedin_url text,
  show_countries_section boolean DEFAULT true,
  show_universities_section boolean DEFAULT true,
  show_programs_section boolean DEFAULT true,
  show_articles_section boolean DEFAULT true,
  show_testimonials_section boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Insert default client (ali)
INSERT INTO clients (id, name, slug) 
VALUES ('00000000-0000-0000-0000-000000000001', 'علي ناصر الدين', 'ali')
ON CONFLICT (slug) DO NOTHING;

-- Insert default manager
INSERT INTO managers (email, password, client_id) 
VALUES ('alinasreldin783@gmail.com', 'Alinasr89#', '00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (client_id, site_name_ar, site_name_en) 
VALUES ('00000000-0000-0000-0000-000000000001', 'موقع علي ناصر الدين للدراسة بالخارج', 'Ali Nasr Eldin Study Abroad')
ON CONFLICT (client_id) DO NOTHING;

-- Create RLS policies for testimonials
CREATE POLICY "Testimonials are viewable by everyone" ON testimonials
FOR SELECT USING (true);

-- Create RLS policies for site_settings  
CREATE POLICY "Site settings are viewable by everyone" ON site_settings
FOR SELECT USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();