const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: "demo@launchlayer.ai" } });
  if (existing) return;

  const user = await prisma.user.create({
    data: {
      email: "demo@launchlayer.ai",
      name: "Demo Owner",
      workspaces: {
        create: {
          name: "Demo Workspace",
          plan: "PRO",
          websites: {
            create: {
              name: "Wilsons Coaching",
              slug: "wilsons-coaching",
              prompt: "Build a premium fitness coaching website with black and white styling, testimonials, FAQ, pricing, and a lead capture funnel.",
              niche: "Fitness coaching",
              theme: "Luxury dark",
              status: "PUBLISHED",
              seoTitle: "Wilsons Coaching",
              seoDescription: "Premium online fitness coaching",
              generatedJson: JSON.stringify({
                sections: [
                  { type: "hero", headline: "Build a stronger physique with premium coaching" },
                  { type: "offers", items: ["Training", "Nutrition", "Check ins"] }
                ]
              }),
              pages: {
                create: [
                  {
                    title: "Home",
                    slug: "/",
                    order: 0,
                    contentJson: JSON.stringify({
                      sections: [
                        {
                          type: "hero",
                          headline: "Build a stronger physique with a premium coaching system",
                          subheadline: "Custom training, nutrition, accountability, and a site funnel built to convert clients.",
                          ctaPrimary: "Apply now",
                          ctaSecondary: "View results"
                        },
                        {
                          type: "features",
                          items: ["Custom training", "Nutrition plan", "Weekly check ins", "Client dashboard"]
                        },
                        {
                          type: "leadForm",
                          headline: "Apply for 1 to 1 coaching"
                        }
                      ]
                    })
                  }
                ]
              },
              versions: {
                create: {
                  label: "Initial version",
                  snapshotJson: JSON.stringify({ version: 1 })
                }
              },
              chatMessages: {
                create: [
                  { role: "ai", content: "I generated a homepage, about page, pricing, FAQ, and contact funnel." },
                  { role: "user", content: "Make the copy more premium." },
                  { role: "ai", content: "Done. I tightened the headline and premium tone." }
                ]
              },
              customDomain: {
                create: {
                  hostname: "wilsonscoaching.com",
                  provider: "manual",
                  verified: true,
                  sslEnabled: true
                }
              },
              analytics: {
                create: {
                  date: new Date(),
                  visits: 4201,
                  leads: 62,
                  conversions: 6.9
                }
              },
              leads: {
                create: [
                  { name: "Alex Rivera", email: "alex@example.com", message: "Interested in coaching." },
                  { name: "Jordan Cruz", email: "jordan@example.com", message: "Want to learn pricing." }
                ]
              }
            }
          },
          subscription: {
            create: {
              status: "active"
            }
          }
        }
      }
    }
  });

  console.log("Seeded user", user.email);
}

main().finally(() => prisma.$disconnect());
