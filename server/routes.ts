import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertClientSchema,
  insertManagerSchema,
  insertCountrySchema,
  insertUniversitySchema,
  insertProgramSchema,
  insertArticleSchema,
  insertConsultationSchema,
  insertContactMessageSchema,
  insertTestimonialSchema,
  insertSiteSettingsSchema,
} from "@shared/schema";

// Helper function to get client ID from query params or headers
const getClientId = (req: any): string | undefined => {
  return req.query.client_id || req.headers['x-client-id'];
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const manager = await storage.authenticateManager(email, password);
      
      if (!manager) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      res.json({ manager, client: manager.client });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const clientId = getClientId(req);
      if (!clientId) {
        return res.status(400).json({ error: "Client ID required" });
      }
      
      const stats = await storage.getDashboardStats(clientId);
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Countries endpoints
  app.get("/api/countries", async (req, res) => {
    try {
      const clientId = getClientId(req);
      const countries = await storage.getCountries(clientId);
      res.json(countries);
    } catch (error) {
      console.error("Get countries error:", error);
      res.status(500).json({ error: "Failed to fetch countries" });
    }
  });

  app.get("/api/countries/:id", async (req, res) => {
    try {
      const country = await storage.getCountry(req.params.id);
      if (!country) {
        return res.status(404).json({ error: "Country not found" });
      }
      res.json(country);
    } catch (error) {
      console.error("Get country error:", error);
      res.status(500).json({ error: "Failed to fetch country" });
    }
  });

  app.get("/api/countries/slug/:slug", async (req, res) => {
    try {
      const clientId = getClientId(req);
      const country = await storage.getCountryBySlug(req.params.slug, clientId);
      if (!country) {
        return res.status(404).json({ error: "Country not found" });
      }
      res.json(country);
    } catch (error) {
      console.error("Get country by slug error:", error);
      res.status(500).json({ error: "Failed to fetch country" });
    }
  });

  app.post("/api/countries", async (req, res) => {
    try {
      const validatedData = insertCountrySchema.parse(req.body);
      const country = await storage.createCountry(validatedData);
      res.json(country);
    } catch (error) {
      console.error("Create country error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.put("/api/countries/:id", async (req, res) => {
    try {
      const validatedData = insertCountrySchema.partial().parse(req.body);
      const country = await storage.updateCountry(req.params.id, validatedData);
      res.json(country);
    } catch (error) {
      console.error("Update country error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.delete("/api/countries/:id", async (req, res) => {
    try {
      await storage.deleteCountry(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete country error:", error);
      res.status(500).json({ error: "Failed to delete country" });
    }
  });

  // Universities endpoints
  app.get("/api/universities", async (req, res) => {
    try {
      const clientId = getClientId(req);
      const countryId = req.query.country_id as string;
      const universities = await storage.getUniversities(clientId, countryId);
      res.json(universities);
    } catch (error) {
      console.error("Get universities error:", error);
      res.status(500).json({ error: "Failed to fetch universities" });
    }
  });

  app.get("/api/universities/:id", async (req, res) => {
    try {
      const university = await storage.getUniversity(req.params.id);
      if (!university) {
        return res.status(404).json({ error: "University not found" });
      }
      res.json(university);
    } catch (error) {
      console.error("Get university error:", error);
      res.status(500).json({ error: "Failed to fetch university" });
    }
  });

  app.get("/api/universities/slug/:slug", async (req, res) => {
    try {
      const clientId = getClientId(req);
      const university = await storage.getUniversityBySlug(req.params.slug, clientId);
      if (!university) {
        return res.status(404).json({ error: "University not found" });
      }
      res.json(university);
    } catch (error) {
      console.error("Get university by slug error:", error);
      res.status(500).json({ error: "Failed to fetch university" });
    }
  });

  app.post("/api/universities", async (req, res) => {
    try {
      const validatedData = insertUniversitySchema.parse(req.body);
      const university = await storage.createUniversity(validatedData);
      res.json(university);
    } catch (error) {
      console.error("Create university error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.put("/api/universities/:id", async (req, res) => {
    try {
      const validatedData = insertUniversitySchema.partial().parse(req.body);
      const university = await storage.updateUniversity(req.params.id, validatedData);
      res.json(university);
    } catch (error) {
      console.error("Update university error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.delete("/api/universities/:id", async (req, res) => {
    try {
      await storage.deleteUniversity(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete university error:", error);
      res.status(500).json({ error: "Failed to delete university" });
    }
  });

  // Programs endpoints
  app.get("/api/programs", async (req, res) => {
    try {
      const clientId = getClientId(req);
      const universityId = req.query.university_id as string;
      const countryId = req.query.country_id as string;
      const programs = await storage.getPrograms(clientId, universityId, countryId);
      res.json(programs);
    } catch (error) {
      console.error("Get programs error:", error);
      res.status(500).json({ error: "Failed to fetch programs" });
    }
  });

  app.get("/api/programs/:id", async (req, res) => {
    try {
      const program = await storage.getProgram(req.params.id);
      if (!program) {
        return res.status(404).json({ error: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      console.error("Get program error:", error);
      res.status(500).json({ error: "Failed to fetch program" });
    }
  });

  app.get("/api/programs/slug/:slug", async (req, res) => {
    try {
      const clientId = getClientId(req);
      const program = await storage.getProgramBySlug(req.params.slug, clientId);
      if (!program) {
        return res.status(404).json({ error: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      console.error("Get program by slug error:", error);
      res.status(500).json({ error: "Failed to fetch program" });
    }
  });

  app.post("/api/programs", async (req, res) => {
    try {
      const validatedData = insertProgramSchema.parse(req.body);
      const program = await storage.createProgram(validatedData);
      res.json(program);
    } catch (error) {
      console.error("Create program error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.put("/api/programs/:id", async (req, res) => {
    try {
      const validatedData = insertProgramSchema.partial().parse(req.body);
      const program = await storage.updateProgram(req.params.id, validatedData);
      res.json(program);
    } catch (error) {
      console.error("Update program error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.delete("/api/programs/:id", async (req, res) => {
    try {
      await storage.deleteProgram(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete program error:", error);
      res.status(500).json({ error: "Failed to delete program" });
    }
  });

  // Articles endpoints
  app.get("/api/articles", async (req, res) => {
    try {
      const clientId = getClientId(req);
      const articles = await storage.getArticles(clientId);
      res.json(articles);
    } catch (error) {
      console.error("Get articles error:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Get article error:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.get("/api/articles/slug/:slug", async (req, res) => {
    try {
      const clientId = getClientId(req);
      const article = await storage.getArticleBySlug(req.params.slug, clientId);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Get article by slug error:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.json(article);
    } catch (error) {
      console.error("Create article error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.put("/api/articles/:id", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(req.params.id, validatedData);
      res.json(article);
    } catch (error) {
      console.error("Update article error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      await storage.deleteArticle(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete article error:", error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Consultations endpoints
  app.get("/api/consultations", async (req, res) => {
    try {
      const clientId = getClientId(req);
      const consultations = await storage.getConsultations(clientId);
      res.json(consultations);
    } catch (error) {
      console.error("Get consultations error:", error);
      res.status(500).json({ error: "Failed to fetch consultations" });
    }
  });

  app.get("/api/consultations/:id", async (req, res) => {
    try {
      const consultation = await storage.getConsultation(req.params.id);
      if (!consultation) {
        return res.status(404).json({ error: "Consultation not found" });
      }
      res.json(consultation);
    } catch (error) {
      console.error("Get consultation error:", error);
      res.status(500).json({ error: "Failed to fetch consultation" });
    }
  });

  app.post("/api/consultations", async (req, res) => {
    try {
      const validatedData = insertConsultationSchema.parse(req.body);
      const consultation = await storage.createConsultation(validatedData);
      res.json(consultation);
    } catch (error) {
      console.error("Create consultation error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.put("/api/consultations/:id", async (req, res) => {
    try {
      const validatedData = insertConsultationSchema.partial().parse(req.body);
      const consultation = await storage.updateConsultation(req.params.id, validatedData);
      res.json(consultation);
    } catch (error) {
      console.error("Update consultation error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  // Contact Messages endpoints
  app.get("/api/contact-messages", async (req, res) => {
    try {
      const clientId = getClientId(req);
      const messages = await storage.getContactMessages(clientId);
      res.json(messages);
    } catch (error) {
      console.error("Get contact messages error:", error);
      res.status(500).json({ error: "Failed to fetch contact messages" });
    }
  });

  app.get("/api/contact-messages/:id", async (req, res) => {
    try {
      const message = await storage.getContactMessage(req.params.id);
      if (!message) {
        return res.status(404).json({ error: "Contact message not found" });
      }
      res.json(message);
    } catch (error) {
      console.error("Get contact message error:", error);
      res.status(500).json({ error: "Failed to fetch contact message" });
    }
  });

  app.post("/api/contact-messages", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json(message);
    } catch (error) {
      console.error("Create contact message error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.put("/api/contact-messages/:id", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.partial().parse(req.body);
      const message = await storage.updateContactMessage(req.params.id, validatedData);
      res.json(message);
    } catch (error) {
      console.error("Update contact message error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  // Testimonials endpoints
  app.get("/api/testimonials", async (req, res) => {
    try {
      const clientId = getClientId(req);
      const testimonials = await storage.getTestimonials(clientId);
      res.json(testimonials);
    } catch (error) {
      console.error("Get testimonials error:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/testimonials/:id", async (req, res) => {
    try {
      const testimonial = await storage.getTestimonial(req.params.id);
      if (!testimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      console.error("Get testimonial error:", error);
      res.status(500).json({ error: "Failed to fetch testimonial" });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.json(testimonial);
    } catch (error) {
      console.error("Create testimonial error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.put("/api/testimonials/:id", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(req.params.id, validatedData);
      res.json(testimonial);
    } catch (error) {
      console.error("Update testimonial error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.delete("/api/testimonials/:id", async (req, res) => {
    try {
      await storage.deleteTestimonial(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete testimonial error:", error);
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  // Site Settings endpoints
  app.get("/api/site-settings", async (req, res) => {
    try {
      const clientId = getClientId(req);
      if (!clientId) {
        return res.status(400).json({ error: "Client ID required" });
      }
      
      const settings = await storage.getSiteSettings(clientId);
      res.json(settings);
    } catch (error) {
      console.error("Get site settings error:", error);
      res.status(500).json({ error: "Failed to fetch site settings" });
    }
  });

  app.put("/api/site-settings", async (req, res) => {
    try {
      const clientId = getClientId(req);
      if (!clientId) {
        return res.status(400).json({ error: "Client ID required" });
      }
      
      const validatedData = insertSiteSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateSiteSettings(clientId, validatedData);
      res.json(settings);
    } catch (error) {
      console.error("Update site settings error:", error);
      res.status(400).json({ error: "Invalid input" });
    }
  });

  // GitHub repo creation endpoint (replacing Supabase Edge Function)
  app.post("/api/create-github-repo", async (req, res) => {
    try {
      const { siteName, slug, clientId } = req.body;
      
      // This would require GitHub API integration
      // For now, return a placeholder response
      res.json({
        success: true,
        repoUrl: `https://github.com/studyabroad-sites/${slug}-studyabroad`,
        repoName: `${slug}-studyabroad`,
        message: 'Repository creation functionality needs GitHub API integration'
      });
    } catch (error) {
      console.error("Create GitHub repo error:", error);
      res.status(500).json({ error: "Failed to create GitHub repository" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
