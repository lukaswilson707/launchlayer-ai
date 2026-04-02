export const appConfig = {
  appName: "LaunchLayer AI",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plans: [
    { key: "FREE", name: "Free", priceMonthly: 0, domains: 0, sites: 1, aiGenerations: 10 },
    { key: "STARTER", name: "Starter", priceMonthly: 29, domains: 1, sites: 1, aiGenerations: 50 },
    { key: "PRO", name: "Pro", priceMonthly: 79, domains: 3, sites: 3, aiGenerations: 200 },
    { key: "BUSINESS", name: "Business", priceMonthly: 199, domains: 10, sites: 10, aiGenerations: 1000 }
  ]
};
