import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { generateFastLoadData } from '@/utils/fastLoadData';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateFastLoad = async () => {
    setIsGenerating(true);
    
    try {
      const success = await generateFastLoadData();
      
      if (success) {
        setLastGenerated(new Date().toISOString());
        toast({
          title: "Fast-Load Data Generated",
          description: "Critical site data has been pre-built for instant loading. Your site will now load faster with no layout shifts!",
          duration: 5000,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: "Failed to generate fast-load data. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive", 
        title: "Error",
        description: "An unexpected error occurred while generating fast-load data.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your restaurant website's performance and content</p>
      </div>

      <div className="grid gap-6">
        {/* Performance Optimization Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>Performance Optimization</CardTitle>
            </div>
            <CardDescription>
              Pre-build critical site data for instant loading and zero layout shifts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">What gets pre-built:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Header and footer logos</li>
                <li>• Hero section images and text</li>
                <li>• Primary colors and theme settings</li>
                <li>• Navigation structure (reviews, delivery links)</li>
                <li>• Restaurant contact information</li>
              </ul>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Fast-Load Data Status</div>
                <div className="text-sm text-muted-foreground">
                  {lastGenerated ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Last generated: {new Date(lastGenerated).toLocaleString()}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      Not generated yet - site loading from database
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                onClick={handleGenerateFastLoad}
                disabled={isGenerating}
                className="min-w-[140px]"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Now
                  </>
                )}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <strong>Tip:</strong> Run this after making changes to logos, hero images, colors, or navigation settings to instantly improve your site's loading performance.
            </div>
          </CardContent>
        </Card>

        {/* Future admin features can be added here */}
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Content Management</CardTitle>
            <CardDescription>
              Advanced content editing tools (coming soon)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Menu management, review moderation, and other admin tools will be available here.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;