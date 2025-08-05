import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, DollarSign, Star, TrendingUp, Globe } from "lucide-react";

interface Country {
  id: string;
  name_ar: string;
  slug: string;
  flag_url?: string;
  description_ar?: string;
  study_cost_min?: number;
  study_cost_max?: number;
  language?: string;
  is_trending?: boolean;
  image_url?: string;
}

const Countries = () => {
  const { slug } = useParams();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('countries')
        .select('*')
        .order('name_ar');
      
      setCountries(data || []);
      setLoading(false);
    };

    fetchCountries();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">وجهات الدراسة في الخارج</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            اكتشف أفضل الوجهات الدراسية حول العالم واختر المكان المثالي لمستقبلك الأكاديمي
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((country) => (
            <Card key={country.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden rounded-t-lg">
                {country.image_url ? (
                  <img 
                    src={country.image_url} 
                    alt={country.name_ar}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{country.name_ar}</span>
                  </div>
                )}
                {country.is_trending && (
                  <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    رائج
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <div className="flex items-center gap-3">
                  {country.flag_url && (
                    <img 
                      src={country.flag_url} 
                      alt={`علم ${country.name_ar}`}
                      className="w-8 h-6 rounded object-cover"
                    />
                  )}
                  <CardTitle className="text-xl">{country.name_ar}</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {country.description_ar}
                </p>
                
                <div className="space-y-2 mb-4">
                  {country.study_cost_min && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span>تكلفة الدراسة: ${country.study_cost_min?.toLocaleString()}+</span>
                    </div>
                  )}
                  {country.language && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-primary" />
                      <span>لغة الدراسة: {country.language}</span>
                    </div>
                  )}
                </div>
                
                <Button asChild className="w-full">
                  <Link to={`/countries/${country.slug}`}>
                    اعرف أكثر
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {countries.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold mb-4">لا توجد دول متاحة حالياً</h3>
            <p className="text-muted-foreground">سيتم إضافة المزيد من الوجهات الدراسية قريباً</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Countries;