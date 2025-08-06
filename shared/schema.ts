import { pgTable, text, serial, integer, boolean, timestamp, uuid, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Clients table - main organizations/websites
export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  logoUrl: text("logo_url"),
  primaryColor1: text("primary_color_1").notNull().default("#0066FF"),
  primaryColor2: text("primary_color_2").notNull().default("#3366FF"),
  primaryColor3: text("primary_color_3").notNull().default("#6699FF"),
  isActive: boolean("is_active").notNull().default(true),
  githubRepoUrl: text("github_repo_url"),
  vercelUrl: text("vercel_url"),
  deploymentStatus: text("deployment_status"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Managers table - admin users for each client
export const managers = pgTable("managers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  clientId: uuid("client_id").references(() => clients.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Countries table
export const countries = pgTable("countries", {
  id: uuid("id").primaryKey().defaultRandom(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  slug: text("slug").notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  imageUrl: text("image_url"),
  flagUrl: text("flag_url"),
  currency: text("currency"),
  language: text("language"),
  climate: text("climate"),
  studyCostMin: numeric("study_cost_min"),
  studyCostMax: numeric("study_cost_max"),
  livingCostMin: numeric("living_cost_min"),
  livingCostMax: numeric("living_cost_max"),
  visaRequirementsEn: text("visa_requirements_en"),
  visaRequirementsAr: text("visa_requirements_ar"),
  popularCities: text("popular_cities").array(),
  isTrending: boolean("is_trending").default(false),
  clientId: uuid("client_id").references(() => clients.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Universities table
export const universities = pgTable("universities", {
  id: uuid("id").primaryKey().defaultRandom(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  slug: text("slug").notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  imageUrl: text("image_url"),
  logoUrl: text("logo_url"),
  establishedYear: integer("established_year"),
  studentCount: integer("student_count"),
  internationalStudentCount: integer("international_student_count"),
  ranking: integer("ranking"),
  location: text("location"),
  website: text("website"),
  accreditation: text("accreditation"),
  facilities: text("facilities").array(),
  admissionRequirementsEn: text("admission_requirements_en"),
  admissionRequirementsAr: text("admission_requirements_ar"),
  isFeatured: boolean("is_featured").default(false),
  countryId: uuid("country_id").references(() => countries.id),
  clientId: uuid("client_id").references(() => clients.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Programs table
export const programs = pgTable("programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  slug: text("slug").notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  degreeLevel: text("degree_level").notNull(),
  fieldOfStudy: text("field_of_study").notNull(),
  durationYears: integer("duration_years"),
  durationMonths: integer("duration_months"),
  tuitionFee: numeric("tuition_fee"),
  language: text("language"),
  startDate: text("start_date"),
  applicationDeadline: text("application_deadline"),
  requirementsEn: text("requirements_en"),
  requirementsAr: text("requirements_ar"),
  careerProspectsEn: text("career_prospects_en"),
  careerProspectsAr: text("career_prospects_ar"),
  isFeatured: boolean("is_featured").default(false),
  universityId: uuid("university_id").references(() => universities.id),
  countryId: uuid("country_id").references(() => countries.id),
  clientId: uuid("client_id").references(() => clients.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Articles table
export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  slug: text("slug").notNull(),
  contentEn: text("content_en").notNull(),
  contentAr: text("content_ar").notNull(),
  excerptEn: text("excerpt_en"),
  excerptAr: text("excerpt_ar"),
  featuredImage: text("featured_image"),
  authorName: text("author_name"),
  authorAvatar: text("author_avatar"),
  category: text("category"),
  tags: text("tags").array(),
  readingTime: integer("reading_time"),
  viewsCount: integer("views_count").default(0),
  isFeatured: boolean("is_featured").default(false),
  isPublished: boolean("is_published").default(true),
  clientId: uuid("client_id").references(() => clients.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Consultations table
export const consultations = pgTable("consultations", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  studyLevel: text("study_level"),
  fieldOfInterest: text("field_of_interest"),
  countryPreference: text("country_preference"),
  budgetRange: text("budget_range"),
  preferredDate: text("preferred_date"),
  preferredTime: text("preferred_time"),
  message: text("message"),
  status: text("status").default("pending"),
  clientId: uuid("client_id").references(() => clients.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Contact Messages table
export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("unread"),
  clientId: uuid("client_id").references(() => clients.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  contentEn: text("content_en").notNull(),
  contentAr: text("content_ar").notNull(),
  rating: integer("rating").notNull().default(5),
  imageUrl: text("image_url"),
  university: text("university"),
  country: text("country"),
  program: text("program"),
  isPublished: boolean("is_published").default(true),
  clientId: uuid("client_id").references(() => clients.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Site Settings table
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").notNull().references(() => clients.id),
  siteNameEn: text("site_name_en"),
  siteNameAr: text("site_name_ar"),
  logoUrl: text("logo_url"),
  primaryColor1: text("primary_color_1"),
  primaryColor2: text("primary_color_2"),
  primaryColor3: text("primary_color_3"),
  email: text("email"),
  whatsappNumber: text("whatsapp_number"),
  officeLocation: text("office_location"),
  facebookUrl: text("facebook_url"),
  twitterUrl: text("twitter_url"),
  instagramUrl: text("instagram_url"),
  linkedinUrl: text("linkedin_url"),
  showCountriesSection: boolean("show_countries_section").default(true),
  showUniversitiesSection: boolean("show_universities_section").default(true),
  showProgramsSection: boolean("show_programs_section").default(true),
  showArticlesSection: boolean("show_articles_section").default(true),
  showTestimonialsSection: boolean("show_testimonials_section").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const clientsRelations = relations(clients, ({ many, one }) => ({
  managers: many(managers),
  countries: many(countries),
  universities: many(universities),
  programs: many(programs),
  articles: many(articles),
  consultations: many(consultations),
  contactMessages: many(contactMessages),
  testimonials: many(testimonials),
  siteSettings: one(siteSettings),
}));

export const managersRelations = relations(managers, ({ one }) => ({
  client: one(clients, {
    fields: [managers.clientId],
    references: [clients.id],
  }),
}));

export const countriesRelations = relations(countries, ({ one, many }) => ({
  client: one(clients, {
    fields: [countries.clientId],
    references: [clients.id],
  }),
  universities: many(universities),
  programs: many(programs),
}));

export const universitiesRelations = relations(universities, ({ one, many }) => ({
  client: one(clients, {
    fields: [universities.clientId],
    references: [clients.id],
  }),
  country: one(countries, {
    fields: [universities.countryId],
    references: [countries.id],
  }),
  programs: many(programs),
}));

export const programsRelations = relations(programs, ({ one }) => ({
  client: one(clients, {
    fields: [programs.clientId],
    references: [clients.id],
  }),
  country: one(countries, {
    fields: [programs.countryId],
    references: [countries.id],
  }),
  university: one(universities, {
    fields: [programs.universityId],
    references: [universities.id],
  }),
}));

// Insert schemas
export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertManagerSchema = createInsertSchema(managers).omit({
  id: true,
  createdAt: true,
});

export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUniversitySchema = createInsertSchema(universities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProgramSchema = createInsertSchema(programs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Manager = typeof managers.$inferSelect;
export type InsertManager = z.infer<typeof insertManagerSchema>;

export type Country = typeof countries.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;

export type University = typeof universities.$inferSelect;
export type InsertUniversity = z.infer<typeof insertUniversitySchema>;

export type Program = typeof programs.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
