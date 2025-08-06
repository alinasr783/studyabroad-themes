import { db } from "./db";
import { eq, and, desc, count } from "drizzle-orm";
import {
  clients,
  managers,
  countries,
  universities,
  programs,
  articles,
  consultations,
  contactMessages,
  testimonials,
  siteSettings,
  type Client,
  type Manager,
  type Country,
  type University,
  type Program,
  type Article,
  type Consultation,
  type ContactMessage,
  type Testimonial,
  type SiteSettings,
  type InsertClient,
  type InsertManager,
  type InsertCountry,
  type InsertUniversity,
  type InsertProgram,
  type InsertArticle,
  type InsertConsultation,
  type InsertContactMessage,
  type InsertTestimonial,
  type InsertSiteSettings,
} from "@shared/schema";

export interface IStorage {
  // Auth methods
  authenticateManager(email: string, password: string): Promise<Manager & { client: Client } | null>;
  
  // Clients
  getClient(id: string): Promise<Client | undefined>;
  getClientBySlug(slug: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client>;
  
  // Countries
  getCountries(clientId?: string): Promise<Country[]>;
  getCountry(id: string): Promise<Country | undefined>;
  getCountryBySlug(slug: string, clientId?: string): Promise<Country | undefined>;
  createCountry(country: InsertCountry): Promise<Country>;
  updateCountry(id: string, country: Partial<InsertCountry>): Promise<Country>;
  deleteCountry(id: string): Promise<void>;
  
  // Universities
  getUniversities(clientId?: string, countryId?: string): Promise<University[]>;
  getUniversity(id: string): Promise<University | undefined>;
  getUniversityBySlug(slug: string, clientId?: string): Promise<University | undefined>;
  createUniversity(university: InsertUniversity): Promise<University>;
  updateUniversity(id: string, university: Partial<InsertUniversity>): Promise<University>;
  deleteUniversity(id: string): Promise<void>;
  
  // Programs
  getPrograms(clientId?: string, universityId?: string, countryId?: string): Promise<Program[]>;
  getProgram(id: string): Promise<Program | undefined>;
  getProgramBySlug(slug: string, clientId?: string): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: string, program: Partial<InsertProgram>): Promise<Program>;
  deleteProgram(id: string): Promise<void>;
  
  // Articles
  getArticles(clientId?: string): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  getArticleBySlug(slug: string, clientId?: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: string): Promise<void>;
  
  // Consultations
  getConsultations(clientId?: string): Promise<Consultation[]>;
  getConsultation(id: string): Promise<Consultation | undefined>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  updateConsultation(id: string, consultation: Partial<InsertConsultation>): Promise<Consultation>;
  
  // Contact Messages
  getContactMessages(clientId?: string): Promise<ContactMessage[]>;
  getContactMessage(id: string): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessage(id: string, message: Partial<InsertContactMessage>): Promise<ContactMessage>;
  
  // Testimonials
  getTestimonials(clientId?: string): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial>;
  deleteTestimonial(id: string): Promise<void>;
  
  // Site Settings
  getSiteSettings(clientId: string): Promise<SiteSettings | undefined>;
  updateSiteSettings(clientId: string, settings: Partial<InsertSiteSettings>): Promise<SiteSettings>;
  
  // Dashboard stats
  getDashboardStats(clientId: string): Promise<{
    countries: number;
    universities: number;
    programs: number;
    articles: number;
    consultations: number;
    messages: number;
    testimonials: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Auth methods
  async authenticateManager(email: string, password: string): Promise<Manager & { client: Client } | null> {
    const result = await db
      .select()
      .from(managers)
      .leftJoin(clients, eq(managers.clientId, clients.id))
      .where(and(eq(managers.email, email), eq(managers.password, password)))
      .limit(1);
    
    if (result.length === 0 || !result[0].clients) {
      return null;
    }
    
    return {
      ...result[0].managers,
      client: result[0].clients,
    };
  }
  
  // Clients
  async getClient(id: string): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
    return result[0];
  }
  
  async getClientBySlug(slug: string): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.slug, slug)).limit(1);
    return result[0];
  }
  
  async createClient(client: InsertClient): Promise<Client> {
    const result = await db.insert(clients).values(client).returning();
    return result[0];
  }
  
  async updateClient(id: string, client: Partial<InsertClient>): Promise<Client> {
    const result = await db.update(clients).set(client).where(eq(clients.id, id)).returning();
    return result[0];
  }
  
  // Countries
  async getCountries(clientId?: string): Promise<Country[]> {
    let query = db.select().from(countries);
    if (clientId) {
      query = query.where(eq(countries.clientId, clientId));
    }
    return await query.orderBy(desc(countries.createdAt));
  }
  
  async getCountry(id: string): Promise<Country | undefined> {
    const result = await db.select().from(countries).where(eq(countries.id, id)).limit(1);
    return result[0];
  }
  
  async getCountryBySlug(slug: string, clientId?: string): Promise<Country | undefined> {
    let query = db.select().from(countries).where(eq(countries.slug, slug));
    if (clientId) {
      query = query.where(and(eq(countries.slug, slug), eq(countries.clientId, clientId)));
    }
    const result = await query.limit(1);
    return result[0];
  }
  
  async createCountry(country: InsertCountry): Promise<Country> {
    const result = await db.insert(countries).values(country).returning();
    return result[0];
  }
  
  async updateCountry(id: string, country: Partial<InsertCountry>): Promise<Country> {
    const result = await db.update(countries).set(country).where(eq(countries.id, id)).returning();
    return result[0];
  }
  
  async deleteCountry(id: string): Promise<void> {
    await db.delete(countries).where(eq(countries.id, id));
  }
  
  // Universities
  async getUniversities(clientId?: string, countryId?: string): Promise<University[]> {
    let query = db.select().from(universities);
    const conditions = [];
    
    if (clientId) {
      conditions.push(eq(universities.clientId, clientId));
    }
    if (countryId) {
      conditions.push(eq(universities.countryId, countryId));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(universities.createdAt));
  }
  
  async getUniversity(id: string): Promise<University | undefined> {
    const result = await db.select().from(universities).where(eq(universities.id, id)).limit(1);
    return result[0];
  }
  
  async getUniversityBySlug(slug: string, clientId?: string): Promise<University | undefined> {
    let query = db.select().from(universities).where(eq(universities.slug, slug));
    if (clientId) {
      query = query.where(and(eq(universities.slug, slug), eq(universities.clientId, clientId)));
    }
    const result = await query.limit(1);
    return result[0];
  }
  
  async createUniversity(university: InsertUniversity): Promise<University> {
    const result = await db.insert(universities).values(university).returning();
    return result[0];
  }
  
  async updateUniversity(id: string, university: Partial<InsertUniversity>): Promise<University> {
    const result = await db.update(universities).set(university).where(eq(universities.id, id)).returning();
    return result[0];
  }
  
  async deleteUniversity(id: string): Promise<void> {
    await db.delete(universities).where(eq(universities.id, id));
  }
  
  // Programs
  async getPrograms(clientId?: string, universityId?: string, countryId?: string): Promise<Program[]> {
    let query = db.select().from(programs);
    const conditions = [];
    
    if (clientId) {
      conditions.push(eq(programs.clientId, clientId));
    }
    if (universityId) {
      conditions.push(eq(programs.universityId, universityId));
    }
    if (countryId) {
      conditions.push(eq(programs.countryId, countryId));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(programs.createdAt));
  }
  
  async getProgram(id: string): Promise<Program | undefined> {
    const result = await db.select().from(programs).where(eq(programs.id, id)).limit(1);
    return result[0];
  }
  
  async getProgramBySlug(slug: string, clientId?: string): Promise<Program | undefined> {
    let query = db.select().from(programs).where(eq(programs.slug, slug));
    if (clientId) {
      query = query.where(and(eq(programs.slug, slug), eq(programs.clientId, clientId)));
    }
    const result = await query.limit(1);
    return result[0];
  }
  
  async createProgram(program: InsertProgram): Promise<Program> {
    const result = await db.insert(programs).values(program).returning();
    return result[0];
  }
  
  async updateProgram(id: string, program: Partial<InsertProgram>): Promise<Program> {
    const result = await db.update(programs).set(program).where(eq(programs.id, id)).returning();
    return result[0];
  }
  
  async deleteProgram(id: string): Promise<void> {
    await db.delete(programs).where(eq(programs.id, id));
  }
  
  // Articles
  async getArticles(clientId?: string): Promise<Article[]> {
    let query = db.select().from(articles);
    if (clientId) {
      query = query.where(eq(articles.clientId, clientId));
    }
    return await query.orderBy(desc(articles.createdAt));
  }
  
  async getArticle(id: string): Promise<Article | undefined> {
    const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    return result[0];
  }
  
  async getArticleBySlug(slug: string, clientId?: string): Promise<Article | undefined> {
    let query = db.select().from(articles).where(eq(articles.slug, slug));
    if (clientId) {
      query = query.where(and(eq(articles.slug, slug), eq(articles.clientId, clientId)));
    }
    const result = await query.limit(1);
    return result[0];
  }
  
  async createArticle(article: InsertArticle): Promise<Article> {
    const result = await db.insert(articles).values(article).returning();
    return result[0];
  }
  
  async updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article> {
    const result = await db.update(articles).set(article).where(eq(articles.id, id)).returning();
    return result[0];
  }
  
  async deleteArticle(id: string): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }
  
  // Consultations
  async getConsultations(clientId?: string): Promise<Consultation[]> {
    let query = db.select().from(consultations);
    if (clientId) {
      query = query.where(eq(consultations.clientId, clientId));
    }
    return await query.orderBy(desc(consultations.createdAt));
  }
  
  async getConsultation(id: string): Promise<Consultation | undefined> {
    const result = await db.select().from(consultations).where(eq(consultations.id, id)).limit(1);
    return result[0];
  }
  
  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    const result = await db.insert(consultations).values(consultation).returning();
    return result[0];
  }
  
  async updateConsultation(id: string, consultation: Partial<InsertConsultation>): Promise<Consultation> {
    const result = await db.update(consultations).set(consultation).where(eq(consultations.id, id)).returning();
    return result[0];
  }
  
  // Contact Messages
  async getContactMessages(clientId?: string): Promise<ContactMessage[]> {
    let query = db.select().from(contactMessages);
    if (clientId) {
      query = query.where(eq(contactMessages.clientId, clientId));
    }
    return await query.orderBy(desc(contactMessages.createdAt));
  }
  
  async getContactMessage(id: string): Promise<ContactMessage | undefined> {
    const result = await db.select().from(contactMessages).where(eq(contactMessages.id, id)).limit(1);
    return result[0];
  }
  
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(message).returning();
    return result[0];
  }
  
  async updateContactMessage(id: string, message: Partial<InsertContactMessage>): Promise<ContactMessage> {
    const result = await db.update(contactMessages).set(message).where(eq(contactMessages.id, id)).returning();
    return result[0];
  }
  
  // Testimonials
  async getTestimonials(clientId?: string): Promise<Testimonial[]> {
    let query = db.select().from(testimonials);
    if (clientId) {
      query = query.where(eq(testimonials.clientId, clientId));
    }
    return await query.orderBy(desc(testimonials.createdAt));
  }
  
  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    const result = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
    return result[0];
  }
  
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const result = await db.insert(testimonials).values(testimonial).returning();
    return result[0];
  }
  
  async updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial> {
    const result = await db.update(testimonials).set(testimonial).where(eq(testimonials.id, id)).returning();
    return result[0];
  }
  
  async deleteTestimonial(id: string): Promise<void> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }
  
  // Site Settings
  async getSiteSettings(clientId: string): Promise<SiteSettings | undefined> {
    const result = await db.select().from(siteSettings).where(eq(siteSettings.clientId, clientId)).limit(1);
    return result[0];
  }
  
  async updateSiteSettings(clientId: string, settings: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    const existing = await this.getSiteSettings(clientId);
    
    if (existing) {
      const result = await db.update(siteSettings).set(settings).where(eq(siteSettings.clientId, clientId)).returning();
      return result[0];
    } else {
      const result = await db.insert(siteSettings).values({ ...settings, clientId }).returning();
      return result[0];
    }
  }
  
  // Dashboard stats
  async getDashboardStats(clientId: string): Promise<{
    countries: number;
    universities: number;
    programs: number;
    articles: number;
    consultations: number;
    messages: number;
    testimonials: number;
  }> {
    const [
      countriesCount,
      universitiesCount,
      programsCount,
      articlesCount,
      consultationsCount,
      messagesCount,
      testimonialsCount,
    ] = await Promise.all([
      db.select({ count: count() }).from(countries).where(eq(countries.clientId, clientId)),
      db.select({ count: count() }).from(universities).where(eq(universities.clientId, clientId)),
      db.select({ count: count() }).from(programs).where(eq(programs.clientId, clientId)),
      db.select({ count: count() }).from(articles).where(eq(articles.clientId, clientId)),
      db.select({ count: count() }).from(consultations).where(eq(consultations.clientId, clientId)),
      db.select({ count: count() }).from(contactMessages).where(eq(contactMessages.clientId, clientId)),
      db.select({ count: count() }).from(testimonials).where(eq(testimonials.clientId, clientId)),
    ]);
    
    return {
      countries: countriesCount[0]?.count || 0,
      universities: universitiesCount[0]?.count || 0,
      programs: programsCount[0]?.count || 0,
      articles: articlesCount[0]?.count || 0,
      consultations: consultationsCount[0]?.count || 0,
      messages: messagesCount[0]?.count || 0,
      testimonials: testimonialsCount[0]?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
