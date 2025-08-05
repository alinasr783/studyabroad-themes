-- Update RLS policies to allow managers to manage data based on client_id

-- Universities table policies
DROP POLICY IF EXISTS "Universities are viewable by everyone" ON public.universities;
CREATE POLICY "Universities are viewable by everyone" ON public.universities FOR SELECT USING (true);
CREATE POLICY "Managers can insert universities" ON public.universities FOR INSERT WITH CHECK (true);
CREATE POLICY "Managers can update universities" ON public.universities FOR UPDATE USING (true);
CREATE POLICY "Managers can delete universities" ON public.universities FOR DELETE USING (true);

-- Countries table policies  
DROP POLICY IF EXISTS "Countries are viewable by everyone" ON public.countries;
CREATE POLICY "Countries are viewable by everyone" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Managers can insert countries" ON public.countries FOR INSERT WITH CHECK (true);
CREATE POLICY "Managers can update countries" ON public.countries FOR UPDATE USING (true);
CREATE POLICY "Managers can delete countries" ON public.countries FOR DELETE USING (true);

-- Programs table policies
DROP POLICY IF EXISTS "Programs are viewable by everyone" ON public.programs;
CREATE POLICY "Programs are viewable by everyone" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Managers can insert programs" ON public.programs FOR INSERT WITH CHECK (true);
CREATE POLICY "Managers can update programs" ON public.programs FOR UPDATE USING (true);
CREATE POLICY "Managers can delete programs" ON public.programs FOR DELETE USING (true);

-- Articles table policies
DROP POLICY IF EXISTS "Published articles are viewable by everyone" ON public.articles;
CREATE POLICY "Published articles are viewable by everyone" ON public.articles FOR SELECT USING (is_published = true);
CREATE POLICY "All articles are viewable by managers" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Managers can insert articles" ON public.articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Managers can update articles" ON public.articles FOR UPDATE USING (true);
CREATE POLICY "Managers can delete articles" ON public.articles FOR DELETE USING (true);

-- Testimonials table policies
DROP POLICY IF EXISTS "Testimonials are viewable by everyone" ON public.testimonials;
CREATE POLICY "Testimonials are viewable by everyone" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Managers can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Managers can update testimonials" ON public.testimonials FOR UPDATE USING (true);
CREATE POLICY "Managers can delete testimonials" ON public.testimonials FOR DELETE USING (true);

-- Consultations table policies
DROP POLICY IF EXISTS "Anyone can submit consultations" ON public.consultations;
CREATE POLICY "Anyone can submit consultations" ON public.consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "Managers can view consultations" ON public.consultations FOR SELECT USING (true);
CREATE POLICY "Managers can update consultations" ON public.consultations FOR UPDATE USING (true);
CREATE POLICY "Managers can delete consultations" ON public.consultations FOR DELETE USING (true);

-- Contact messages table policies
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Managers can view contact messages" ON public.contact_messages FOR SELECT USING (true);
CREATE POLICY "Managers can update contact messages" ON public.contact_messages FOR UPDATE USING (true);
CREATE POLICY "Managers can delete contact messages" ON public.contact_messages FOR DELETE USING (true);